# ARGOS Dashboard

Dashboard web para aplicadores do sistema ARGOS (monitoramento de sessões de avaliação).

## Pré-requisitos

- Node.js 20.19+ e npm

## Como rodar

1. Instale as dependências: `npm install`
2. Crie o arquivo de ambiente: `cp .env.example .env`
3. Inicie o projeto: `npm run dev` (abre em http://localhost:5173)

## Scripts

| Comando          | O que faz                            |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Inicia o servidor de desenvolvimento |
| `npm run build`  | Gera a versão de produção            |
| `npm run lint`   | Verifica problemas no código         |
| `npm run format` | Formata o código com Prettier        |
| `npm test`       | Roda os testes                       |

## Variáveis de ambiente

Veja `.env.example`. Todas as variáveis com prefixo `VITE_` são **públicas**: nunca coloque segredos nelas.

## Estrutura de pastas

(descreva resumidamente a árvore da Etapa 6)

## Imports

Use o alias `@/` para importar a partir de `src/` (ex.: `import { env } from '@/config/env'`).
