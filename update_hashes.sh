#!/bin/bash

# Obtém o hash do último commit
LAST_COMMIT=$(git rev-parse HEAD)

# Função para obter o último commit que modificou um arquivo
get_last_commit() {
  git log -n 1 --pretty=format:%h -- "$1"
}

# Função para processar os arquivos PHP/HTML e atualizar os hashes
process_file() {
  local file="$1"

  # Utiliza o sed para encontrar e substituir as linhas conforme as regras especificadas
  sed -i.bak -E "
    /<script[^>]*src=[\"'][^\"']*\.(js)[^>]*><\/script>/!b script
    /data-update-hashes=[\"']false[\"']/b end
    s|(<script[^>]*src=[\"'][^\"']*)(\.js)([^\"'>]*)([\"'][^>]*><\/script>)|\1\2?v=$(get_last_commit $(resolve_path \1\2))\4|g
    :script
    /<link[^>]*href=[\"'][^\"']*\.(css)[^>]*>/!b end
    /data-update-hashes=[\"']false[\"']/b end
    s|(<link[^>]*href=[\"'][^\"']*)(\.css)([^\"'>]*)([\"'][^>]*>)|\1\2?v=$(get_last_commit $(resolve_path \1\2))\4|g
    :end
  " "$file"

  # Remove o backup gerado pelo sed (sufixo .bak)
  rm "${file}.bak"
}

# Função para resolver o caminho do arquivo com base no src/href encontrado
resolve_path() {
  local path="$1"
  path=$(echo "$path" | sed 's|<?php echo BASE_URL; ?>|/taramps|g')
  path=$(echo "$path" | sed 's|<?= BASE_URL ?>|/taramps|g')
  echo "$path"
}

# Percorre todos os arquivos PHP e HTML
find . -type f \( -name "*.php" -o -name "*.html" \) | while read -r file; do
  process_file "$file"
done
