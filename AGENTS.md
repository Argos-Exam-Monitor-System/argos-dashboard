# ARGOS Dashboard

Este repositório contém o dashboard web do aplicador para acompanhamento de sessões de avaliação do ARGOS.

## Trabalhe a partir da issue

- Leia a issue, a spec correspondente em `docs/specs/` e o código que será alterado. A issue delimita a entrega. A spec registra o comportamento e os critérios de aceite. Use o protótipo como referência visual.
- Para mudanças de fluxo, interface ou integração, mantenha uma spec curta quando a issue precisar de detalhamento. Uma issue pequena com comportamento e verificação claros já serve como spec.
- Se as fontes divergirem em um ponto que muda escopo, comportamento ou contrato de integração, confirme a decisão antes de implementar esse ponto. Resolva detalhes locais seguindo o código existente.

## Código e interface

- Preserve a stack e as convenções do repositório. Use React, TypeScript e o React Router existente. Use `@/` para imports a partir de `src/`.
- Mantenha estado perto de quem o usa. Extraia um componente quando houver reuso real ou quando ele deixar a tela mais fácil de entender. Adicione dependência somente se resolver uma necessidade concreta que o projeto ainda não cobre.
- Em telas, priorize HTML semântico, foco visível, navegação por teclado e texto em português do Brasil. Use rótulos claros para carregamento, erro, vazio e funcionalidades ainda indisponíveis.
- Use dados reais somente com contratos confirmados. Identifique qualquer prévia como demonstração. Mantenha credenciais e dados de participantes fora do código, das referências públicas e das variáveis `VITE_*`, que são públicas.

## Verificação

- Use os testes existentes e cubra cenários novos quando houver comportamento relevante para proteger. Para mudanças de interface, confira os fluxos afetados no navegador em desktop e no tamanho menor previsto na spec.
- Antes de concluir mudanças na aplicação, rode `npm run build`, `npm run lint`, `npm run format:check` e `npm test`. Informe o resultado observado e o que ficou pendente.
