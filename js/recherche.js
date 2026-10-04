// Version : 1.0
/* =====================================================================
   QuantumSite — recherche unique du site (barre à droite du menu horizontal)
   ---------------------------------------------------------------------
   Même fonctionnement que la recherche de MathSite :
   - plusieurs mots séparés par des espaces => recherche en OU (au moins un mot trouvé) ;
     si le signe « + » est présent, les termes qu'il sépare sont recherchés en ET ;
   - sans accents ni majuscules, l'apostrophe typographique ’ valant ' ;
   - les résultats s'affichent à chaque frappe, en trois familles :
       1) les MENUS : entrées du menu horizontal et thèmes des pages de fiches ;
       2) les FICHES des pages Fiches Quantiques, Fiches Mathématiques, Axiomisation…
          (titre, formule, définition) ;
       3) les PAGES : chaque partie des pages de texte (Fondations, Philosophie…) ;
     une fiche ou une partie trouvée par son contenu s'affiche avec un extrait où les mots
     cherchés sont surlignés ; les résultats dont le TITRE contient les mots passent d'abord ;
   - 50 résultats par famille, puis « Afficher plus » ; liens « Aller à » entre familles ;
   - champ vidé => retour à la page ; clic en dehors de la barre => le champ se vide,
     les résultats restent affichés et cliquables.
   Ajouts propres à QuantumSite (site en plusieurs pages) : les résultats s'affichent
   par-dessus la page courante ; Échap ou « Fermer » les referme.

   L'index est construit automatiquement à partir du site lui-même : les pages du menu
   horizontal et les fichiers donnees/*.js qu'elles chargent. Une page ou une fiche
   ajoutée au site est donc trouvée sans rien changer ici.
   (Il faut que le site soit servi par un serveur web, comme GitHub Pages ; ouvert en
   fichier local, seules les entrées du menu sont trouvées.)
   ===================================================================== */
(function () {
  "use strict";

  const SEARCH_PAGE_SIZE = 50;

  /* ---------- Texte : normalisation, échappement ---------- */

  function normalize(s) {
    return s ? String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  }

  function normalizeForSearch(s) {
    return normalize(s).replace(/[\u2018\u2019\u02BC\u00B4]/g, "'");
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  const analyseur = new DOMParser();
  function texteBrut(html) {
    if (html == null) return "";
    return analyseur.parseFromString(String(html), "text/html").body.textContent
      .replace(/\s+/g, " ").trim();
  }

  const slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* ---------- Requête et score (identiques à MathSite) ---------- */

  function parseSearchQuery(rawQuery) {
    const q = (rawQuery || "").trim();
    if (q.includes("+")) {
      return { mode: "and", terms: q.split("+").map(s => normalizeForSearch(s.trim())).filter(Boolean) };
    }
    return { mode: "or", terms: q.split(/\s+/).map(s => normalizeForSearch(s.trim())).filter(Boolean) };
  }

  function countSearchTerms(haystack, parsed) {
    let hits = 0;
    parsed.terms.forEach(t => { if (haystack.includes(t)) hits++; });
    return hits;
  }

  function scoreSearchTerms(haystack, parsed) {
    if (!parsed.terms.length) return 0;
    const hits = countSearchTerms(haystack, parsed);
    if (parsed.mode === "and") return hits === parsed.terms.length ? hits : 0;
    return hits;
  }

  function searchMenuEntries(list, parsed) {
    const scored = [];
    list.forEach(e => {
      const s = scoreSearchTerms(e.hay, parsed);
      if (s > 0) scored.push({ e, s });
    });
    scored.sort((a, b) => b.s - a.s);            // tri stable : à score égal, l'ordre du menu
    return scored.map(x => x.e);
  }

  // Titre d'abord, puis contenu ; à égalité, plus de termes trouvés = plus haut.
  function searchDeepEntries(list, parsed) {
    const scored = [];
    list.forEach(e => {
      const s = scoreSearchTerms(e.deep, parsed);
      if (s > 0) scored.push({ e, t: countSearchTerms(e.hay, parsed), s });
    });
    scored.sort((a, b) => (b.t - a.t) || (b.s - a.s));
    return scored.map(x => x.e);
  }

  /* ---------- Extrait surligné (identique à MathSite) ---------- */

  function normalizeWithMap(text) {
    let norm = "";
    const start = [], end = [];
    let i = 0;
    for (const ch of text) {
      const n = normalizeForSearch(ch);
      for (let k = 0; k < n.length; k++) { start.push(i); end.push(i + ch.length); }
      norm += n;
      i += ch.length;
    }
    return { norm, start, end };
  }

  function buildDeepSnippet(e, parsed) {
    if (!parsed || !parsed.terms || !e.fields) return "";
    const bodyTerms = parsed.terms.filter(t => e.deep.includes(t) && !e.hay.includes(t));
    if (!bodyTerms.length) return "";

    for (const f of e.fields) {
      const m = normalizeWithMap(f.text);
      const positions = bodyTerms.map(t => m.norm.indexOf(t)).filter(pos => pos >= 0);
      if (!positions.length) continue;
      const first = Math.min(...positions);

      let ns = Math.max(0, first - 60);
      while (ns > 0 && m.norm[ns - 1] !== " " && first - ns < 75) ns--;
      let ne = Math.min(m.norm.length, first + 110);
      while (ne < m.norm.length && m.norm[ne] !== " " && ne - first < 125) ne++;

      const ranges = [];
      parsed.terms.forEach(t => {
        let pos = m.norm.indexOf(t, ns);
        while (pos >= 0 && pos < ne) {
          ranges.push([m.start[pos], m.end[Math.min(pos + t.length, m.norm.length) - 1]]);
          pos = m.norm.indexOf(t, pos + t.length);
        }
      });
      ranges.sort((a, b) => a[0] - b[0]);
      const merged = [];
      ranges.forEach(r => {
        const last = merged[merged.length - 1];
        if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
        else merged.push(r.slice());
      });

      const os = m.start[ns];
      let oe = ne >= m.norm.length ? f.text.length : m.start[ne];
      merged.forEach(r => { if (r[1] > oe) oe = r[1]; });

      let html = "";
      let cursor = os;
      merged.forEach(([a, b]) => {
        html += escapeHtml(f.text.slice(cursor, a)) + "<mark>" + escapeHtml(f.text.slice(a, b)) + "</mark>";
        cursor = b;
      });
      html += escapeHtml(f.text.slice(cursor, oe));
      return `<span class="search-snippet-field">${escapeHtml(f.label)}</span> ${os > 0 ? "…" : ""}${html}${oe < f.text.length ? "…" : ""}`;
    }
    return "";
  }

  /* ---------- Index du site ---------- */
  // Entrée : { n, group ("menus" | "fiches" | "pages"), label, hay, deep?, fields?,
  //            tag, tagClass, path, url }

  const COULEURS_SERIES = ["tag-cyan", "tag-or", "tag-rouge", "tag-violet", "tag-vert"];
  let indexPromesse = null;

  function urlPage(href) {
    try {
      const u = new URL(href, location.href);
      return u.origin === location.origin && /\.html?$/.test(u.pathname) ? u : null;
    } catch (e) { return null; }
  }

  async function chargerTexte(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status + " " + url);
    return r.text();
  }

  // Exécute un fichier de données dans sa propre portée et renvoie son JEU_DE_FICHES.
  function lireJeu(code) {
    const faux = {};
    new Function("window", code + "\n;")(faux);
    return faux.JEU_DE_FICHES || null;
  }

  async function construireIndex() {
    const idx = { all: [], menus: [], fiches: [], pages: [] };
    const add = (group, e) => {
      e.n = idx.all.length;
      e.group = group;
      e.hay = normalizeForSearch(e.label);
      if (e.fields) e.deep = normalizeForSearch([e.label].concat(e.fields.map(f => f.text)).join("\n"));
      idx.all.push(e);
      idx[group].push(e);
      return e;
    };

    // 1) Menu horizontal — lu dans la barre du haut de la page courante.
    const liens = [...document.querySelectorAll(".menu a[href]")]
      .map(a => ({ label: a.textContent.trim(), url: urlPage(a.getAttribute("href")) }))
      .filter(l => l.label && l.url);

    // Chaque page du menu est lue une seule fois.
    const pages = await Promise.all(liens.map(async l => {
      try { return { lien: l, doc: analyseur.parseFromString(await chargerTexte(l.url.href), "text/html") }; }
      catch (e) { return { lien: l, doc: null }; }
    }));

    pages.forEach(({ lien, doc }) => {
      const desc = doc && doc.querySelector('meta[name="description"]');
      add("menus", {
        label: lien.label, tag: "Menu horizontal", tagClass: "tag-menu",
        path: desc ? desc.getAttribute("content") : "", url: lien.url.href
      });
    });

    let serie = 0;
    for (const { lien, doc } of pages) {
      if (!doc) continue;
      const titrePage = (doc.querySelector("main h1") || {}).textContent || lien.label;

      // 2) Pages de fiches : fichiers donnees/*.js chargés par la page.
      const scripts = [...doc.querySelectorAll('script[src*="donnees/"]')];
      for (const s of scripts) {
        let jeu = null;
        try { jeu = lireJeu(await chargerTexte(new URL(s.getAttribute("src"), lien.url).href)); }
        catch (e) { console.warn("Recherche : données illisibles", s.getAttribute("src"), e); }
        if (!jeu || !Array.isArray(jeu.cartes)) continue;
        const tagClass = COULEURS_SERIES[serie++ % COULEURS_SERIES.length];

        (jeu.themes || []).forEach(theme => {
          const nb = jeu.cartes.filter(c => c.theme === theme).length;
          add("menus", {
            label: theme, tag: "Thème", tagClass,
            path: `${lien.label} · ${nb} fiche(s)`,
            url: lien.url.pathname.split("/").pop() + "#" + slug(theme)
          });
        });

        jeu.cartes.forEach(c => {
          const fields = [];
          if (c.fx) fields.push({ label: "Formule", text: texteBrut(c.fx) });
          if (c.def) fields.push({ label: "Définition", text: texteBrut(c.def) });
          add("fiches", {
            label: texteBrut(c.term), tag: lien.label, tagClass,
            path: `${c.theme}, n° ${c.n}`, fields,
            url: lien.url.pathname.split("/").pop() + "#" + slug(c.theme) + "/" + c.n
          });
        });
      }

      // 3) Pages de texte : chaque partie qui porte un id et un titre h2.
      doc.querySelectorAll("main [id]").forEach(partie => {
        const h2 = partie.querySelector(":scope > h2, :scope > header h2");
        if (!h2) return;
        const fields = [];
        let rubrique = h2.textContent.trim();
        partie.querySelectorAll("h3, p, li").forEach(el => {
          if (el.closest("[id]") !== partie && el.closest("[id]") !== el) return;   // parties imbriquées : ignorées ici
          const texte = el.textContent.replace(/\s+/g, " ").trim();
          if (!texte) return;
          if (el.tagName === "H3") { rubrique = texte; return; }
          if (el.classList.contains("postulat-numero")) return;
          fields.push({ label: el.classList.contains("question") ? "Question" : rubrique, text: texte });
        });
        add("pages", {
          label: h2.textContent.replace(/\s+/g, " ").trim(), tag: lien.label, tagClass: "tag-page",
          path: titrePage.trim() === lien.label ? lien.label : `${lien.label} › ${titrePage.trim()}`,
          fields, url: lien.url.pathname.split("/").pop() + "#" + partie.id
        });
      });
    }
    return idx;
  }

  function obtenirIndex() {
    if (!indexPromesse) {
      indexPromesse = construireIndex().catch(err => {
        console.error("Index de recherche indisponible :", err);
        return { all: [], menus: [], fiches: [], pages: [] };
      });
    }
    return indexPromesse;
  }

  /* ---------- Affichage des résultats ---------- */

  let panneau = null, contenu = null;
  let searchPagers = {};
  let indexCourant = null;

  function creerPanneau() {
    if (panneau) return;
    panneau = document.createElement("section");
    panneau.id = "resultats-recherche";
    panneau.className = "resultats-recherche";
    panneau.hidden = true;
    panneau.setAttribute("aria-label", "Résultats de recherche");
    panneau.innerHTML = `<div class="resultats-contenu"></div>`;
    document.body.appendChild(panneau);
    contenu = panneau.firstElementChild;

    panneau.addEventListener("click", e => {
      if (e.target.closest("[data-fermer]")) { e.preventDefault(); fermer(); return; }
      const saut = e.target.closest("[data-aller]");
      if (saut) {
        e.preventDefault();
        const el = document.getElementById("search-grp-" + saut.dataset.aller);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const plus = e.target.closest("[data-plus]");
      if (plus) { showMoreSearchHits(plus.dataset.plus); return; }
      const lien = e.target.closest("a.search-menu-item");
      if (lien && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
        const u = new URL(lien.getAttribute("href"), location.href);
        if (u.pathname === location.pathname) {      // même page : on referme et on y va
          e.preventDefault();
          fermer();
          if (u.hash && u.hash !== location.hash) location.hash = u.hash;
          else if (u.hash) {
            const cible = document.getElementById(decodeURIComponent(u.hash.slice(1)));
            if (cible) cible.scrollIntoView({ block: "start" });
          }
        }
      }
    });
  }

  function ouvrir() {
    creerPanneau();
    panneau.hidden = false;
    document.documentElement.classList.add("recherche-ouverte");
  }

  function fermer() {
    if (!panneau) return;
    panneau.hidden = true;
    document.documentElement.classList.remove("recherche-ouverte");
  }

  function renderMenuHitRow(e, parsed) {
    const snippet = parsed ? buildDeepSnippet(e, parsed) : "";
    return `
      <a class="search-menu-item" href="${escapeHtml(e.url)}">
        <span class="card-niveau-tag ${e.tagClass || "tag-menu"}">${escapeHtml(e.tag)}</span>
        <span class="search-menu-text">
          <span class="search-menu-label">${escapeHtml(e.label)}</span>
          ${e.path ? `<span class="search-menu-path">${escapeHtml(e.path)}</span>` : ""}
          ${snippet ? `<span class="search-menu-snippet">${snippet}</span>` : ""}
        </span>
      </a>`;
  }

  function renderSearchGroup(groupId, title, hits, parsed) {
    const shown = Math.min(SEARCH_PAGE_SIZE, hits.length);
    searchPagers[groupId] = { hits, shown, parsed };
    return `
      <h2 class="search-group-title" id="search-grp-${groupId}">${escapeHtml(title)} <span class="search-group-count">${hits.length}</span></h2>
      <div class="search-menu-list" id="search-list-${groupId}">
        ${hits.slice(0, shown).map(h => renderMenuHitRow(h, parsed)).join("")}
      </div>
      ${hits.length > shown ? `<button type="button" class="search-more" id="search-more-${groupId}" data-plus="${groupId}">Afficher plus (${hits.length - shown} restants)</button>` : ""}
    `;
  }

  function showMoreSearchHits(groupId) {
    const pager = searchPagers[groupId];
    const list = document.getElementById(`search-list-${groupId}`);
    if (!pager || !list) return;
    const next = Math.min(pager.shown + SEARCH_PAGE_SIZE, pager.hits.length);
    list.insertAdjacentHTML("beforeend", pager.hits.slice(pager.shown, next).map(h => renderMenuHitRow(h, pager.parsed)).join(""));
    pager.shown = next;
    const btn = document.getElementById(`search-more-${groupId}`);
    if (!btn) return;
    if (next >= pager.hits.length) btn.remove();
    else btn.textContent = `Afficher plus (${pager.hits.length - next} restants)`;
  }

  function showSearchResults(rawQuery, idx) {
    const q = rawQuery.trim();
    const parsed = parseSearchQuery(q);
    const menuHits = searchMenuEntries(idx.menus, parsed);
    const ficheHits = searchDeepEntries(idx.fiches, parsed);
    const pageHits = searchDeepEntries(idx.pages, parsed);
    const total = menuHits.length + ficheHits.length + pageHits.length;

    searchPagers = {};
    const groups = [];
    let body = "";
    if (menuHits.length) {
      groups.push(["menus", "Menus", menuHits.length]);
      body += renderSearchGroup("menus", "Menus", menuHits, parsed);
    }
    if (ficheHits.length) {
      groups.push(["fiches", "Fiches", ficheHits.length]);
      body += renderSearchGroup("fiches", "Fiches", ficheHits, parsed);
    }
    if (pageHits.length) {
      groups.push(["pages", "Pages", pageHits.length]);
      body += renderSearchGroup("pages", "Pages", pageHits, parsed);
    }
    if (!total) {
      body = `<p class="empty">Aucun résultat pour « ${escapeHtml(q)} ».</p>`;
    }

    const jumps = groups.length > 1
      ? `<p class="search-jumps">Aller à : ${groups.map(g =>
          `<a href="#" data-aller="${g[0]}">${escapeHtml(g[1])} (${g[2]})</a>`).join("")}</p>`
      : "";

    contenu.innerHTML = `
      <div class="resultats-entete">
        <h1>Résultats de recherche</h1>
        <button type="button" class="resultats-fermer" data-fermer>Fermer</button>
      </div>
      <p class="subtitle">« ${escapeHtml(q)} » — ${total} résultat(s)</p>
      ${jumps}
      ${body}
    `;
    panneau.scrollTop = 0;
  }

  /* ---------- Barre de recherche ---------- */

  let derniereRequete = "";

  async function rechercher(raw) {
    derniereRequete = raw;
    if (!raw.trim()) { fermer(); return; }
    ouvrir();
    if (!indexCourant) {
      contenu.innerHTML = `<div class="resultats-entete"><h1>Résultats de recherche</h1>
        <button type="button" class="resultats-fermer" data-fermer>Fermer</button></div>
        <p class="subtitle">Préparation de l'index du site…</p>`;
      indexCourant = await obtenirIndex();
      if (derniereRequete !== raw) return;            // une frappe plus récente a pris le relais
    }
    showSearchResults(raw, indexCourant);
  }

  document.addEventListener("input", e => {
    if (e.target.id !== "global-search") return;
    rechercher(e.target.value);
  });

  // Clic en dehors de la barre : le champ se vide, les résultats restent affichés et cliquables.
  document.addEventListener("pointerdown", e => {
    const input = document.getElementById("global-search");
    if (!input || !input.value) return;
    if (e.target.closest && e.target.closest(".nav-search")) return;
    input.value = "";
  });

  // Résultats ouverts : Échap les referme, et les raccourcis clavier de la page
  // (fiches : flèches, R, C…) ne s'appliquent pas à la page cachée dessous.
  window.addEventListener("keydown", e => {
    if (!panneau || panneau.hidden) return;
    if (e.key === "Escape") { fermer(); e.preventDefault(); }
    e.stopPropagation();
  }, true);

  // Index préparé en tâche de fond, pour que la première frappe n'attende pas.
  function prechauffer() { obtenirIndex().then(idx => { indexCourant = idx; }); }
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(prechauffer, { timeout: 4000 });
  } else {
    setTimeout(prechauffer, 1500);
  }
})();
