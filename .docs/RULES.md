# RULES.md

# Regras para Agentes de IA — Bruno Lucildo

## 1. Objetivo

Este documento define as instruções que agentes de IA deverão seguir ao analisar, planejar, implementar, revisar ou modificar o código do portfólio.

O objetivo é garantir que a utilização de IA contribua para a qualidade do projeto sem comprometer arquitetura, consistência, segurança ou identidade visual.

## 2. Hierarquia de documentação

Antes de executar uma tarefa, o agente deverá consultar os documentos relevantes.

Ordem de referência:

1. `BUSINESS.md`: objetivo e posicionamento.
2. `CONTENT.md`: conteúdo e comunicação.
3. `DESIGN.md`: direção visual.
4. `DESIGN_SYSTEM.md`: regras visuais e componentes.
5. `ARCHITECTURE.md`: arquitetura.
6. `DEVELOPMENT.md`: convenções de desenvolvimento.
7. `SEO.md`: requisitos de descoberta.
8. `QA.md`: critérios de qualidade.
9. `RULES.md`: regras para agentes.
10. `.specs/`: requisitos específicos da funcionalidade.

Em caso de conflito:

- Requisitos específicos da tarefa devem ser interpretados dentro das decisões gerais do projeto.
- Não alterar silenciosamente decisões já aprovadas.
- Identificar contradições e solicitar esclarecimento quando necessário.
- Nunca ignorar requisitos de segurança ou acessibilidade.

## 3. Comportamento esperado

O agente deverá:

- Compreender o contexto antes de modificar arquivos.
- Identificar os documentos relevantes.
- Analisar a implementação existente.
- Propor a menor solução adequada.
- Respeitar padrões e componentes existentes.
- Evitar alterações fora do escopo.
- Explicar decisões técnicas relevantes.
- Executar verificações aplicáveis.
- Informar limitações e problemas encontrados.

## 4. Planejamento antes da implementação

Para tarefas que envolvam múltiplos arquivos ou mudanças estruturais:

1. Entender o requisito.
2. Identificar a SPEC relacionada.
3. Analisar a estrutura existente.
4. Identificar componentes e recursos reutilizáveis.
5. Definir os arquivos que serão alterados.
6. Avaliar impactos em idiomas, SEO, acessibilidade e responsividade.
7. Apresentar um plano antes de executar alterações de maior impacto.

Para ajustes pequenos e bem definidos, evitar planejamento excessivo.

## 5. Regras de implementação

### 5.1. Arquitetura

- Respeitar `ARCHITECTURE.md`.
- Não introduzir backend sem necessidade.
- Não adicionar banco de dados.
- Não criar serviços ou camadas desnecessárias.
- Priorizar recursos nativos do framework.
- Evitar abstrações prematuras.

### 5.2. Código

- Utilizar TypeScript strict.
- Evitar `any`.
- Manter funções e componentes com responsabilidades claras.
- Evitar duplicação.
- Evitar componentes excessivamente grandes.
- Não deixar código morto.
- Não manter comentários que apenas repetem o código.
- Não ocultar erros com casts ou supressões sem justificativa.

### 5.3. Interface

- Respeitar `DESIGN.md` e `DESIGN_SYSTEM.md`.
- Utilizar tokens existentes.
- Não introduzir outra identidade visual.
- Não adicionar elementos decorativos sem propósito.
- Manter consistência entre páginas.
- Garantir responsividade.

### 5.4. Conteúdo

- Não inventar experiências.
- Não inventar métricas.
- Não inventar empresas, cargos ou tecnologias.
- Não afirmar que projetos conceituais foram lançados.
- Não publicar informações confidenciais.
- Preservar o posicionamento profissional definido.
- Manter os textos naturais e objetivos.

### 5.5. Idiomas

- Inglês como idioma padrão.
- Português brasileiro como alternativa.
- Não misturar idiomas.
- Não remover traduções existentes.
- Não deixar textos visíveis sem tradução correspondente.
- Não utilizar traduções literais que prejudiquem a comunicação.

## 6. Identidade e posicionamento

O site representa uma marca pessoal profissional.

O agente não deverá introduzir:

- "Open to Work".
- "Available for Opportunities".
- "Hire Me".
- Indicadores de disponibilidade profissional.
- Comunicação que transforme o site exclusivamente em uma página de candidatura.

CTAs preferidos:

- Explore My Work.
- Get in Touch.
- Connect with Me.
- View Resume.

A comunicação deverá transmitir experiência, liderança técnica, engenharia de software e exploração tecnológica.

## 7. Design e animações

- Manter identidade Dark Premium.
- Utilizar verde-limão com moderação.
- Evitar estética genérica de template.
- Não adicionar neon excessivo, glitch ou efeitos de terminal.
- Respeitar o espaço negativo.
- Evitar animações desnecessárias.
- Não utilizar scroll hijacking.
- Respeitar `prefers-reduced-motion`.
- Simplificar parallax em dispositivos móveis.

## 8. Acessibilidade

Toda implementação deverá considerar:

- HTML semântico.
- Navegação por teclado.
- Foco visível.
- Contraste.
- Textos alternativos.
- Rótulos acessíveis.
- Movimento reduzido.
- Estados de interação identificáveis.

Não utilizar apenas cor para comunicar estados.

## 9. Segurança

- Nunca expor segredos.
- Não criar credenciais fictícias para produção.
- Não inserir dados sensíveis no código.
- Não adicionar scripts externos sem justificativa.
- Não executar comandos destrutivos sem autorização.
- Não alterar configurações de infraestrutura sem avaliar os impactos.
- Não introduzir dependências suspeitas.

## 10. Dependências

Antes de instalar uma biblioteca:

1. Verificar se já existe solução no projeto.
2. Avaliar se recursos nativos atendem à necessidade.
3. Considerar tamanho e manutenção.
4. Avaliar segurança e compatibilidade.
5. Justificar a inclusão.

Não instalar dependências por preferência pessoal do agente.

## 11. Testes e validação

Após implementar:

- Executar verificações de tipos.
- Executar lint.
- Executar testes aplicáveis.
- Executar build quando pertinente.
- Verificar idiomas.
- Verificar responsividade.
- Verificar acessibilidade.
- Revisar alterações realizadas.

Nunca afirmar que um teste passou sem tê-lo executado.

Se não for possível executar algum teste, informar explicitamente.

## 12. Escopo e alterações

- Não modificar arquivos sem relação com a tarefa.
- Não reescrever funcionalidades estáveis sem necessidade.
- Não apagar conteúdo existente sem autorização.
- Não alterar dependências principais sem justificativa.
- Não atualizar documentação com decisões que ainda não foram aprovadas.
- Não substituir implementações por versões simplificadas que removam funcionalidades existentes.

## 13. Uso de SPECS

Toda funcionalidade com requisitos específicos deverá possuir uma SPEC correspondente.

O agente deverá:

- Ler a SPEC antes de implementar.
- Seguir requisitos funcionais e não funcionais.
- Respeitar critérios de aceitação.
- Registrar divergências.
- Atualizar a SPEC quando mudanças forem aprovadas.

## 14. Formato de entrega

Ao concluir uma tarefa, apresentar:

1. Resumo do que foi implementado.
2. Arquivos criados ou alterados.
3. Decisões técnicas relevantes.
4. Testes executados e resultados.
5. Pendências ou limitações.
6. Divergências em relação à SPEC, se existirem.

Não declarar a tarefa concluída quando houver requisitos obrigatórios pendentes.

## 15. Regra final

O agente deverá atuar como um desenvolvedor experiente integrado ao projeto, não como um gerador automático de código.

A prioridade é entregar soluções corretas, simples, consistentes, acessíveis e sustentáveis.