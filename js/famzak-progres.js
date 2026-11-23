/* famzak-progres.js — progression des jeux liée au code ZF, commune aux sites FamZakSites (v1.0).
   RoutineSite n'en a pas besoin : ses jours faits sont déjà sur le serveur (commun.js).
   Le même fichier est copié dans chaque site. On le charge avec l'attribut data-site :
     <script src="famzak-progres.js" data-site="iasite"></script>

   Principe
   - Les jeux gardent leurs progrès dans localStorage (quiz, fiches vues, badges, défis…). Ce fichier
     repère les clés du site (PREFIXES ci-dessous) et les envoie au serveur de suivi (Worker
     « routinesite-suivi », routes /progres/…), rangées sous le code de l'élève.
   - Le code est saisi une fois (petit bouton « 👤 » en bas à droite). Il est gardé pour l'onglet
     (sessionStorage « famzak:eleve »), donc partagé par les six sites, qui ont la même adresse de base.
     Il est aussi repris de RoutineSite (session ouverte dans l'onglet) et de MathSite (code mémorisé de l'espace Évaluations).
   - À la connexion, les progrès de l'élève remplacent ceux de l'appareil (un autre élève ne voit pas les
     siens). Les progrès faits sans code sur l'appareil ne sont envoyés que si l'élève n'a encore rien
     sur ce site et qu'ils n'appartiennent pas à un autre élève (clé « famzak:proprietaire:<site> »).
     « Changer d'élève », ou une visite sans code après celle d'un élève, efface les progrès du site
     sur l'appareil : ils restent sur le serveur.
   - Sans code ou sans réseau, tout marche comme avant, sur l'appareil seulement. */
(function () {
  "use strict";
  var URL_SUIVI = "https://routinesite-suivi.mikhub-dev.workers.dev";
  var PREFIXES = {
    mathsite: ["famzak:mathsite:"],
    quantumsite: ["famzak:quiz:quantum:", "qflash-"],
    culturegsite: ["famzak:quiz:culturegsite:", "cgs-quiz-"],
    iasite: ["famzak:iasite:", "famzak:quiz:iasite:"],
    morphosite: ["famzak:morpho:"]
  };
  var SESSION = "famzak:eleve";
  var PROPRIO;   // « famzak:proprietaire:<site> » : code de l'élève dont les progrès sont sur l'appareil
  var script = document.currentScript;
  var site = script && script.dataset.site;
  if (!site || !PREFIXES[site]) return;
  var prefixes = PREFIXES[site];
  PROPRIO = "famzak:proprietaire:" + site;
  var ls = (function () { try { return window.localStorage; } catch (e) { return null; } })();
  var ss = (function () { try { return window.sessionStorage; } catch (e) { return null; } })();
  if (!ls) return;
  var normaliser = function (s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); };
  var duSite = function (k) { return prefixes.some(function (p) { return k.indexOf(p) === 0; }); };

  /* ---------- Session ---------- */
  function lireSession() {
    try { var s = JSON.parse(ss && ss.getItem(SESSION)); if (s && s.code && s.classe) return s; } catch (e) {}
    try { var r = JSON.parse(ss && ss.getItem("routinesite:code")); if (r && r.code && r.classe) return { classe: r.classe, code: normaliser(r.code) }; } catch (e) {}
    var trouves = ["5e", "seconde"].map(function (c) { var v = null; try { v = ls.getItem("mathsite-code-eleve:" + c); } catch (e) {} return v ? { classe: c, code: normaliser(v) } : null; }).filter(Boolean);
    return trouves.length === 1 ? trouves[0] : null;
  }
  function ecrireSession(s) { try { s ? ss.setItem(SESSION, JSON.stringify(s)) : ss.removeItem(SESSION); } catch (e) {} }

  /* ---------- Serveur ---------- */
  function appeler(chemin, corps) {
    return fetch(URL_SUIVI + chemin, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.erreur || "Erreur " + r.status); e.statut = r.status; throw e; } return d; }); });
  }

  /* ---------- Envoi des changements (localStorage surveillé) ---------- */
  var enAttente = {}, minuterie = null, silence = false, etat = "local";
  var setOrig = Storage.prototype.setItem, removeOrig = Storage.prototype.removeItem;
  function noter(k, v) {
    if (silence || !duSite(k) || !lireSession()) return;
    var val = v;
    if (v !== null) { try { val = JSON.parse(v); } catch (e) { val = v; } }
    enAttente[k] = val;
    clearTimeout(minuterie);
    minuterie = setTimeout(envoyer, 800);
  }
  Storage.prototype.setItem = function (k, v) { setOrig.call(this, k, v); if (this === ls) noter(String(k), String(v)); };
  Storage.prototype.removeItem = function (k) { removeOrig.call(this, k); if (this === ls) noter(String(k), null); };
  function envoyer() {
    var s = lireSession(), lot = enAttente;
    enAttente = {};
    if (!s || !Object.keys(lot).length) return Promise.resolve();
    majBouton("envoi");
    return appeler("/progres/ecrire", { classe: s.classe, code: s.code, site: site, valeurs: lot })
      .then(function () { majBouton("ok"); })
      .catch(function () { Object.keys(lot).forEach(function (k) { if (!(k in enAttente)) enAttente[k] = lot[k]; }); majBouton("hors-ligne"); });
  }
  window.addEventListener("pagehide", function () {
    var s = lireSession();
    if (!s || !Object.keys(enAttente).length || !navigator.sendBeacon) return;
    try { navigator.sendBeacon(URL_SUIVI + "/progres/ecrire", new Blob([JSON.stringify({ classe: s.classe, code: s.code, site: site, valeurs: enAttente })], { type: "text/plain" })); } catch (e) {}
  });

  /* ---------- Clés locales du site ---------- */
  function clesLocales() { var l = []; for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && duSite(k)) l.push(k); } return l; }
  function texte(v) { return typeof v === "string" ? v : JSON.stringify(v); }

  // Charge les progrès de l'élève. Renvoie true si l'appareil a changé (la page doit se recharger).
  function charger(s, premiereConnexion) {
    return appeler("/progres/lire", { classe: s.classe, code: s.code }).then(function (d) {
      var distant = (d.progres || {})[site] || {}, change = false;
      silence = true;
      try {
        var proprio = ls.getItem(PROPRIO);
        if (!Object.keys(distant).length && premiereConnexion && (!proprio || proprio === s.code)) {
          // première fois sur ce site : on garde et on envoie ce qui a déjà été fait sur l'appareil
          clesLocales().forEach(function (k) { noter2(k); });
        } else {
          clesLocales().forEach(function (k) { if (!(k in distant)) { removeOrig.call(ls, k); change = true; } });
          Object.keys(distant).forEach(function (k) { if (!duSite(k)) return; var t = texte(distant[k]); if (ls.getItem(k) !== t) { setOrig.call(ls, k, t); change = true; } });
        }
        setOrig.call(ls, PROPRIO, s.code);
      } finally { silence = false; }
      majBouton("ok");
      if (Object.keys(enAttente).length) envoyer();
      return change;
    });
  }
  function noter2(k) { var v = ls.getItem(k); try { enAttente[k] = JSON.parse(v); } catch (e) { enAttente[k] = v; } }
  /* ---------- Bouton « 👤 » et fenêtre du code ---------- */
  var bouton = null, fenetre = null;
  function css() {
    var st = document.createElement("style");
    st.textContent =
      ".fzp-bouton{position:fixed;right:14px;bottom:14px;z-index:9990;font:600 13px/1.2 system-ui,sans-serif;padding:8px 12px;border-radius:999px;border:1px solid rgba(127,127,127,.45);background:rgba(20,24,36,.92);color:#eef1fb;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.3)}" +
      ".fzp-bouton:hover{border-color:#7aa2ff}" +
      ".fzp-fen{position:fixed;inset:0;z-index:9995;display:grid;place-items:center;background:rgba(3,8,18,.6)}" +
      ".fzp-boite{width:min(380px,calc(100% - 32px));background:#121726;color:#eef1fb;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:18px 20px;font:15px/1.5 system-ui,sans-serif}" +
      ".fzp-boite h2{margin:0 0 6px;font-size:18px}.fzp-boite p{margin:0 0 10px;opacity:.85;font-size:14px}" +
      ".fzp-boite input{width:100%;box-sizing:border-box;font:inherit;text-transform:uppercase;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:#0b0f1a;color:inherit}" +
      ".fzp-boite button{font:inherit;cursor:pointer;margin:10px 8px 0 0;padding:7px 14px;border-radius:8px;border:1px solid #7aa2ff;background:#7aa2ff;color:#0b0f1a;font-weight:600}" +
      ".fzp-boite button.alt{background:transparent;color:inherit}" +
      ".fzp-err{color:#ff8a8a;min-height:1.2em;font-size:13px;margin-top:6px}";
    document.head.appendChild(st);
  }
  function majBouton(e) {
    if (e) etat = e;
    if (!bouton) return;
    var s = lireSession();
    bouton.textContent = !s ? "👤 Mon code ZF" : "👤 " + s.code + (etat === "envoi" ? " · envoi…" : etat === "hors-ligne" ? " · hors ligne" : " · ✓");
    bouton.title = !s ? "Entrer mon code ZF pour garder mes progrès sur tous les appareils"
      : etat === "hors-ligne" ? "Le serveur ne répond pas : les progrès sont gardés sur l'appareil et seront envoyés plus tard."
      : "Progrès enregistrés sous ce code, sur tous les appareils et les six sites.";
  }
  function ouvrir() {
    var s = lireSession();
    fenetre = document.createElement("div");
    fenetre.className = "fzp-fen";
    fenetre.innerHTML = s
      ? '<div class="fzp-boite" role="dialog" aria-modal="true" aria-labelledby="fzp-t"><h2 id="fzp-t">Code ' + s.code + '</h2><p>Tes quiz, badges et défis sont enregistrés sous ce code : tu les retrouves sur les six sites et sur n\'importe quel appareil.</p><button type="button" data-a="sortir" class="alt">Changer d\'élève</button><button type="button" data-a="fermer">Fermer</button></div>'
      : '<div class="fzp-boite" role="dialog" aria-modal="true" aria-labelledby="fzp-t"><h2 id="fzp-t">Mon code ZF</h2><p>Le code ZF remis par ton enseignant (le même que sur MathSite et RoutineSite). Tes quiz, badges et défis seront gardés sous ce code, sur tous les appareils.</p><input type="text" autocomplete="off" spellcheck="false" placeholder="TON CODE" aria-label="Code ZF"><div class="fzp-err" role="alert"></div><button type="button" data-a="entrer">Entrer</button><button type="button" data-a="fermer" class="alt">Annuler</button></div>';
    document.body.appendChild(fenetre);
    var champ = fenetre.querySelector("input");
    if (champ) { champ.focus(); champ.addEventListener("keydown", function (e) { if (e.key === "Enter") entrer(); }); }
    fenetre.addEventListener("click", function (e) {
      if (e.target === fenetre) return fermer();
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "fermer") fermer();
      if (b.dataset.a === "entrer") entrer();
      if (b.dataset.a === "sortir") sortir();
    });
  }
  function fermer() { if (fenetre) fenetre.remove(); fenetre = null; }
  function entrer() {
    var champ = fenetre.querySelector("input"), err = fenetre.querySelector(".fzp-err"), code = normaliser(champ.value);
    if (code.length < 6) { err.textContent = "Le code a au moins 6 caractères."; return; }
    err.textContent = "Vérification…";
    var essais = ["5e", "seconde"], i = 0;
    (function essai() {
      var s = { classe: essais[i], code: code };
      appeler("/progres/lire", s).then(function () {
        ecrireSession(s);
        return charger(s, true).then(function () { location.reload(); });
      }).catch(function (e) {
        if (e.statut === 403 && ++i < essais.length) return essai();
        err.textContent = e.statut === 403 ? "Ce code n'est pas reconnu. Vérifie-le auprès de ton enseignant." : "Le serveur ne répond pas. Réessaie dans un moment.";
      });
    })();
  }
  function sortir() {
    envoyer().then(function () {
      silence = true;
      clesLocales().forEach(function (k) { removeOrig.call(ls, k); });
      removeOrig.call(ls, PROPRIO);
      silence = false;
      ecrireSession(null);
      try { ss.removeItem("routinesite:code"); } catch (e) {}
      location.reload();
    });
  }

  function demarrer() {
    {
      css();
      bouton = document.createElement("button");
      bouton.type = "button"; bouton.className = "fzp-bouton";
      bouton.addEventListener("click", ouvrir);
      document.body.appendChild(bouton);
      majBouton();
    }
    var s = lireSession();
    if (!s) {
      // visite sans code après celle d'un élève : ses progrès (déjà sur le serveur) quittent l'appareil
      if (ls.getItem(PROPRIO)) {
        silence = true;
        clesLocales().forEach(function (k) { removeOrig.call(ls, k); });
        removeOrig.call(ls, PROPRIO);
        silence = false;
        location.reload();
      }
      return;
    }
    ecrireSession(s);
    var deja = false; try { deja = ss.getItem("famzak:charge:" + site) === s.code; } catch (e) {}
    charger(s, !deja).then(function (change) {
      try { ss.setItem("famzak:charge:" + site, s.code); } catch (e) {}
      if (change && !deja) location.reload();   // une seule fois par onglet et par site
    }).catch(function (e) { if (e.statut === 403) { ecrireSession(null); majBouton(); } else majBouton("hors-ligne"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
  window.FamZakProgres = { session: lireSession, envoyer: envoyer };
})();
