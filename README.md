# QuantumSite

Site aide-mémoire sur les notions de la quantique.

**Voir le site :** https://mikhub-dev.github.io/QuantumSite/

## Contenu

- **Le solide** (`solide.html`) : pourquoi un solide est un état de plusieurs champs quantiques, ce qu'il faut corriger dans l'énoncé « un solide est un ensemble de milliards d'excitations coordonnées de plusieurs champs quantiques », et d'où viennent les quasiparticules (phonons, magnons, plasmons).
- **Fiches Quantiques** (`fiches-quantiques.html`) : 50 flashcards illustrées, réparties en six thèmes (Fondations, Formalisme, Mesure, Particules, Intrication, Technologies).
- **Axiomisation** (`axiomisation.html`) : 42 flashcards sur les postulats physiques de la mécanique quantique et leur socle mathématique (espace de Hilbert, opérateurs, théorèmes clés, distributions), réparties en huit thèmes, avec un préambule sur les mots « postulat » et « axiome ».
- **Fiches Informatiques** (`fiches-informatiques.html`) : 70 flashcards sur l'informatique quantique, réparties en dix thèmes qui suivent la pile d'un ordinateur quantique, du qubit jusqu'aux usages et à l'infrastructure, avec un préambule.
- **Fiches Mathématiques** (`fiches-mathematiques.html`) : 100 flashcards « Outils mathématiques de la quantique », chacune avec sa formule, sa définition et une illustration SVG calculée, réparties en seize thèmes.
- **Vidéos** (`videos.html`) : une carte titrée par lien YouTube (trois vidéos, dont un short sur l'intrication, et la recherche « quantique » sur la chaîne de l'École polytechnique), qui s'ouvre dans un nouvel onglet.

## Utilisation

- La page d'une série affiche une vignette par thème, plus « Toutes » et « À revoir ». Choisir une vignette ouvre le paquet de ce thème sur toute la page, à partir de la première carte.
- Touchez une carte (ou appuyez sur Espace) pour la retourner.
- Marquez chaque notion « Je la connais » ou « À revoir » ; vos marques restent enregistrées dans votre navigateur.
- Mélangez le paquet, ou activez « Définition d'abord » pour vous entraîner dans l'autre sens.
- Clavier : flèches pour naviguer, R pour « à revoir », C pour « je la connais », Échap pour revenir aux thèmes. Sur mobile, balayez la carte.

## Recherche

La barre à droite du menu horizontal fonctionne comme celle de MathSite : des mots séparés par des espaces sont cherchés en OU, des termes séparés par « + » en ET, sans tenir compte des accents ni des majuscules. Les résultats s'affichent à chaque frappe, en trois familles (Menus, Fiches, Pages), avec un extrait surligné quand le mot est trouvé dans le contenu. Un clic ouvre la page, le thème ou directement la fiche (`fiches-quantiques.html#mesure/24`). Échap ou « Fermer » referme les résultats.

L'index est construit dans le navigateur à partir des pages du menu et des fichiers `donnees/*.js` qu'elles chargent : toute page ou fiche ajoutée est trouvée sans autre modification. Il faut que le site soit servi par un serveur web (GitHub Pages, aperçu du Codespace) ; ouvert en fichier local, seules les entrées du menu sont trouvées.

## Structure

- `index.html` : page d'accueil.
- `axiomisation.html`, `fiches-quantiques.html`, `fiches-mathematiques.html`, `fiches-informatiques.html` : pages des quatre séries.
- `donnees/` : le contenu des fiches (textes, formules, illustrations), le symbole de chaque thème et, si besoin, un préambule (`preambule`) affiché sous le titre.
- `js/fiches.js` : le moteur commun (vignettes, paquet, marques, préambule).
- `philosophie.html` : trois paradigmes philosophiques (mathématiques et ordre de l'univers, symétries et forces, géométrie et réalité), précédés de la définition d'un paradigme philosophique.
- `solide.html`, `css/solide.css` : la page Le solide (même fond et même typographie que Philosophie).
- `videos.html`, `css/videos.css` : la page Vidéos ; pour ajouter une vidéo, copier un bloc `<article class="video">` (un `id`, un titre `h2`, un résumé).
- `js/recherche.js`, `css/recherche.css` : la recherche du site.
- `css/style.css` : styles communs (en-tête, accueil) ; `css/fiches.css` : styles des pages de fiches ; `css/philosophie.css` : styles de la page Philosophie ; `css/videos.css` : styles de la page Vidéos ; `css/solide.css` : styles de la page Le solide.
- `outils-mathematiques.html` : ancienne adresse, redirige vers `fiches-mathematiques.html`.

## Synchronisation depuis `_inbox/`

Déposez dans `_inbox/` les fichiers à intégrer, ou une archive ZIP, puis lancez :

```sh
bash scripts/synch_agent.sh plan
bash scripts/synch_agent.sh run
```

`plan` affiche les ajouts et modifications sans les appliquer. `run` applique les changements, sauvegarde les versions remplacées dans `_inbox/.sauvegardes/`, crée un commit et le pousse sur la branche courante. Les sources traitées sont conservées dans `_inbox/.traites/`. Pour annuler le dernier commit de synchronisation, lancez `bash scripts/synch_agent.sh annuler`.
