#!/bin/bash

# Script para implementar SSO em todos os projetos
# Autor: Carbon Hub & Developer
# Data: 17/03/2026

HUB_URL="https://carbonhub-beta.vercel.app"
DEV_OPS_DIR="/Users/leonardomoura/dev_ops"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Implementando SSO em todos os projetos..."
echo ""

# Lista de projetos
PROJECTS=(
  "ConsigTrack"
  "csv-converter-pro"
  "ManagerUsuarios"
  "DashFrigo"
  "crm-precatorios"
  "CRMDesligados"
  "BaseHigienizados"
  "RiscoSacado"
)

# Função para detectar se é React ou Next.js
detect_framework() {
  local project_dir=$1
  
  if [ -f "$project_dir/next.config.js" ] || [ -f "$project_dir/next.config.ts" ]; then
    echo "nextjs"
  elif [ -f "$project_dir/vite.config.ts" ] || [ -f "$project_dir/vite.config.js" ]; then
    echo "vite"
  else
    echo "unknown"
  fi
}

# Função para encontrar arquivo auth
find_auth_file() {
  local project_dir=$1
  
  # Procura por lib/auth.ts ou src/lib/auth.ts
  if [ -f "$project_dir/lib/auth.ts" ]; then
    echo "$project_dir/lib/auth.ts"
  elif [ -f "$project_dir/src/lib/auth.ts" ]; then
    echo "$project_dir/src/lib/auth.ts"
  elif [ -f "$project_dir/lib/auth.js" ]; then
    echo "$project_dir/lib/auth.js"
  elif [ -f "$project_dir/src/lib/auth.js" ]; then
    echo "$project_dir/src/lib/auth.js"
  else
    echo ""
  fi
}

# Processar cada projeto
for PROJECT in "${PROJECTS[@]}"; do
  PROJECT_PATH="$DEV_OPS_DIR/$PROJECT"
  
  echo -e "${YELLOW}📦 Processando: $PROJECT${NC}"
  
  if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}   ❌ Diretório não encontrado${NC}"
    echo ""
    continue
  fi
  
  # Detectar framework
  FRAMEWORK=$(detect_framework "$PROJECT_PATH")
  echo -e "   🔍 Framework detectado: $FRAMEWORK"
  
  # Encontrar arquivo de autenticação
  AUTH_FILE=$(find_auth_file "$PROJECT_PATH")
  
  if [ -z "$AUTH_FILE" ]; then
    echo -e "${RED}   ❌ Arquivo de autenticação não encontrado${NC}"
    echo -e "   💡 Execute manualmente no projeto${NC}"
    echo ""
    continue
  fi
  
  echo -e "   📝 Arquivo auth encontrado: $(basename $AUTH_FILE)"
  
  # Verificar se já tem SSO
  if grep -q "validateSSOToken" "$AUTH_FILE"; then
    echo -e "${GREEN}   ✅ SSO já implementado${NC}"
    echo ""
    continue
  fi
  
  # Atualizar URL da API se existir
  if grep -q "hub-develop.vercel.app" "$AUTH_FILE"; then
    echo -e "   🔧 Atualizando URL da API..."
    sed -i '' "s|https://hub-develop.vercel.app|$HUB_URL|g" "$AUTH_FILE"
    echo -e "${GREEN}   ✅ URL atualizada para $HUB_URL${NC}"
  fi
  
  echo -e "${YELLOW}   ⚠️  Implementação manual necessária${NC}"
  echo -e "   📖 Siga a documentação em: /docs/SSO_INTEGRATION.md"
  echo ""
done

echo ""
echo -e "${GREEN}✨ Processo concluído!${NC}"
echo ""
echo "📋 Próximos passos para cada projeto:"
echo "1. Abrir o projeto"
echo "2. Seguir a documentação: /Users/leonardomoura/dev_ops/hubDevelop/docs/SSO_INTEGRATION.md"
echo "3. Implementar validateSSOToken no lib/auth.ts"
echo "4. Atualizar AuthContext para detectar sso_token"
echo "5. Fazer deploy no Vercel"
echo ""
echo "🔗 URL do Hub: $HUB_URL"
