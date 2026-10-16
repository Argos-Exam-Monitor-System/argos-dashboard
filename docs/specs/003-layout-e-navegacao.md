# Issue 3 · Barra superior e navegação inicial

[Issue #3](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/3)

## Objetivo

Entregar a barra superior do protótipo com todos os destinos de navegação e o perfil. Nas telas do dashboard, abaixo da barra aparece somente a faixa com o título. O corpo de cada tela fica vazio até a implementação da funcionalidade.

## Navegação

| Entrada no protótipo    | Rota               | Título                  |
| ----------------------- | ------------------ | ----------------------- |
| Sessões                 | `/sessoes`         | Minhas sessões          |
| Sala de espera          | `/sessoes/espera`  | Sala de espera          |
| Ao vivo                 | `/sessoes/ao-vivo` | Sessão ao vivo          |
| Relatórios              | `/relatorios`      | Relatórios              |
| Coordenação             | `/coordenacao`     | Histórico institucional |
| Sair, ao lado do perfil | `/login`           | Entrar                  |

- Use a ordem e os rótulos da tabela na barra. A marca ARGOS também leva para **Ao vivo**, como no protótipo. Use links do React Router e sinalize o destino ativo com `aria-current="page"`.
- Preserve o redirecionamento de `/` para `/sessoes`. Se `/sessoes/previa` já estiver na implementação local, redirecione para `/sessoes/ao-vivo`. Mantenha `/acesso-negado` acessível por URL, com a barra e o título **Acesso negado**, sem criar um item de menu para ela.
- **Sair** leva à tela provisória **Entrar**. Ela tem somente o título e usa um layout próprio, como o quadro Login. Autenticação, logout real e controle de acesso pertencem à [issue #2](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/2).
- A barra inclui a identificação do perfil com nome, papel e avatar circular com iniciais. Use uma identidade estática de demonstração enquanto a autenticação estiver pendente. A aparência do perfil segue o protótipo em todas as rotas do dashboard.

## Referência visual

Use o quadro **Componente · barra superior** em `ARGOS · Dashboard v2.html` como referência direta. A versão anexada também pode ter o sufixo `(1)`.

- Use a imagem original da marca, com altura de `30px`, e a fonte **Outfit**. A barra tem fundo `#3A2716`, texto `#F2E6C9`, largura interna máxima de `1360px`, altura mínima de `72px` e recuo lateral `clamp(16px, 3vw, 40px)`.
- Os links têm altura mínima de `40px`, recuo horizontal de `14px`, raio de `8px` e espaçamento de `4px` entre eles. O ativo usa fundo `#F2E6C9`, texto `#3A2716` e peso `500`. Os demais usam texto `#E6D2A3`. O destaque ativo é preenchido, conforme o protótipo.
- À direita, alinhe nome e papel em duas linhas, avatar de `38px` e link **Sair**. O avatar tem fundo `#E6D2A3` e texto `#3A2716`. Papel e link usam `#C9B48E`. Preserve o espaçamento de `12px` entre os elementos do perfil.
- Reaproveite a faixa escura dos quadros do dashboard, com fundo `#3A2716`, borda superior `#6E5438`, título Outfit de `40px` e peso `500` no desktop. Use as mesmas largura máxima e margens da barra. O corpo permanece em `#F2E6C9`. Os títulos desta etapa identificam as telas, independentemente dos nomes de provas usados no protótipo.
- Em telas estreitas, permita que links e perfil quebrem de linha sem perder itens nem causar rolagem horizontal.

## Implementação

- Comece pelo diff local e pelo inventário de componentes, estilos, assets e rotas. Adapte o `MainLayout`, o roteador e os componentes já criados antes de extrair novos.
- Aplique Atomic Design à composição real desta entrega. Os links e o avatar são elementos básicos, o perfil é uma composição, a barra superior é um organismo e o layout com faixa de título é o template compartilhado. As rotas fornecem o título de cada tela. Mantenha uma única implementação do menu, do perfil e do título do dashboard.
- Retire do layout os cards de **Alunos** e **Linha do tempo**, o link **Prévia do monitoramento**, o botão **Voltar para sessões** e os demais blocos, ações e textos provisórios do corpo. Componentes genéricos de carregamento, erro e vazio que já existirem podem ficar disponíveis para a próxima etapa, fora dessas páginas.

## Critérios de aceite

- [ ] A barra exibe marca, cinco links na ordem do protótipo, perfil e **Sair**. Cada destino abre sua rota e exibe o título da tabela.
- [ ] Só o item da rota ativa tem o destaque preenchido. Acesso direto, voltar e avançar do navegador funcionam. Os links têm foco visível e funcionam por teclado.
- [ ] Abaixo da barra há somente o título da tela, seguido do corpo vazio. A tela **Entrar** exibe somente seu título.
- [ ] A comparação com o protótipo em `1440px` confirma fonte, marca, cores, dimensões, espaçamento e alinhamento da barra e da faixa de título. Em `390px`, todos os links e o perfil continuam acessíveis, sem rolagem horizontal.
- [ ] Testes de navegação usam a stack existente. Build, lint, formatação e testes passam.
