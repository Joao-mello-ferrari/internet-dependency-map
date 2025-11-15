# Internet Dependency Map - CDN Analysis System

## Project Description

An interactive web application for visualizing dependency and provision relationships between countries, CDNs, and content classes. This project is part of a research internship at the Federal University of Rio Grande (FURG), Systems Research Group.

## Objective

Develop an interactive web application that displays dependency and provision relationships between countries, CDNs, and content classes using geographic visualizations (world map) and analytical filters.

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Visualization**: D3.js, Leaflet, Chart.js
- **Styling**: Styled Components
- **Maps**: React-Leaflet
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Internationalization**: i18next + react-i18next (Portuguese/English)
- **Linting**: ESLint with React, TypeScript, A11y, and Import ordering plugins
- **Formatting**: Prettier with custom configuration

## Features

- **Interactive Map**: Country visualization on world map with Leaflet
- **Country Click**: Select countries for detailed analysis
- **Side Panel**: Detailed country information with statistics
- **Advanced Filters**:
  - Filter by relationship type (Dependency/Provision based on country role)
  - Filter by CDN providers
  - Filter by content class
  - Filter by intensity (0-100% slider)
- **Relationship Visualizations**:
  - Colored arcs by intensity (green→yellow→orange→red gradient)
  - Multiple relations between countries displayed with offsets
  - Informative tooltips with relationship details
- **Intensity System**: Composite calculation based on latency, bandwidth, and reliability
- **Internationalization**: Full support for Portuguese and English with dynamic switching
- **Mock Data**: 23 countries with multiple dependency relations
- **Responsive Interface**: Adaptive design for different screen sizes
- **Dark Theme**: Interface optimized for data analysis
- **Code Quality**: ESLint + Prettier with strict rules

## Project Structure

```
src/
├── components/          # React components
│   ├── WorldMap.tsx    # Main interactive map with Leaflet
│   ├── SidePanel.tsx   # Country detail side panel
│   └── FilterPanel.tsx # Advanced filters panel
├── data/
│   └── mockData.ts     # Mock data (23 countries, relations)
├── types/
│   ├── index.ts        # TypeScript type definitions
│   └── global.d.ts     # Global declarations (Leaflet)
├── locales/            # i18n translation files
│   ├── en.json         # English translations
│   └── pt.json         # Portuguese translations
├── hooks/
│   └── useTranslatedData.ts  # Hook for translated data
├── utils/
│   └── criticalityCalculator.ts  # Intensity calculation
├── App.tsx             # Main component
└── main.tsx           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation and Execution

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Joao-mello-ferrari/internet-depency-map.git
   cd internet-depency-map
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Access in browser**:
   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Generate production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## Development Configuration

### ESLint

The project uses ESLint with strict configuration:

- TypeScript strict mode (`no-explicit-any`: error)
- React Hooks rules
- JSX Accessibility (a11y) checks
- Automatic import ordering
- Prettier integration

### Prettier

Automatic formatting with:

- Single quotes
- Semicolons
- 2 spaces indentation
- 80 characters line width
- No trailing commas

## Data Model

### Countries (23 countries)

AR, AU, BR, CA, CO, CR, DE, DO, EG, ES, FR, GB, GT, ID, IN, IT, JP, MX, NG, NZ, PG, US, ZA

### Dependency Relations

Each relation has:

- **Origin Country** (`originCountry`): Country that depends on content
- **Host Country** (`hostCountry`): Country that hosts the content
- **CDN Provider**: Cloudflare, Akamai, AWS CloudFront, Google Cloud CDN, etc.
- **Content Class**: Finance, Health, Entertainment, E-commerce, Education, News, Social Media, Streaming
- **Intensity**: Composite value (0-100%) based on:
  - Latency (ms)
  - Bandwidth (Mbps)
  - Reliability (%)

### Implemented Filters

- **Relationship Type**:
  - "Dependency" (country as origin)
  - "Provision" (country as host)
- **CDN Providers**: Multiple selection
- **Content Class**: Finance, Health, Entertainment, etc.
- **Intensity**: Range slider (0-100%)

## Contributing

This project is part of an academic internship. Suggestions and improvements are welcome through issues and pull requests.

## License

This project is developed for academic purposes as part of the mandatory internship at FURG.

## Contact

- **Student**: João Mello
- **Institution**: Federal University of Rio Grande (FURG)
- **Group**: Grupo de Pesquisa Sytems
- **Period**: June - August 2025
