# FitHub - Fitness Fácil 🏋️

Aplicativo web progressivo (PWA) voltado para iniciantes no mundo fitness. Oferece treinos personalizados, simples e rápidos, sem necessidade de equipamentos complexos.

---

## Funcionalidades

- **Onboarding guiado** — slides de introdução e questionário em 4 etapas para montar o perfil do usuário
- **Geração de plano** — cria automaticamente um plano de treino com base no objetivo, nível, tempo disponível e equipamentos
- **Dashboard motivacional** — exibe sequência de dias consecutivos (streak) e dicas de saúde rotativas
- **Player de treino** — timer circular por exercício, com Play/Pause e opção de pular
- **Editor de treinos** — o usuário pode renomear, reordenar, adicionar e remover exercícios de qualquer treino, além de criar novos treinos do zero
- **Biblioteca de exercícios** — exercícios de peso corporal e com elástico disponíveis para adicionar ao plano
- **Exercícios personalizados** — o usuário pode criar seus próprios exercícios com nome, descrição e duração
- **Perfil editável** — foto de perfil, nome, objetivo, nível, medidas físicas e rotina podem ser alterados a qualquer momento
- **PWA instalável** — funciona offline e pode ser adicionado à tela inicial do celular (Android e iOS)
- **Armazenamento local** — todos os dados são salvos no `localStorage` do navegador, sem necessidade de servidor ou conta

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Servidor | Node.js + Express |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Armazenamento | localStorage (client-side) |
| Ícones | Font Awesome 6 |
| PWA | Web App Manifest + Service Worker |

Sem frameworks front-end, sem banco de dados, sem autenticação — 100% client-side.

---

## Estrutura do projeto

```
web_app/
├── server.js                        # Servidor Express (serve arquivos estáticos)
├── package.json
├── nodemon.json                     # Configuração do hot-reload em dev
├── generate-icons.js                # Gerador de ícones PNG para o PWA
└── public/
    ├── index.html                   # SPA shell com todas as telas
    ├── manifest.json                # Manifesto PWA
    ├── sw.js                        # Service Worker (cache offline)
    ├── icons/                       # Ícones do app (72 → 512px)
    ├── css/
    │   └── style.css                # Estilos globais (tema verde/azul)
    └── js/
        ├── app.js                   # Roteador de telas (SPA)
        ├── data.js                  # Biblioteca de exercícios e constantes
        ├── storage.js               # Wrapper do localStorage
        ├── workout.js               # Lógica de plano, streak e CRUD de treinos
        └── screens/
            ├── splash.js
            ├── intro.js
            ├── questionnaire.js
            ├── plan-generation.js
            ├── dashboard.js
            ├── workout-detail.js
            ├── workout-editor.js    # Editor + ExercisePicker + DurationModal
```

---

## Como executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior

### Instalação

```bash
git clone https://github.com/jeancalao/FitHubApp.git
cd FitHubApp
npm install
```

### Desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Produção

```bash
npm start
```

Acesse **http://localhost:3000** no navegador.

---

## Usar no celular (mesma rede Wi-Fi)

1. Descubra o IP local da máquina:
   - Windows: `ipconfig` → endereço IPv4
2. No celular, abra o navegador e acesse `http://<IP>:3000`
3. **Android (Chrome):** toque em "Adicionar à tela inicial"
4. **iPhone (Safari):** botão compartilhar → "Adicionar à Tela de Início"

---

## Fluxo da aplicação

```
Splash (2.5s)
   ↓
Onboarding completo?
   ├── Não → Intro Slides → Questionário → Geração do Plano
   └── Sim → Dashboard
               ├── Aba Início: streak, lista de treinos, dica do dia
               │     ├── [▶] Iniciar treino → Player (timer circular)
               │     └── [✏] Editar treino → Editor de Treino
               └── Aba Perfil: foto, dados, edição completa, CTA Premium
```

---

## Tema visual

| Variável | Cor | Uso |
|----------|-----|-----|
| `--primary` | `#4CAF50` | Botões, destaques, progresso |
| `--accent` | `#2196F3` | Ícones, badges, dicas |
| `--bg` | `#F5F5F5` | Fundo geral |
| `--card-bg` | `#FFFFFF` | Cards e modais |

---

## Roadmap (próximas versões)

- [ ] Histórico de treinos com gráfico de evolução
- [ ] Integração com pagamento (FitHub Premium)
- [ ] Sincronização em nuvem com autenticação
- [ ] Notificações push de lembrete de treino
- [ ] Suporte a vídeos demonstrativos nos exercícios

---

## Licença

MIT — livre para uso, modificação e distribuição.
