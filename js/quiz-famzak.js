/* quiz-famzak.js — petit moteur de quiz commun aux sites FamZakSites (v1.0).
   Score en direct, barre de progression, explication après chaque réponse, message de fin,
   meilleur score gardé sur l'appareil, « Refaire les questions manquées » et liste « À revoir ».
   Le même fichier est copié dans chaque site (même origine mikhub-dev.github.io : les meilleurs
   scores sont donc visibles d'un site à l'autre).

   Utilisation :
     FamZakQuiz.monter(element, { cle: "iasite:donnees", titre: "Quiz", questions: [
       { q: "Question ?", o: ["choix 0", "choix 1", "choix 2"], a: 1, e: "Explication." } ] });
     Options facultatives : melanger (false pour garder l'ordre), surReponse(q, juste), surFin(score, total).
     FamZakQuiz.meilleur("iasite:donnees")  →  { score, total, date } ou null
   Clé de stockage : "famzak:quiz:" + cle. */
(function () {
  "use strict";
  var PREFIXE = "famzak:quiz:";
  var LET = ["A", "B", "C", "D", "E", "F"];

  function css() {
    if (document.getElementById("fzq-style")) return;
    var s = document.createElement("style");
    s.id = "fzq-style";
    s.textContent =
      ".fzq{border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:12px;padding:14px 16px;margin:14px 0;background:color-mix(in srgb,currentColor 4%,transparent)}" +
      ".fzq h3.fzq-titre{margin:0 0 8px;font-size:1.05em}" +
      ".fzq-tete{display:flex;justify-content:space-between;gap:8px;font-size:.85em;opacity:.8;margin-bottom:6px}" +
      ".fzq-barre{height:6px;border-radius:99px;background:color-mix(in srgb,currentColor 12%,transparent);overflow:hidden;margin-bottom:10px}" +
      ".fzq-barre i{display:block;height:100%;width:0;background:#5fc98a;transition:width .3s}" +
      ".fzq-q{font-weight:600;margin:6px 0 10px;outline:none}" +
      ".fzq-opts{display:grid;gap:6px}" +
      ".fzq-opt{display:flex;gap:10px;align-items:flex-start;text-align:left;font:inherit;color:inherit;cursor:pointer;padding:8px 10px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);background:transparent}" +
      ".fzq-opt:hover:not(:disabled){border-color:#7aa2ff}" +
      ".fzq-opt:disabled{cursor:default}" +
      ".fzq-opt .fzq-k{font-weight:700;opacity:.6;min-width:1.2em}" +
      ".fzq-opt.fzq-bon{border-color:#5fc98a;background:#5fc98a22}" +
      ".fzq-opt.fzq-faux{border-color:#ff6b6b;background:#ff6b6b22}" +
      ".fzq-retour{margin:10px 0 4px;padding:8px 10px;border-radius:8px;font-size:.95em}" +
      ".fzq-retour.fzq-bon{background:#5fc98a1f;border-left:3px solid #5fc98a}" +
      ".fzq-retour.fzq-faux{background:#ff6b6b1f;border-left:3px solid #ff6b6b}" +
      ".fzq-retour b{margin-right:6px}" +
      ".fzq-btn{font:inherit;cursor:pointer;margin:8px 8px 0 0;padding:7px 14px;border-radius:8px;border:1px solid #7aa2ff;background:#7aa2ff;color:#0f1116;font-weight:600}" +
      ".fzq-btn.fzq-alt{background:transparent;color:inherit}" +
      ".fzq-fin{text-align:center;padding:6px 0}" +
      ".fzq-gros{font-size:2em;font-weight:800}" +
      ".fzq-etoiles{font-size:1.4em;letter-spacing:4px}" +
      ".fzq-revoir{text-align:left;margin-top:12px}" +
      ".fzq-revoir div{padding:6px 0;border-top:1px solid color-mix(in srgb,currentColor 15%,transparent)}" +
      ".fzq-revoir small{display:block;opacity:.8}";
    document.head.appendChild(s);
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function meilleur(cle) { try { return JSON.parse(localStorage.getItem(PREFIXE + cle)) || null; } catch (e) { return null; } }
  function noter(cle, score, total) {
    var m = meilleur(cle);
    if (m && m.total === total && m.score >= score) return m;
    var v = { score: score, total: total, date: new Date().toISOString().slice(0, 10) };
    try { localStorage.setItem(PREFIXE + cle, JSON.stringify(v)); } catch (e) {}
    return v;
  }
  function message(s, n) {
    if (s === n) return "Parfait, sans faute !";
    if (s >= n * 0.8) return "Très bien, les notions sont solides.";
    if (s >= n * 0.5) return "Bon début : relis les passages des questions manquées.";
    return "À retravailler : relis la page puis refais le quiz.";
  }
  function etoiles(s, n) { var k = s === n ? 3 : s >= n * 0.8 ? 2 : s >= n * 0.5 ? 1 : 0; return "★★★".slice(0, k) + "☆☆☆".slice(0, 3 - k); }

  function monter(racine, opts) {
    if (!racine || !opts || !opts.questions || !opts.questions.length) return;
    css();
    var Q = opts.questions, st = null;
    racine.classList.add("fzq");
    function demarrer(liste) { st = { liste: liste, i: 0, score: 0, rates: [] }; rendre(); }
    function entete() {
      var h = el("div", "fzq-tete");
      h.appendChild(el("span", null, "Question " + (st.i + 1) + " / " + st.liste.length));
      h.appendChild(el("span", "fzq-score", "Score : " + st.score));
      return h;
    }
    function rendre() {
      racine.innerHTML = "";
      if (opts.titre) racine.appendChild(el("h3", "fzq-titre", opts.titre));
      if (st.i >= st.liste.length) return fin();
      var q = st.liste[st.i];
      var tete = entete();
      var barre = el("div", "fzq-barre"); barre.setAttribute("role", "progressbar");
      barre.setAttribute("aria-valuemin", "0"); barre.setAttribute("aria-valuemax", String(st.liste.length)); barre.setAttribute("aria-valuenow", String(st.i));
      var rempli = el("i"); rempli.style.width = (st.i / st.liste.length * 100) + "%"; barre.appendChild(rempli);
      var qt = el("p", "fzq-q", q.q); qt.tabIndex = -1;
      var zone = el("div", "fzq-opts"); zone.setAttribute("role", "group");
      var retour = el("div"); retour.setAttribute("aria-live", "polite");
      melanger(q.o.map(function (t, k) { return { t: t, k: k }; })).forEach(function (it, idx) {
        var b = el("button", "fzq-opt"); b.type = "button"; b.dataset.k = it.k;
        b.appendChild(el("span", "fzq-k", LET[idx])); b.appendChild(el("span", null, it.t));
        b.addEventListener("click", function () { choisir(b, it.k === q.a); });
        zone.appendChild(b);
      });
      function choisir(btn, ok) {
        zone.querySelectorAll("button").forEach(function (b) { b.disabled = true; if (+b.dataset.k === q.a) b.classList.add("fzq-bon"); });
        if (ok) st.score++; else { btn.classList.add("fzq-faux"); st.rates.push(q); }
        if (typeof opts.surReponse === "function") opts.surReponse(q, ok);
        retour.className = "fzq-retour " + (ok ? "fzq-bon" : "fzq-faux");
        retour.innerHTML = "<b>" + (ok ? "Bonne réponse !" : "Pas tout à fait.") + "</b>" + (q.e || "");
        tete.querySelector(".fzq-score").textContent = "Score : " + st.score;
        rempli.style.width = ((st.i + 1) / st.liste.length * 100) + "%";
        var suite = el("button", "fzq-btn", st.i + 1 < st.liste.length ? "Question suivante →" : "Voir mon résultat"); suite.type = "button";
        suite.addEventListener("click", function () { st.i++; rendre(); });
        racine.appendChild(suite); suite.focus({ preventScroll: true });
      }
      racine.appendChild(tete); racine.appendChild(barre); racine.appendChild(qt); racine.appendChild(zone); racine.appendChild(retour);
    }
    function fin() {
      var n = st.liste.length, s = st.score, complet = n === Q.length;
      var avant = meilleur(opts.cle);
      var m = complet ? noter(opts.cle, s, n) : avant;
      var box = el("div", "fzq-fin");
      box.appendChild(el("div", "fzq-etoiles", etoiles(s, n)));
      box.appendChild(el("div", "fzq-gros", s + " / " + n));
      box.appendChild(el("p", null, "<strong>" + message(s, n) + "</strong>"));
      if (complet && avant && avant.total === n && s > avant.score) box.appendChild(el("p", null, "Nouveau record ! (avant : " + avant.score + " / " + n + ")"));
      else if (m && m.total === Q.length) box.appendChild(el("p", null, "Meilleur score sur cet appareil : " + m.score + " / " + m.total));
      var btns = el("div");
      var encore = el("button", "fzq-btn", "Recommencer le quiz"); encore.type = "button";
      encore.addEventListener("click", function () { demarrer(melanger(Q)); });
      btns.appendChild(encore);
      if (st.rates.length) {
        var r = st.rates.slice();
        var refaire = el("button", "fzq-btn fzq-alt", "Refaire les questions manquées (" + r.length + ")"); refaire.type = "button";
        refaire.addEventListener("click", function () { demarrer(melanger(r)); });
        btns.appendChild(refaire);
      }
      box.appendChild(btns);
      if (st.rates.length) {
        var rev = el("div", "fzq-revoir"); rev.appendChild(el("h4", null, "À revoir"));
        st.rates.forEach(function (q) { rev.appendChild(el("div", null, "<strong>" + q.q + "</strong><small>Réponse : " + q.o[q.a] + (q.e ? " — " + q.e : "") + "</small>")); });
        box.appendChild(rev);
      }
      racine.appendChild(box);
      if (typeof opts.surFin === "function") opts.surFin(s, n);
    }
    demarrer(opts.melanger === false ? Q.slice() : melanger(Q));
  }
  window.FamZakQuiz = { monter: monter, meilleur: meilleur };
})();
