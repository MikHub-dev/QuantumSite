#!/usr/bin/env bash
# Intègre le contenu de _inbox/ au dépôt, puis crée un commit et le pousse.
# Usage : bash scripts/synch_agent.sh [run|plan|annuler]
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "ERREUR — lance ce script depuis un dépôt Git." >&2
  exit 1
}
cd "$ROOT"

INBOX="$ROOT/_inbox"
STAGE="$ROOT/.inbox-stage"
MODE="${1:-run}"
TS="$(date +%Y%m%d-%H%M%S)"
trap 'rm -rf "$STAGE"' EXIT

fin() {
  echo
  echo "RÉSULTAT: $1"
  exit "${2:-0}"
}

case "$MODE" in
  run|plan|annuler) ;;
  *) fin "ERREUR — mode inconnu : $MODE (utilise run, plan ou annuler)." 2 ;;
esac

if [ "$MODE" = annuler ]; then
  last="$(git log -1 --pretty=%s)" || fin "ERREUR — impossible de lire l'historique Git." 1
  [[ "$last" == synch_agent:* ]] || fin "ERREUR — le dernier commit n'est pas une synchro ($last)." 1
  git pull --rebase --autostash -q || fin "ERREUR — git pull a échoué." 1
  git revert --no-edit HEAD && git push -q || fin "ERREUR — annulation impossible ou push refusé." 1
  fin "OK — synchro annulée ($last)."
fi

command -v unzip >/dev/null 2>&1 || fin "ERREUR — unzip est requis pour traiter les archives ZIP." 1
mkdir -p "$INBOX"

extract_zip() {
  local archive="$1" destination="$2" tmp source
  tmp="$(mktemp -d)" || return 1
  if ! unzip -q "$archive" -d "$tmp"; then
    echo "ERREUR — archive ZIP illisible : $(basename "$archive")" >&2
    rm -rf "$tmp"
    return 1
  fi
  rm -rf "$tmp/__MACOSX"
  find "$tmp" -name .DS_Store -delete

  shopt -s nullglob dotglob
  local entries=("$tmp"/*)
  source="$tmp"
  if [ "${#entries[@]}" -eq 1 ] && [ -d "${entries[0]}" ]; then
    source="${entries[0]}"
  fi
  mkdir -p "$destination"
  cp -a "$source/." "$destination/" || {
    rm -rf "$tmp"
    shopt -u dotglob
    return 1
  }
  rm -rf "$tmp"
  shopt -u dotglob
}

rm -rf "$STAGE"
mkdir -p "$STAGE"
shopt -s nullglob dotglob
SOURCES=()
for item in "$INBOX"/*; do
  case "$(basename "$item")" in
    .gitkeep|.traites|.sauvegardes) continue ;;
  esac
  SOURCES+=("$(basename "$item")")
  if [[ -f "$item" && "$item" == *.zip ]]; then
    extract_zip "$item" "$STAGE" || {
      rm -rf "$STAGE"
      fin "ERREUR — extraction interrompue; les fichiers de _inbox/ ont été conservés." 1
    }
  elif [ -d "$item" ]; then
    cp -a "$item/." "$STAGE/" || fin "ERREUR — impossible de préparer $(basename "$item")." 1
  else
    cp -a "$item" "$STAGE/" || fin "ERREUR — impossible de préparer $(basename "$item")." 1
  fi
done
shopt -u dotglob

if [ "${#SOURCES[@]}" -eq 0 ]; then
  rm -rf "$STAGE"
  fin "RIEN — _inbox/ est vide. Dépose des fichiers ou une archive ZIP, puis relance."
fi

# Ne jamais importer ou remplacer les données et métadonnées internes du dépôt.
rm -rf "$STAGE/.git" "$STAGE/_inbox" "$STAGE/.inbox-stage"

NEW=()
MOD=()
SAME=()
while IFS= read -r -d '' file; do
  rel="${file#"$STAGE"/}"
  if [ ! -e "$ROOT/$rel" ]; then
    NEW+=("$rel")
  elif cmp -s "$file" "$ROOT/$rel"; then
    SAME+=("$rel")
  else
    MOD+=("$rel")
  fi
done < <(find "$STAGE" -type f -print0 | sort -z)

echo "Sources : ${SOURCES[*]}"
echo "Nouveaux (${#NEW[@]})"
for file in "${NEW[@]}"; do echo "  + $file"; done
echo "Modifiés (${#MOD[@]})"
for file in "${MOD[@]}"; do echo "  ~ $file"; done
echo "Identiques (${#SAME[@]})"

if [ "$MODE" = plan ]; then
  rm -rf "$STAGE"
  fin "PLAN — aucune modification appliquée."
fi

if [ "${#NEW[@]}" -eq 0 ] && [ "${#MOD[@]}" -eq 0 ]; then
  rm -rf "$STAGE"
  fin "OK — aucun changement : tout était déjà à jour."
fi

git pull --rebase --autostash -q || {
  rm -rf "$STAGE"
  fin "ERREUR — git pull --rebase a échoué. Vérifie git status avant de réessayer." 1
}

for file in "${NEW[@]}" "${MOD[@]}"; do
  if [ -e "$ROOT/$file" ]; then
    backup="$INBOX/.sauvegardes/$TS/$(dirname "$file")"
    mkdir -p "$backup"
    cp -a "$ROOT/$file" "$backup/" || fin "ERREUR — sauvegarde impossible pour $file." 1
  fi
  mkdir -p "$ROOT/$(dirname "$file")"
  cp -a "$STAGE/$file" "$ROOT/$file" || fin "ERREUR — impossible d'appliquer $file." 1
done

if [ "${#NEW[@]}" -gt 0 ]; then git add -- "${NEW[@]}" || fin "ERREUR — git add a échoué." 1; fi
if [ "${#MOD[@]}" -gt 0 ]; then git add -- "${MOD[@]}" || fin "ERREUR — git add a échoué." 1; fi
git commit -m "synch_agent: ${SOURCES[*]} (${#NEW[@]} nouveaux, ${#MOD[@]} modifiés)" \
  || fin "ERREUR — commit impossible. Vérifie git status." 1

if ! git push -q; then
  git pull --rebase --autostash -q && git push -q \
    || fin "ERREUR — push refusé. Le commit local est conservé; vérifie git status." 1
fi

mkdir -p "$INBOX/.traites/$TS"
for source in "${SOURCES[@]}"; do
  [ -e "$INBOX/$source" ] && mv -- "$INBOX/$source" "$INBOX/.traites/$TS/"
done
fin "OK — $(git log -1 --pretty='%h %s') poussé sur $(git branch --show-current)."
