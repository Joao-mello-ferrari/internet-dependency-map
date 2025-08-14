# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context

This is an interactive web application for visualizing dependency and provision relationships between countries, CDNs, protocols (IPv4/IPv6), and content classes. The project is part of a research internship focused on network analysis and data visualization.

## Key Components

- **Interactive World Map**: Built with D3.js/Leaflet for geographic visualization
- **Data Analysis**: CDN performance, protocol distribution, content class relationships
- **Filtering System**: Multiple filters for countries, CDNs, protocols, and content classes
- **Side Panel**: Detailed information display when countries are selected

## Technology Stack

- **Frontend**: React + TypeScript with Vite
- **Visualization**: D3.js, Leaflet, Chart.js
- **Data**: Mock data initially, later integration with RIPE Atlas
- **Styling**: CSS modules or styled-components

## Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices with functional components and hooks
- Implement responsive design for different screen sizes
- Use semantic HTML and accessible components
- Organize code with clear separation of concerns

## Data Structure

The application handles data about:
- Countries with geographic coordinates
- CDN providers and their coverage
- IPv4/IPv6 protocol metrics
- Content classes (finance, health, entertainment, etc.)
- Dependency/provision relationships between entities
