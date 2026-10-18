# Issue 2 · Login do dashboard com Keycloak e PKCE

[Issue #2](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/2)

## Objetivo

Autenticar o aplicador no dashboard pelo Keycloak, proteger as rotas internas e
usar o access token nas chamadas autorizadas à API Spring.

## Etapa 4 · Autenticação no frontend

- Integrar `keycloak-js` ao React Router existente. Usar o client público
  `argos-dashboard`, no realm `argos-dev`, com Authorization Code e PKCE `S256`.
- Na página pública `/login`, adicionar a ação **Entrar** para abrir a tela do
  Keycloak. O usuário digita a senha no Keycloak e, após o login, retorna a
  `/sessoes`.
- Aguardar a verificação da sessão antes de renderizar as rotas internas. Se
  alguém abrir uma rota protegida sem sessão válida, redirecionar para `/login`.
  Se já estiver autenticado e abrir `/login`, redirecionar para `/sessoes`.
- Trocar a navegação provisória de **Sair** pelo logout do Keycloak. Encerrar a
  sessão local e retornar a `/login`.
- Tentar renovar o token quando necessário. Se a renovação falhar, limpar a
  sessão local e exibir em `/login` uma mensagem para entrar novamente.
  Se o Keycloak estiver indisponível, mostrar uma mensagem de erro com opção
  de tentar novamente.

## Configuração local

| Parâmetro                 | Valor de desenvolvimento                    |
| ------------------------- | ------------------------------------------- |
| `VITE_KEYCLOAK_URL`       | `http://localhost:8080`                     |
| `VITE_KEYCLOAK_REALM`     | `argos-dev`                                 |
| `VITE_KEYCLOAK_CLIENT_ID` | `argos-dashboard`                           |
| Retorno após login        | `http://localhost:5173/sessoes`             |
| Retorno após logout       | `http://localhost:5173/login`               |
| Web Origin                | `http://localhost:5173`                     |
| Conta de teste            | `aplicador-teste`, com o perfil `Aplicador` |

Documentar os valores públicos em `.env.example` e autorizar os retornos nos
campos correspondentes do client no Keycloak. Manter os tokens em memória e
credenciais fora do código e das variáveis `VITE_*`. O login institucional pelo
SUAP fica para a etapa de integração institucional.

## Integração com a API Spring

Quando o endpoint protegido da
[issue #3 do backend](https://github.com/Argos-Exam-Monitor-System/argos-backend/issues/3)
estiver disponível, usar o cliente HTTP existente e manter a URL da API
configurável por `VITE_API_BASE_URL`. Enviar `Authorization: Bearer <access_token>`
somente nas chamadas autenticadas à API configurada, com um token válido.
Validar a chamada contra o endpoint real para concluir a issue #2.

## Critérios de aceite

- [ ] Sem sessão, abrir `/sessoes` diretamente leva a `/login`.
- [ ] Entrar como `aplicador-teste` no Keycloak leva a `/sessoes`.
- [ ] Recarregar `/sessoes` com uma sessão válida mantém o acesso.
- [ ] Clicar em **Sair** retorna a `/login`. Abrir `/sessoes` em seguida exige
      novo login.
- [ ] Se a sessão expirar e a renovação falhar, o usuário volta a `/login` e
      recebe uma mensagem clara.
- [ ] `npm run build`, `npm run lint`, `npm run format:check` e `npm test` passam.
- [ ] Uma chamada real ao endpoint protegido do Spring funciona com o access
      token do aplicador. Este critério depende da entrega do backend.
