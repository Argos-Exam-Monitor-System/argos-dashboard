# ARGOS Dashboard

Dashboard web para aplicadores acompanharem sessões de avaliação do ARGOS.
O frontend usa React, TypeScript e Vite. O login é feito pelo Keycloak.

## Pré-requisitos

- Node.js 22.12+ e npm.
- Keycloak configurado para desenvolvimento. Para rodá-lo localmente, use Docker.

## Como rodar

Na raiz do repositório, instale as dependências e crie o arquivo `.env`:

```bash
npm ci
cp .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env` para copiar o arquivo.

Configure o Keycloak conforme a seção abaixo. Depois, inicie o frontend:

```bash
npm run dev
```

Abra [http://localhost:5173/login](http://localhost:5173/login).
Use o endereço `localhost:5173` para corresponder à origem e às URLs
cadastradas no client do Keycloak.

## Keycloak local

Se o container `argos-keycloak` já existir, rode `docker start argos-keycloak`.
Para criar um container pela primeira vez, substitua `SENHA_LOCAL` por uma
senha para o seu ambiente e execute:

```bash
docker run -d --name argos-keycloak -p 127.0.0.1:8080:8080 -v argos-keycloak-data:/opt/keycloak/data -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=SENHA_LOCAL quay.io/keycloak/keycloak:26.8.2 start-dev
```

Abra o [painel de administração](http://localhost:8080/admin/) com o usuário
`admin` e a senha definida acima. Em uma instalação nova, crie o realm
`argos-dev` e, dentro dele, configure um client OpenID Connect:

| Campo                           | Valor                                                           |
| ------------------------------- | --------------------------------------------------------------- |
| Client ID                       | `argos-dashboard`                                               |
| Client authentication           | Off                                                             |
| Standard flow                   | On                                                              |
| Direct access grants            | Off                                                             |
| Método PKCE                     | `S256`                                                          |
| Valid redirect URIs             | `http://localhost:5173/sessoes` e `http://localhost:5173/login` |
| Valid post logout redirect URIs | `http://localhost:5173/login`                                   |
| Web origins                     | `http://localhost:5173`                                         |

No realm `argos-dev`, crie as roles `Aplicador` e `Participante`. Crie o usuário
`aplicador-teste`, atribua a role `Aplicador` e defina uma senha local em
**Credentials**. Use essa conta para entrar no dashboard.

A configuração feita pelo painel fica no volume local do Keycloak. O ambiente
reproduzível da equipe, com o realm versionado, é acompanhado na
[issue #3 da infra](https://github.com/Argos-Exam-Monitor-System/argos-infra/issues/3).

## Variáveis de ambiente

Veja o arquivo [`.env.example`](.env.example).

| Variável                  | Uso                                                        |
| ------------------------- | ---------------------------------------------------------- |
| `VITE_KEYCLOAK_URL`       | URL do Keycloak. Localmente, `http://localhost:8080`.      |
| `VITE_KEYCLOAK_REALM`     | Realm `argos-dev`.                                         |
| `VITE_KEYCLOAK_CLIENT_ID` | Client público `argos-dashboard`.                          |
| `VITE_API_BASE_URL`       | URL base da API Spring, usada na integração com o backend. |
| `VITE_APP_NAME`           | Nome da aplicação.                                         |

As variáveis `VITE_*` são públicas. Mantenha senhas e tokens fora do `.env`
do frontend e do repositório.

## Como testar o login

1. Em uma janela anônima, abra `/sessoes`. O dashboard deve levar você a `/login`.
2. Clique em **Entrar** e autentique-se no Keycloak com `aplicador-teste`.
   O navegador deve voltar para `/sessoes`.
3. Recarregue `/sessoes`. Com uma sessão válida, o acesso deve continuar disponível.
4. Clique em **Sair**. O dashboard deve voltar a `/login`. Abra `/sessoes`
   novamente e confirme que o login é exigido.

## Scripts

| Comando                | O que faz                             |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento. |
| `npm run build`        | Gera a versão de produção.            |
| `npm run lint`         | Verifica o código com ESLint.         |
| `npm run format`       | Formata o código com Prettier.        |
| `npm run format:check` | Confere a formatação.                 |
| `npm test`             | Executa os testes.                    |

## Estrutura de pastas

- `src/pages/` e `src/routes/` contêm as páginas e a configuração das rotas.
- `src/components/` e `src/layouts/` contêm a interface compartilhada.
- `src/config/` e `src/services/` contêm a configuração de ambiente e o cliente HTTP.
- `docs/specs/` contém as especificações das issues.

Use o alias `@/` para importar a partir de `src/`, como em
`import { env } from '@/config/env'`.

## Integrações pendentes

O login local pode ser testado com o dashboard e o Keycloak. A
[issue #2 do dashboard](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/2)
também exige validar uma chamada autenticada ao endpoint protegido da
[issue #3 do backend](https://github.com/Argos-Exam-Monitor-System/argos-backend/issues/3).
O login institucional pelo SUAP fica para uma etapa própria.
