# Programa de Relacionamento - Sistema de Cálculo de Desempenho

## Visão Geral
Este sistema permite que vendedores internos do Grupo Atos calculem seu desempenho com base em métricas específicas (vendas, vidas contratadas e adimplência) e visualizem seu progresso profissional através de gráficos interativos e indicadores visuais.

## Arquivos do Sistema
- **index.html** - Dashboard principal do vendedor interno
- **login.html** - Página de login do sistema
- **script.js** - Lógica de cálculo e visualização de desempenho
- **styles.css** - Estilos visuais do sistema
- **sua-logo.png** - Logotipo da empresa (deve ser fornecido por você)

## Funcionalidades Principais
1. **Sistema de Login**
   - Acesso diferenciado por tipo de usuário (Administrador, Supervisor, Vendedor Interno, Parceiro Externo)
   - Validação de campos e feedback visual
   - Opção de "lembrar dados"

2. **Dashboard do Vendedor**
   - Indicadores de desempenho em tempo real
   - Calculadora de progresso profissional
   - Gráficos interativos para visualização de dados
   - Interface responsiva e amigável

3. **Calculadora de Desempenho**
   - Análise de vendas, vidas contratadas e adimplência
   - Comparação com metas específicas para cada nível profissional
   - Feedback visual sobre progresso e evolução na carreira
   - Sugestões de melhoria baseadas nos resultados

## Níveis Profissionais
O sistema reconhece os seguintes níveis de carreira:
- **Treinando** - Nível inicial
- **Consultor** - Segundo nível
- **Corretor** - Terceiro nível
- **Especialista** - Quarto nível
- **Representante** - Nível mais alto

## Instalação e Uso
1. Baixe todos os arquivos para um diretório em seu servidor web
2. Adicione sua logo corporativa com o nome "sua-logo.png"
3. Abra o arquivo "login.html" em um navegador
4. Faça login como "Vendedor Interno" para acessar o dashboard

## Personalização
O sistema pode ser personalizado editando:
- As cores e estilos no arquivo **styles.css** (através das variáveis CSS)
- As metas de desempenho no arquivo **script.js** (constante METAS)
- Textos e labels editando os arquivos HTML

## Requisitos Técnicos
- Navegador web moderno com suporte a JavaScript ES6+
- Conexão com internet para carregar bibliotecas externas (Chart.js e Font Awesome)
- Servidor web para hospedagem dos arquivos

## Bibliotecas Utilizadas
- **Chart.js** - Para criação de gráficos interativos
- **Font Awesome** - Para ícones e elementos visuais

## Créditos
Desenvolvido para o Grupo Atos como parte do Programa de Relacionamento.
© 2025 Todos os direitos reservados.
