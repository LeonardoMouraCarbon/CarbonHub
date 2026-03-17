# Developer Hub - Dashboard Centralizado

Dashboard moderno com **design dark inspirado em financial-infrastruc**, glass morphism e vídeos alternados para centralizar o acesso aos seus **9 projetos Full Stack** hospedados na Vercel.

## 🚀 Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Glass Morphism
- **Fonte:** Inter (Google Fonts)
- **Componentes:** Shadcn/UI
- **Ícones:** Lucide React
- **Animações:** 15+ animações customizadas
- **Deploy:** Vercel

## ✨ Funcionalidades

- 🎨 **Design Dark:** Interface moderna inspirada em financial-infrastruc
- 💎 **Glass Morphism:** Cards com efeito vidro transparente (backdrop-blur)
- 🎬 **Vídeos Alternados:** Card flutuante com 2 vídeos em loop alternado
- 📊 **Stats em Tempo Real:** 3 cards glass com estatísticas animadas
- 🔍 **Busca Inteligente:** Search bar com glass effect
- 🏷️ **Filtros por Categoria:** Botões pill estilo financial
- ✨ **Animações Suaves:** Fade, slide, scale, glow, pulse, bounce
- 📱 **Responsivo:** Design mobile-first
- ⚡ **Performance:** Otimizado para velocidade

## 🎨 Paleta de Cores (Financial Style)

- **Background:** #0f1115 (Dark)
- **Cards:** rgba(255, 255, 255, 0.05) + backdrop-blur
- **Borders:** rgba(255, 255, 255, 0.1)
- **Primary:** #10b981 (Emerald-500)
- **Text:** #ffffff (White) / #9ca3af (Gray-400)

## 🎬 Vídeos

Dois vídeos alternando a cada 10 segundos em card glass flutuante:
- `/public/videos/nodes-3.mp4`
- `/public/videos/nodes-4.mp4`

## 📦 Estrutura do Projeto

```
hubDevelop/
├── app/
│   ├── globals.css          # Estilos globais + animações
│   ├── layout.tsx            # Layout raiz
│   ├── page.tsx              # Dashboard principal
│   └── financial/
│       └── page.tsx          # Landing page financeira
├── components/
│   ├── ui/
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── ProjectCard.tsx       # Card individual do projeto
│   ├── ProjectGrid.tsx       # Grid de projetos
│   ├── StatsHeader.tsx       # Header com estatísticas
│   └── BrandVideo.tsx        # Componente de vídeo
├── data/
│   └── projects.json         # 9 projetos reais da Vercel
├── lib/
│   └── utils.ts
├── tailwind.config.ts        # Config + 15 animações
└── package.json
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd hubDevelop
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📝 Como Adicionar Novos Projetos

Edite o arquivo `data/projects.json` e adicione um novo objeto no array de projetos:

```json
{
  "id": "10",
  "name": "Nome do Projeto",
  "description": "Descrição curta e objetiva do projeto",
  "url": "https://seu-projeto.vercel.app",
  "status": "online",
  "category": "Full Stack",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Campos Disponíveis:

- **id:** Identificador único (string)
- **name:** Nome do projeto
- **description:** Descrição breve e objetiva
- **url:** Link completo do projeto na Vercel
- **status:** "online" ou "maintenance"
- **category:** "Full Stack", "Tool", "BI" ou "IoT"
- **tags:** Array de tags para busca e filtros

## 🎯 Projetos Incluídos

1. **SISCON** - Sistema de Controle e Gestão Empresarial
2. **ConsigTrack** - Plataforma de rastreamento de consignações
3. **CSV Converter Pro** - Ferramenta de conversão de CSV
4. **Carbon ID** - Sistema de créditos de carbono
5. **Posic Frigo** - Monitoramento de câmaras frigoríficas (IoT)
6. **CRM Precatórios** - CRM especializado em precatórios
7. **Neon Data Hub** - Hub de dados com Neon Database
8. **Seguro Connect** - Plataforma de gestão de seguros
9. **Base Higienizada** - Sistema de higienização de dados

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub

2. Acesse [vercel.com](https://vercel.com)

3. Importe o repositório

4. Configure as variáveis de ambiente (se necessário)

5. Clique em Deploy!

## ✨ Sistema de Animações

O projeto inclui 15+ animações customizadas via Tailwind:

- `animate-fade-in/out` - Fade suave
- `animate-slide-up/down/left/right` - Slides direcionais
- `animate-scale-in/out` - Escala de entrada/saída
- `animate-glow` - Efeito de brilho
- `animate-pulse-slow` - Pulso lento
- `animate-bounce-slow` - Bounce suave
- `animate-shimmer` - Efeito shimmer
- `animate-float` - Flutuação suave
- Classes de delay: `animate-delay-{100-1000}`
- Utilitários: `hover-lift`, `transition-smooth`, `gradient-animate`

## 🎯 Próximas Funcionalidades

- [ ] Autenticação e perfis de usuário
- [ ] Sistema de favoritos
- [ ] Ordenação personalizada (drag & drop)
- [ ] Integração com API da Vercel (status real-time)
- [ ] Analytics de acesso aos projetos
- [ ] Modo dark/light toggle
- [ ] Exportar projetos (PDF/CSV)
- [ ] Notificações de deploy

## 📄 Licença

MIT License - sinta-se livre para usar este projeto!

## 👤 Autor

Desenvolvido com ❤️ por Leonardo Moura

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
