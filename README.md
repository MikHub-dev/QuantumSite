# QuantumSite

Site aide-mémoire sur les notions de la quantique.

**Voir le site :** https://mikhub-dev.github.io/QuantumSite/

## Contenu

- **Fiches Quantiques** (`fiches-quantiques.html`) : 50 flashcards illustrées, réparties en six thèmes (Fondations, Formalisme, Mesure, Particules, Intrication, Technologies).
- **Fiches Mathématiques** (`fiches-mathematiques.html`) : 100 flashcards « Outils mathématiques de la quantique », chacune avec sa formule, sa définition et une illustration SVG calculée, réparties en seize thèmes.

## Utilisation

- La page d'une série affiche une vignette par thème, plus « Toutes » et « À revoir ». Choisir une vignette ouvre le paquet de ce thème sur toute la page, à partir de la première carte.
- Touchez une carte (ou appuyez sur Espace) pour la retourner.
- Marquez chaque notion « Je la connais » ou « À revoir » ; vos marques restent enregistrées dans votre navigateur.
- Mélangez le paquet, ou activez « Définition d'abord » pour vous entraîner dans l'autre sens.
- Clavier : flèches pour naviguer, R pour « à revoir », C pour « je la connais », Échap pour revenir aux thèmes. Sur mobile, balayez la carte.

## Structure

- `index.html` : page d'accueil.
- `fiches-quantiques.html`, `fiches-mathematiques.html` : pages des deux séries.
- `donnees/` : le contenu des fiches (textes, formules, illustrations) et le symbole de chaque thème.
- `js/fiches.js` : le moteur commun (vignettes, paquet, marques).
- `philosophie.html` : trois postulats (mathématiques et ordre de l'univers, symétries et forces, géométrie et réalité).
- `css/style.css` : styles communs (en-tête, accueil) ; `css/fiches.css` : styles des pages de fiches ; `css/philosophie.css` : styles de la page Philosophie.
- `outils-mathematiques.html` : ancienne adresse, redirige vers `fiches-mathematiques.html`.

## Synchronisation depuis `_inbox/`

Déposez dans `_inbox/` les fichiers à intégrer, ou une archive ZIP, puis lancez :

```sh
bash scripts/synch_agent.sh plan
bash scripts/synch_agent.sh run
```

`plan` affiche les ajouts et modifications sans les appliquer. `run` applique les changements, sauvegarde les versions remplacées dans `_inbox/.sauvegardes/`, crée un commit et le pousse sur la branche courante. Les sources traitées sont conservées dans `_inbox/.traites/`. Pour annuler le dernier commit de synchronisation, lancez `bash scripts/synch_agent.sh annuler`.
