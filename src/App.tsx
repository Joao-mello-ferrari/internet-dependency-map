import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { createGlobalStyle } from 'styled-components';

import { FilterPanel } from './components/FilterPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { SidePanel } from './components/SidePanel';
import { WorldMap } from './components/WorldMap';
import { mockData } from './data/mockData';
import type { FilterOptions, DependencyRelation } from './types';
import 'leaflet/dist/leaflet.css';

// Global styles para reset e tema escuro
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #1e1e2e;
    color: #eceff4;
    overflow: hidden;
  }

  .leaflet-popup-content-wrapper {
    background: #2e3440;
    color: #eceff4;
    border-radius: 8px;
  }

  .leaflet-popup-tip {
    background: #2e3440;
  }

  .leaflet-tooltip {
    background: #2e3440;
    color: #eceff4;
    border: 1px solid #4c566a;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .leaflet-tooltip:before {
    border-top-color: #4c566a;
  }

  .country-tooltip, .relation-tooltip {
    background: #2e3440 !important;
    color: #eceff4 !important;
    border: 1px solid #4c566a !important;
    border-radius: 6px !important;
    padding: 8px !important;
    font-size: 12px !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4) !important;
  }

  .bidirectional-tooltip {
    max-width: 300px !important;
    font-size: 11px !important;
  }

  /* Estilos para linhas bidirecionais */
  .leaflet-interactive.bidirectional:hover {
    stroke-width: 6 !important;
    opacity: 1 !important;
  }

  /* Animação sutil para arcos */
  .leaflet-interactive.bidirectional {
    animation: pulse-arc 3s ease-in-out infinite;
  }

  @keyframes pulse-arc {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  height: 80px;
  background: #2e3440;
  border-bottom: 1px solid #4c566a;
  padding: 15px 20px;
  position: relative;
  z-index: 1000;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100px;
  }

  .header-content {
    flex: 1;
  }

  h1 {
    color: #88c0d0;
    font-size: 24px;
    font-weight: 600;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  .subtitle {
    color: #d8dee9;
    font-size: 14px;
    margin-top: 5px;
    font-weight: 300;

    @media (max-width: 600px) {
      font-size: 10px;
    }
  }

  .project-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: 12px;
    color: #81a1c1;
    margin-left: 20px;

    @media (max-width: 600px) {
      flex-direction: row-reverse;
      justify-content: space-between;
      font-size: 10px;
      margin-left: 0;
      width: 100%;
      margin-top: 8px;
    }
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 80px);
  width: 100vw;

  @media (max-width: 600px) {
    height: calc(100vh - 100px);
  }
`;

const LoadingOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 30, 46, 0.8);
  display: ${props => (props.visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  color: #88c0d0;
  font-size: 18px;

  .loading-spinner {
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #81a1c1;
  background: rgba(30, 30, 46, 0.9);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #4c566a;
  z-index: 1500;

  h3 {
    color: #88c0d0;
    margin-bottom: 10px;
  }

  p {
    color: #d8dee9;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .suggestion {
    color: #a3be8c;
    font-size: 12px;
    font-style: italic;
  }
`;

function App() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cdns: [],
    protocols: [],
    contentClasses: [],
    intensityRange: [0, 100],
    relationType: 'all'
  });

  // Debug: Verificar dados carregados
  console.log('📊 APP.TSX - Dados carregados:');
  console.log(
    '📊 Países disponíveis:',
    mockData.countries.map(c => `${c.id} (${c.name})`)
  );
  console.log('📊 Total de relações:', mockData.relations.length);
  console.log(
    '📊 Amostra de relações Brasil:',
    mockData.relations.filter(
      r => r.originCountry === 'BR' || r.hostCountry === 'BR'
    )
  );
  console.log('📊 Estado atual selectedCountry:', selectedCountry);

  const handleCountryClick = (countryCode: string) => {
    console.log('🚀 APP.TSX - handleCountryClick chamado com:', countryCode);
    console.log('🚀 Estado atual selectedCountry:', selectedCountry);

    setIsLoading(true);
    // Simular carregamento de dados
    setTimeout(() => {
      const newSelection = countryCode === selectedCountry ? null : countryCode;
      console.log('🚀 Novo estado selectedCountry:', newSelection);
      setSelectedCountry(newSelection);
      setIsLoading(false);
    }, 500);
  };

  const handleCloseSidePanel = () => {
    setSelectedCountry(null);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Não há mais necessidade de verificar filtro de países
  };

  const handleRelationHover = (_relation: DependencyRelation | null) => {
    // Funcionalidade para hover pode ser implementada no futuro
  };

  // Filtrar relações baseado nos filtros ativos
  const filteredRelations = mockData.relations.filter(relation => {
    // Removido filtro de países - agora países são selecionados diretamente no mapa
    if (filters.cdns.length && !filters.cdns.includes(relation.cdnProvider)) {
      return false;
    }
    if (
      filters.protocols.length &&
      !filters.protocols.includes(relation.protocol.type)
    ) {
      return false;
    }
    if (
      filters.contentClasses.length &&
      !filters.contentClasses.includes(relation.contentClass)
    ) {
      return false;
    }
    if (
      relation.intensity < filters.intensityRange[0] ||
      relation.intensity > filters.intensityRange[1]
    ) {
      return false;
    }
    // Relation type filter based on selected country's role
    if (selectedCountry && filters.relationType !== 'all') {
      if (filters.relationType === 'dependency') {
        // Show only relations where selected country is the origin (depends on others)
        if (relation.originCountry !== selectedCountry) {
          return false;
        }
      } else if (filters.relationType === 'provision') {
        // Show only relations where selected country is the host (provides to others)
        if (relation.hostCountry !== selectedCountry) {
          return false;
        }
      }
    }
    return true;
  });

  const hasActiveFilters =
    filters.cdns.length > 0 ||
    filters.protocols.length > 0 ||
    filters.contentClasses.length > 0 ||
    filters.intensityRange[0] > 0 ||
    filters.intensityRange[1] < 100 ||
    filters.relationType !== 'all';

  const shouldShowEmptyState =
    hasActiveFilters && filteredRelations.length === 0;

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <div className="header-content">
            <h1>{t('app.title')}</h1>
            <p className="subtitle">{t('app.subtitle')}</p>
          </div>
          <div className="project-info">
            <LanguageSwitcher />
            {/* <div>{t("app.projectInfo.internship")}</div> */}
            <div>{t('app.projectInfo.researchSystem')}</div>
          </div>
        </Header>

        <MapContainer>
          <WorldMap
            countries={mockData.countries}
            relations={mockData.relations} // Passar todas as relações, não só as filtradas
            filters={filters}
            selectedCountry={selectedCountry}
            onCountryClick={handleCountryClick}
            onRelationHover={handleRelationHover}
          />

          <LoadingOverlay visible={isLoading}>
            <span className="loading-spinner">⟳</span>
            {t('common.loading')}
          </LoadingOverlay>

          {shouldShowEmptyState && (
            <EmptyState>
              <h3>{t('common.noData')}</h3>
              <p>Os filtros aplicados não retornaram nenhum resultado.</p>
              <p className="suggestion">
                Tente ajustar os filtros ou limpar algumas seleções para ver
                mais dados.
              </p>
            </EmptyState>
          )}
        </MapContainer>

        <FilterPanel
          filters={filters}
          cdns={mockData.cdns}
          contentClasses={mockData.contentClasses}
          onFiltersChange={handleFiltersChange}
          isOpen={isFilterPanelOpen}
          onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        />

        <SidePanel
          selectedCountry={selectedCountry}
          countries={mockData.countries}
          relations={filteredRelations}
          cdns={mockData.cdns}
          contentClasses={mockData.contentClasses}
          onClose={handleCloseSidePanel}
        />
      </AppContainer>
    </>
  );
}

export default App;
