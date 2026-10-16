# Issue 3 · Layout e navegação inicial das sessões

[Issue #3](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/3)

## Objetivo

Dar ao aplicador um ponto de partida para as sessões e demonstrar a navegação até a futura tela de monitoramento. A entrega deve funcionar sem backend e identificar as telas que ainda dependem de integração.

## Rotas e comportamento

| Rota | Comportamento |
| --- | --- |
| `/` | Redireciona para `/sessoes`. |
| `/sessoes` | Exibe **Minhas sessões**, informa que a lista depende da integração e oferece o link **Prévia do monitoramento**. |
| `/sessoes/previa` | Exibe **Prévia do monitoramento**, identifica a tela como provisória e oferece **Voltar para sessões**. A rota é estática e pode ser aberta diretamente. |
| `/acesso-negado` | Exibe **Acesso negado**, explica a restrição e oferece um link para sessões. A tela pode ser aberta diretamente para demonstração. |

- Evolua o `MainLayout` e o roteador existentes. Compartilhe a barra superior entre as telas e mantenha **Sessões** como item ativo na lista e na prévia.
- Apresente alunos e linha do tempo como regiões da futura tela de monitoramento, com mensagens provisórias. Mantenha a prévia livre de nomes, contagens e indicadores que pareçam vir de uma sessão ativa.
- Prepare estados reutilizáveis de **carregamento**, **erro** e **vazio**. Use carregamento para operações pendentes, erro para falhas e vazio quando uma consulta concluída não retornar itens. Nesta etapa, as telas usam uma mensagem de integração pendente. Exercite os três estados em teste ou durante a verificação dos componentes, sem temporizadores ou requisições artificiais na interface entregue.
- Sala de espera, criação de sessão, ações de monitoramento, Relatórios, Coordenação, API e atualização em tempo real ficam para etapas futuras. Login, proteção de rotas e logout pertencem à [issue #2](https://github.com/Argos-Exam-Monitor-System/argos-dashboard/issues/2).

## Referência visual

Use `ARGOS · Dashboard v2.html` como referência visual para a barra superior, a lista e a prévia.

- **Barra superior** com marca ARGOS, fundo tinta `#3A2716`, texto papiro `#F2E6C9` e destaque para o item ativo. Mostre links apenas para fluxos disponíveis.
- **Sessões** com faixa escura para o título e conteúdo em fundo papiro. Use pergaminho `#E6D2A3` para superfícies secundárias e laranja queimado `#C2581C` como cor de destaque onde houver contraste adequado. A composição do protótipo usa largura de conteúdo de até `1360px` e margens laterais fluidas.
- **Sessão ao vivo** como base da prévia, com faixa de título e regiões de alunos e linha do tempo lado a lado quando houver espaço. A tipografia de referência é Outfit, com fonte de sistema como alternativa. Aplique a mesma linguagem visual à tela de acesso negado.

Priorize a composição desktop. Em largura estreita, empilhe as regiões, mantenha a navegação alcançável e faça o conteúdo caber na largura da tela. O fluxo operacional de monitoramento no celular será definido com a tela funcional.

## Critérios de aceite

- [ ] Abrir `/` leva a **Minhas sessões**. O link de prévia, o retorno para sessões e o histórico do navegador funcionam.
- [ ] Abrir diretamente `/sessoes/previa` e `/acesso-negado` renderiza as telas esperadas com retorno para sessões.
- [ ] Lista e prévia informam que são provisórias e apresentam somente os controles disponíveis.
- [ ] Os três estados reutilizáveis exibem mensagens distintas. O componente de carregamento expõe uma mensagem de status à tecnologia assistiva.
- [ ] A 1440 px e 390 px, o conteúdo cabe na tela sem rolagem horizontal. Os links funcionam por teclado e exibem foco visível.
- [ ] Os testes de navegação rodam com a stack existente, e build, lint, formatação e testes passam.
