// Version : 1.0
/* =====================================================================
   QuantumSite — moteur des pages de fiches
   ---------------------------------------------------------------------
   Lit window.JEU_DE_FICHES (donnees/*.js) et affiche :
   - la vue « thèmes » : une vignette par thème, plus Toutes et À revoir ;
   - la vue « paquet » : les fiches du thème choisi, une à la fois.
   Le thème ouvert est noté dans l'adresse (#mesure), ce qui fait marcher
   le bouton Précédent du navigateur et les liens directs.
   Les marques « Je la connais » / « À revoir » restent dans le navigateur.
   ===================================================================== */
(function () {
  "use strict";

  const jeu = window.JEU_DE_FICHES;
  const racine = document.getElementById("fiches");
  if (!jeu || !racine) return;

  const TOUTES = "Toutes";
  const A_REVOIR = "À revoir";
  const cartes = jeu.cartes;
  const total = cartes.length;

  /* ---------- Utilitaires ---------- */

  const slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const pluriel = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");

  const listeThemes = [TOUTES].concat(jeu.themes, [A_REVOIR]);
  const themeParSlug = {};
  listeThemes.forEach(t => { themeParSlug[slug(t)] = t; });

  /* ---------- Marques (même format que les anciennes pages) ---------- */

  let marques = {};
  function lireMarques() {
    try {
      const brut = localStorage.getItem(jeu.cle);
      const v = brut ? JSON.parse(brut) : {};
      marques = v && typeof v === "object" ? v : {};
    } catch (e) { marques = {}; }
  }
  function ecrireMarques() {
    try { localStorage.setItem(jeu.cle, JSON.stringify(marques)); } catch (e) { /* stockage indisponible */ }
  }

  function cartesDuTheme(theme) {
    if (theme === TOUTES) return cartes.slice();
    if (theme === A_REVOIR) return cartes.filter(c => marques[c.n] === "rev");
    return cartes.filter(c => c.theme === theme);
  }

  /* ---------- Illustrations ---------- */

  function illustration(c, petite) {
    if (!c._svg) c._svg = c.art();
    return `<svg class="ill${petite ? " petite" : ""}" viewBox="0 0 200 140" role="img" aria-label="Illustration : ${c.term}">${c._svg}</svg>`;
  }

  /* ================= Vue « thèmes » ================= */

  let confirmationEffacer = false;

  function afficherThemes() {
    document.title = "QuantumSite — " + jeu.titre;
    const ok = cartes.filter(c => marques[c.n] === "ok").length;
    const rev = cartes.filter(c => marques[c.n] === "rev").length;
    const libres = total - ok - rev;

    const vignettes = listeThemes.map(theme => {
      const liste = cartesDuTheme(theme);
      const n = liste.length;
      const connues = liste.filter(c => marques[c.n] === "ok").length;
      const classes = ["vignette"];
      if (theme === TOUTES) classes.push("vignette-toutes");
      if (theme === A_REVOIR) classes.push("vignette-a-revoir");
      const detail = theme === A_REVOIR
        ? pluriel(n, "fiche")
        : pluriel(n, "fiche") + (connues ? ", " + connues + " connue" + (connues > 1 ? "s" : "") : "");
      const jauge = theme === A_REVOIR || n === 0 ? ""
        : `<span class="vignette-jauge" aria-hidden="true"><span style="width:${(connues / n * 100).toFixed(1)}%"></span></span>`;
      return `
        <li>
          <a class="${classes.join(" ")}" href="#${slug(theme)}">
            <span class="vignette-symbole" aria-hidden="true">${jeu.symboles[theme] || ""}</span>
            <span class="vignette-nom">${theme}</span>
            <span class="vignette-compte">${detail}</span>
            ${jauge}
          </a>
        </li>`;
    }).join("");

    racine.className = "fiches vue-themes";
    racine.innerHTML = `
      <div class="themes">
        <h1 class="themes-titre">${jeu.titre}</h1>
        <p class="themes-intro">${total} fiches réparties en ${jeu.themes.length} thèmes. Choisis un thème pour commencer.</p>
        <p class="themes-bilan">${pluriel(ok, "connue")}, ${rev} à revoir, ${libres} pas encore marquée${libres > 1 ? "s" : ""}</p>
        <ul class="grille-vignettes">${vignettes}</ul>
        <p class="themes-pied">
          <button class="lien" type="button" data-action="effacer">Effacer mes marques</button>
        </p>
      </div>`;
    confirmationEffacer = false;
    window.scrollTo(0, 0);
  }

  /* ================= Vue « paquet » ================= */

  let themeCourant = null;
  let paquet = [];
  let position = 0;
  let retournee = false;
  let melange = false;
  let definitionDabord = false;

  function construirePaquet() {
    paquet = cartesDuTheme(themeCourant);
    if (melange) {
      for (let i = paquet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [paquet[i], paquet[j]] = [paquet[j], paquet[i]];
      }
    }
  }

  function ouvrirPaquet(theme) {
    themeCourant = theme;
    position = 0;
    retournee = false;
    construirePaquet();
    document.title = "QuantumSite — " + theme;

    racine.className = "fiches vue-paquet";
    racine.innerHTML = `
      <div class="paquet">
        <div class="paquet-barre">
          <a class="bouton-retour" href="#">Retour aux thèmes</a>
          <h1 class="paquet-titre"><span class="paquet-symbole" aria-hidden="true">${jeu.symboles[theme] || ""}</span>${theme}</h1>
          <span class="paquet-compteur" aria-live="polite"></span>
        </div>
        <div class="paquet-progression" aria-hidden="true"><span></span></div>
        <div class="paquet-scene"></div>
        <div class="paquet-commandes">
          <div class="rangee">
            <button class="bouton" type="button" data-action="precedente">Précédente</button>
            <button class="bouton bouton-principal" type="button" data-action="suivante">Suivante</button>
          </div>
          <div class="rangee">
            <button class="bouton bouton-revoir" type="button" data-action="rev" aria-pressed="false">À revoir</button>
            <button class="bouton bouton-connue" type="button" data-action="ok" aria-pressed="false">Je la connais</button>
          </div>
          <div class="options">
            <label><input type="checkbox" data-option="melange"${melange ? " checked" : ""}> Mélanger</label>
            <label><input type="checkbox" data-option="definition"${definitionDabord ? " checked" : ""}> Définition d’abord</label>
          </div>
          <p class="clavier">Clavier : flèches pour naviguer, Espace pour retourner, R pour « À revoir », C pour « Je la connais », Échap pour revenir aux thèmes. Sur mobile, balaie la carte.</p>
        </div>
      </div>`;
    window.scrollTo(0, 0);
    afficherCarte(true);
  }

  function afficherCarte(donnerFocus) {
    const scene = racine.querySelector(".paquet-scene");
    const compteur = racine.querySelector(".paquet-compteur");
    const jauge = racine.querySelector(".paquet-progression span");
    const boutons = racine.querySelectorAll(".paquet-commandes .bouton");

    if (paquet.length === 0) {
      compteur.textContent = "";
      jauge.style.width = "0";
      boutons.forEach(b => { b.disabled = true; });
      scene.innerHTML = `
        <div class="paquet-vide">
          <p>${themeCourant === A_REVOIR
            ? "Aucune fiche à revoir pour l’instant. Pendant une révision, le bouton « À revoir » met une fiche de côté : elle apparaîtra ici."
            : "Aucune fiche dans ce thème pour l’instant."}</p>
          <a class="bouton" href="#">Retour aux thèmes</a>
        </div>`;
      return;
    }

    boutons.forEach(b => { b.disabled = false; });
    const c = paquet[position];
    const derniere = position === paquet.length - 1;
    racine.querySelector('[data-action="precedente"]').disabled = position === 0;
    racine.querySelector('[data-action="suivante"]').textContent = derniere ? "Recommencer" : "Suivante";
    racine.querySelector('[data-action="rev"]').setAttribute("aria-pressed", String(marques[c.n] === "rev"));
    racine.querySelector('[data-action="ok"]').setAttribute("aria-pressed", String(marques[c.n] === "ok"));

    compteur.textContent = (position + 1) + " / " + paquet.length;
    jauge.style.width = ((position + 1) / paquet.length * 100) + "%";

    const meta = `<p class="carte-meta">${c.theme}, n° ${c.n}</p>`;
    const formule = c.fx ? `<p class="carte-formule">${c.fx}</p>` : "";
    let recto, verso;
    if (!definitionDabord) {
      recto = `${illustration(c)}${meta}<h2 class="carte-terme">${c.term}</h2><p class="carte-aide">${jeu.indice}</p>`;
      verso = `${illustration(c, true)}${meta}<h2 class="carte-terme petit">${c.term}</h2>${formule}<p class="carte-definition">${c.def}</p>`;
    } else {
      recto = `<p class="carte-meta">${c.theme}</p>${formule}<p class="carte-definition">${c.def}</p><p class="carte-aide">Quelle est cette notion ? Touche la carte pour vérifier.</p>`;
      verso = `${illustration(c)}${meta}<h2 class="carte-terme">${c.term}</h2>`;
    }

    retournee = false;
    scene.innerHTML = `
      <div class="carte" tabindex="0" role="button" aria-label="Retourner la carte">
        <div class="carte-interieur">
          <div class="carte-face carte-recto">${recto}</div>
          <div class="carte-face carte-verso" aria-hidden="true">${verso}</div>
        </div>
      </div>`;
    if (donnerFocus !== false) scene.querySelector(".carte").focus({ preventScroll: true });
  }

  function retourner() {
    const carte = racine.querySelector(".carte");
    if (!carte) return;
    retournee = !retournee;
    carte.classList.toggle("retournee", retournee);
    carte.querySelector(".carte-recto").setAttribute("aria-hidden", String(retournee));
    carte.querySelector(".carte-verso").setAttribute("aria-hidden", String(!retournee));
  }

  function aller(delta) {
    if (!paquet.length) return;
    const cible = position + delta;
    if (cible < 0) return;
    position = cible >= paquet.length ? 0 : cible;   // après la dernière : on recommence
    afficherCarte();
  }

  function marquer(etat) {
    const c = paquet[position];
    if (!c) return;
    const annulation = marques[c.n] === etat;
    if (annulation) delete marques[c.n]; else marques[c.n] = etat;
    ecrireMarques();

    if (themeCourant === A_REVOIR) {
      // Dans « À revoir », une fiche qui n'est plus à revoir quitte le paquet.
      if (marques[c.n] !== "rev") {
        paquet.splice(position, 1);
        if (position >= paquet.length) position = Math.max(0, paquet.length - 1);
      }
    } else if (!annulation && position < paquet.length - 1) {
      position++;                                      // on passe à la suivante après avoir marqué
    }
    afficherCarte();
  }

  /* ---------- Événements ---------- */

  racine.addEventListener("click", e => {
    if (e.target.closest(".carte")) { retourner(); return; }
    const bouton = e.target.closest("[data-action]");
    if (!bouton) return;
    switch (bouton.dataset.action) {
      case "precedente": aller(-1); break;
      case "suivante": aller(1); break;
      case "rev": marquer("rev"); break;
      case "ok": marquer("ok"); break;
      case "effacer":
        if (!confirmationEffacer) {
          confirmationEffacer = true;
          bouton.textContent = "Confirmer : effacer toutes mes marques";
        } else {
          marques = {}; ecrireMarques(); afficherThemes();
        }
        break;
    }
  });

  racine.addEventListener("focusout", e => {
    if (e.target.dataset && e.target.dataset.action === "effacer" && confirmationEffacer) {
      confirmationEffacer = false;
      e.target.textContent = "Effacer mes marques";
    }
  });

  racine.addEventListener("change", e => {
    const option = e.target.dataset.option;
    if (option === "melange") {
      melange = e.target.checked;
      const actuelle = paquet[position];
      construirePaquet();
      position = !melange && actuelle && paquet.includes(actuelle) ? paquet.indexOf(actuelle) : 0;
      afficherCarte(false);
    }
    if (option === "definition") {
      definitionDabord = e.target.checked;
      afficherCarte(false);
    }
  });

  document.addEventListener("keydown", e => {
    if (!racine.classList.contains("vue-paquet")) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.tagName === "INPUT") return;
    const surBouton = e.target.closest && e.target.closest("button, a");
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); aller(1); break;
      case "ArrowLeft": e.preventDefault(); aller(-1); break;
      case "Escape": location.hash = ""; break;
      case "r": case "R": marquer("rev"); break;
      case "c": case "C": marquer("ok"); break;
      case " ": case "Enter":
        if (!surBouton) { e.preventDefault(); retourner(); }
        break;
    }
  });

  let departX = null, departY = null;
  racine.addEventListener("touchstart", e => {
    if (!e.target.closest(".paquet-scene")) return;
    departX = e.touches[0].clientX; departY = e.touches[0].clientY;
  }, { passive: true });
  racine.addEventListener("touchend", e => {
    if (departX === null) return;
    const dx = e.changedTouches[0].clientX - departX, dy = e.changedTouches[0].clientY - departY;
    departX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) aller(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- Navigation par l'adresse ---------- */

  function router() {
    lireMarques();
    const theme = themeParSlug[decodeURIComponent(location.hash.replace(/^#/, ""))];
    if (theme) ouvrirPaquet(theme); else afficherThemes();
  }

  window.addEventListener("hashchange", router);
  router();

  // Sur mobile, le menu défile : on amène la page courante dans le champ.
  const lienCourant = document.querySelector('.menu a[aria-current="page"]');
  if (lienCourant) lienCourant.scrollIntoView({ block: "nearest", inline: "center" });
})();
