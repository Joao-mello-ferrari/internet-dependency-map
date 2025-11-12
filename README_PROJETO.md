# Sistema de Análise de Dependências CDN

## Descrição do Projeto

Este é um sistema web interativo desenvolvido como parte do estágio obrigatório na Universidade Federal do Rio Grande (FURG), no Grupo de Pesquisa Systems. O sistema exibe a relação de dependência e provisão de conteúdo entre países, CDNs e classes de conteúdo, utilizando visualizações geográficas e filtros analíticos.

## Informações do Estágio

- **Período**: 16/06/2025 a 08/08/2025
- **Carga Horária**: 204 horas
- **Instituição**: Universidade Federal do Rio Grande
- **Setor**: Grupo de Pesquisa Systems

## Objetivos

### Objetivo Geral

Desenvolver uma aplicação web interativa que exibe a relação de dependência e provisão de conteúdo entre países, CDNs, protocolos (IPv4/IPv6) e classes de conteúdo, utilizando visualizações geográficas (mapa-múndi) e filtros analíticos.

### Objetivos Específicos

- Implementar mapa interativo com suporte a clique por país
- Exibir dados de dependência e provisão por classe de conteúdo
- Comparar relações entre países e entre CDNs
- Suportar análise por protocolo (IPv4 e IPv6)
- Implementar filtros avançados e melhorias na aplicação

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Visualização**: D3.js, Leaflet, Chart.js
- **Styling**: Styled Components
- **Mapas**: React-Leaflet
- **Build Tool**: Vite
- **Gerenciamento de Estado**: React Hooks

## Funcionalidades

### ✅ Implementadas

- **Mapa Interativo**: Visualização de países em mapa-múndi
- **Clique em Países**: Seleção de países para análise detalhada
- **Painel Lateral**: Informações detalhadas do país selecionado
- **Filtros Avançados**: Múltiplos filtros por países, CDNs, protocolos e classes
- **Visualizações**: Gráficos de distribuição e estatísticas
- **Dados Mockados**: Conjunto completo de dados de exemplo
- **Interface Responsiva**: Design adaptativo para diferentes telas
- **Tema Escuro**: Interface otimizada para análise de dados

### 🔄 Em Desenvolvimento

- Integração com dados reais do RIPE Atlas
- Análise de latência e performance
- Exportação de relatórios
- Análise temporal de dados

### 📋 Planejadas

- Coleta automática de dados de CDNs
- Algoritmos de análise de dependência
- Dashboard de métricas em tempo real
- API para integração com outros sistemas

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── WorldMap.tsx    # Mapa interativo principal
│   ├── SidePanel.tsx   # Painel lateral de detalhes
│   └── FilterPanel.tsx # Painel de filtros
├── data/
│   └── mockData.ts     # Dados mockados para desenvolvimento
├── types/
│   ├── index.ts        # Definições de tipos TypeScript
│   └── global.d.ts     # Declarações globais
├── App.tsx             # Componente principal
└── main.tsx           # Ponto de entrada
```

## Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução

1. **Clone o repositório e navegue para a pasta**:

   ```bash
   cd estagio
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

4. **Acesse no navegador**:
   ```
   http://localhost:5173
   ```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa verificação de lint

## Dados Mockados

O sistema atualmente utiliza dados mockados que incluem:

- **20 países** com coordenadas geográficas
- **8 CDNs** (Cloudflare, Akamai, AWS, Google, Azure, etc.)
- **8 classes de conteúdo** (Finanças, Saúde, Entretenimento, etc.)
- **100+ relações** de dependência e provisão
- **Métricas** de latência, largura de banda e confiabilidade

## Contribuição

Este projeto é parte de um estágio acadêmico. Sugestões e melhorias são bem-vindas através de issues e pull requests.

## Licença

Este projeto é desenvolvido para fins acadêmicos como parte do estágio obrigatório na FURG.

## Contato

- **Estudante**: João Mello
- **Instituição**: Universidade Federal do Rio Grande (FURG)
- **Grupo**: Sistemas de Pesquisa
- **Período**: Junho - Agosto 2025
