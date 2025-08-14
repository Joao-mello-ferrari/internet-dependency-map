import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import styled from 'styled-components';
import type { Country, DependencyRelation, FilterOptions } from '../types';

interface WorldMapProps {
  countries: Country[];
  relations: DependencyRelation[];
  filters: FilterOptions;
  selectedCountry: string | null;
  onCountryClick: (countryCode: string) => void;
  onRelationHover: (relation: DependencyRelation | null) => void;
}

const MapWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;

  .leaflet-container {
    height: 100vh;
    width: 100vw;
    background: #1e1e2e;
  }

  .country-default {
    fill: #3b4252;
    stroke: #4c566a;
    stroke-width: 1;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .country-highlighted {
    fill: #81a1c1;
    stroke: #88c0d0;
    stroke-width: 2;
  }

  .country-selected {
    fill: #bf616a;
    stroke: #d08770;
    stroke-width: 3;
  }

  .dependency-line {
    stroke: #bf616a;
    stroke-width: 2;
    fill: none;
    opacity: 0.7;
    animation: pulse 2s infinite;
  }

  .provision-line {
    stroke: #a3be8c;
    stroke-width: 2;
    fill: none;
    opacity: 0.7;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  .relation-marker {
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(30, 30, 46, 0.9);
  border: 1px solid #4c566a;
  border-radius: 8px;
  padding: 15px;
  color: #eceff4;
  font-size: 12px;
  z-index: 1000;
  min-width: 200px;

  h4 {
    margin: 0 0 10px 0;
    color: #88c0d0;
    font-size: 14px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
    gap: 8px;
  }

  .legend-color {
    width: 16px;
    height: 3px;
    border-radius: 2px;
  }

  .dependency { background: #bf616a; }
  .provision { background: #a3be8c; }
  .selected { background: #bf616a; }
  .highlighted { background: #81a1c1; }
  .default { background: #3b4252; }
`;

const Stats = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(30, 30, 46, 0.9);
  border: 1px solid #4c566a;
  border-radius: 8px;
  padding: 15px;
  color: #eceff4;
  font-size: 12px;
  z-index: 1000;
  min-width: 250px;

  h4 {
    margin: 0 0 10px 0;
    color: #88c0d0;
    font-size: 14px;
  }

  .stat-item {
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
  }

  .stat-value {
    color: #a3be8c;
    font-weight: bold;
  }
`;

// GeoJSON simplificado para países (você pode usar dados mais detalhados)
const getCountryGeoJSON = (countries: Country[]) => {
  return {
    type: 'FeatureCollection' as const,
    features: countries.map(country => ({
      type: 'Feature' as const,
      properties: {
        id: country.id,
        name: country.name,
        code: country.code
      },
      geometry: {
        type: 'Point' as const,
        coordinates: country.coordinates
      }
    }))
  };
};

// Componente para desenhar linhas de relação
const RelationLines: React.FC<{
  relations: DependencyRelation[];
  countries: Country[];
  selectedCountry: string | null;
}> = ({ relations, countries, selectedCountry }) => {
  const map = useMap();

  // Função para detectar se duas relações são bidirecionais
  const findBidirectionalRelations = (relations: DependencyRelation[]) => {
    const bidirectionalPairs = new Set<string>();
    const unidirectionalRelations: DependencyRelation[] = [];
    const bidirectionalGroups: { [key: string]: DependencyRelation[] } = {};

    relations.forEach(relation => {
      const pairKey1 = `${relation.fromCountry}-${relation.toCountry}`;
      const pairKey2 = `${relation.toCountry}-${relation.fromCountry}`;
      
      // Verificar se existe a relação reversa
      const reverseRelation = relations.find(r => 
        r.fromCountry === relation.toCountry && 
        r.toCountry === relation.fromCountry
      );

      if (reverseRelation && !bidirectionalPairs.has(pairKey1) && !bidirectionalPairs.has(pairKey2)) {
        // Marcar ambas as direções como processadas
        bidirectionalPairs.add(pairKey1);
        bidirectionalPairs.add(pairKey2);
        
        // Agrupar as duas relações
        const groupKey = [relation.fromCountry, relation.toCountry].sort().join('-');
        bidirectionalGroups[groupKey] = [relation, reverseRelation];
      } else if (!bidirectionalPairs.has(pairKey1)) {
        unidirectionalRelations.push(relation);
      }
    });

    return { bidirectionalGroups, unidirectionalRelations };
  };

  useEffect(() => {
    // Limpar linhas anteriores
    map.eachLayer((layer: any) => {
      if (layer.options && layer.options.className?.includes('relation-line')) {
        map.removeLayer(layer);
      }
    });

    // Se nenhum país selecionado, não desenhar linhas
    if (!selectedCountry) {
      console.log('Nenhum país selecionado');
      return;
    }

    // Filtrar relações baseadas no país selecionado
    const filteredRelations = relations.filter(r => 
      r.fromCountry === selectedCountry || r.toCountry === selectedCountry
    );

    console.log(`🗺️ País selecionado: ${selectedCountry}`);
    console.log(`📊 Total de relações disponíveis: ${relations.length}`);
    console.log(`🔍 Relações encontradas para ${selectedCountry}: ${filteredRelations.length}`);
    console.log('📋 Detalhes das relações:', filteredRelations);

    // Separar relações bidirecionais das unidirecionais
    const { bidirectionalGroups, unidirectionalRelations } = findBidirectionalRelations(filteredRelations);

    console.log('🔄 Relações bidirecionais:', Object.keys(bidirectionalGroups).length);
    console.log('➡️ Relações unidirecionais:', unidirectionalRelations.length);

    // Desenhar relações unidirecionais como linhas retas
    unidirectionalRelations.forEach((relation, index) => {
      const fromCountry = countries.find(c => c.id === relation.fromCountry);
      const toCountry = countries.find(c => c.id === relation.toCountry);

      console.log(`➡️ Relação unidirecional ${index + 1}: ${relation.fromCountry} → ${relation.toCountry}`);

      if (fromCountry && toCountry) {
        const line = window.L.polyline(
          [
            [fromCountry.coordinates[1], fromCountry.coordinates[0]],
            [toCountry.coordinates[1], toCountry.coordinates[0]]
          ],
          {
            className: `relation-line ${relation.type}-line unidirectional`,
            weight: Math.max(3, relation.intensity / 15),
            opacity: 0.8 + (relation.intensity / 500),
            color: relation.type === 'dependency' ? '#bf616a' : '#a3be8c'
          }
        );

        line.addTo(map);
        console.log(`✅ Linha reta adicionada: ${fromCountry.name} → ${toCountry.name}`);

        // Adicionar tooltip
        line.bindTooltip(
          `<strong>${fromCountry.name} → ${toCountry.name}</strong><br/>
           CDN: ${relation.cdnProvider}<br/>
           Classe: ${relation.contentClass}<br/>
           Intensidade: ${relation.intensity}%<br/>
           Protocolo: ${relation.protocol.type}`,
          { 
            permanent: false,
            direction: 'center',
            className: 'relation-tooltip'
          }
        );
      }
    });

    // Desenhar relações bidirecionais como arcos
    Object.entries(bidirectionalGroups).forEach(([, relationPair], groupIndex) => {
      const [relation1, relation2] = relationPair;
      const fromCountry = countries.find(c => c.id === relation1.fromCountry);
      const toCountry = countries.find(c => c.id === relation1.toCountry);

      console.log(`🔄 Relação bidirecional ${groupIndex + 1}: ${relation1.fromCountry} ↔ ${relation1.toCountry}`);

      if (fromCountry && toCountry) {
        // Coordenadas dos países
        const coord1 = [fromCountry.coordinates[1], fromCountry.coordinates[0]];
        const coord2 = [toCountry.coordinates[1], toCountry.coordinates[0]];

        // Calcular pontos intermediários para criar arcos curvos
        const midLat = (coord1[0] + coord2[0]) / 2;
        const midLng = (coord1[1] + coord2[1]) / 2;
        
        // Calcular deslocamento perpendicular para criar curvatura
        const distance = Math.sqrt(Math.pow(coord2[0] - coord1[0], 2) + Math.pow(coord2[1] - coord1[1], 2));
        const offset = Math.min(distance * 0.2, 5); // Limitar offset máximo
        
        // Calcular ângulo perpendicular
        const angle = Math.atan2(coord2[0] - coord1[0], coord2[1] - coord1[1]);
        
        // Pontos de controle para os dois arcos
        const controlPoint1 = [
          midLat + offset * Math.cos(angle),
          midLng - offset * Math.sin(angle)
        ];
        
        const controlPoint2 = [
          midLat - offset * Math.cos(angle),
          midLng + offset * Math.sin(angle)
        ];

        // Criar primeiro arco (usando polyline com pontos intermediários)
        const arcPoints1: [number, number][] = [];
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const t2 = t * t;
          const mt = 1 - t;
          const mt2 = mt * mt;
          
          // Curva quadrática de Bézier
          const lat = mt2 * coord1[0] + 2 * mt * t * controlPoint1[0] + t2 * coord2[0];
          const lng = mt2 * coord1[1] + 2 * mt * t * controlPoint1[1] + t2 * coord2[1];
          
          arcPoints1.push([lat, lng]);
        }

        // Criar segundo arco
        const arcPoints2: [number, number][] = [];
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const t2 = t * t;
          const mt = 1 - t;
          const mt2 = mt * mt;
          
          // Curva quadrática de Bézier (direção inversa)
          const lat = mt2 * coord2[0] + 2 * mt * t * controlPoint2[0] + t2 * coord1[0];
          const lng = mt2 * coord2[1] + 2 * mt * t * controlPoint2[1] + t2 * coord1[1];
          
          arcPoints2.push([lat, lng]);
        }

        // Desenhar primeiro arco
        const arc1 = window.L.polyline(arcPoints1, {
          className: `relation-line ${relation1.type}-arc bidirectional`,
          weight: Math.max(3, relation1.intensity / 15),
          opacity: 0.8 + (relation1.intensity / 500),
          color: relation1.type === 'dependency' ? '#bf616a' : '#a3be8c'
        });

        // Desenhar segundo arco
        const arc2 = window.L.polyline(arcPoints2, {
          className: `relation-line ${relation2.type}-arc bidirectional`,
          weight: Math.max(3, relation2.intensity / 15),
          opacity: 0.8 + (relation2.intensity / 500),
          color: relation2.type === 'dependency' ? '#bf616a' : '#a3be8c'
        });

        arc1.addTo(map);
        arc2.addTo(map);

        console.log(`✅ Arcos bidirecionais adicionados: ${fromCountry.name} ↔ ${toCountry.name}`);

        // Adicionar tooltips para os arcos
        arc1.bindTooltip(
          `<strong>${fromCountry.name} → ${toCountry.name}</strong><br/>
           CDN: ${relation1.cdnProvider}<br/>
           Classe: ${relation1.contentClass}<br/>
           Intensidade: ${relation1.intensity}%<br/>
           Tipo: ${relation1.type}`,
          { 
            permanent: false,
            direction: 'center',
            className: 'relation-tooltip'
          }
        );

        arc2.bindTooltip(
          `<strong>${toCountry.name} → ${fromCountry.name}</strong><br/>
           CDN: ${relation2.cdnProvider}<br/>
           Classe: ${relation2.contentClass}<br/>
           Intensidade: ${relation2.intensity}%<br/>
           Tipo: ${relation2.type}`,
          { 
            permanent: false,
            direction: 'center',
            className: 'relation-tooltip'
          }
        );
      }
    });

    const totalLines = unidirectionalRelations.length + Object.keys(bidirectionalGroups).length * 2;
    console.log(`🎉 Finalizado: ${totalLines} linhas/arcos processados`);
  }, [relations, countries, selectedCountry, map, findBidirectionalRelations]);

  return null;
};

export const WorldMap: React.FC<WorldMapProps> = ({
  countries,
  relations,
  filters,
  selectedCountry,
  onCountryClick
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Filtrar relações baseadas nos filtros ativos
  const filteredRelations = relations.filter(relation => {
    // Removido filtro de países - países são selecionados diretamente no mapa
    if (filters.cdns.length && !filters.cdns.includes(relation.cdnProvider)) {
      return false;
    }
    if (filters.protocols.length && !filters.protocols.includes(relation.protocol.type)) {
      return false;
    }
    if (filters.contentClasses.length && !filters.contentClasses.includes(relation.contentClass)) {
      return false;
    }
    if (relation.intensity < filters.intensityRange[0] || relation.intensity > filters.intensityRange[1]) {
      return false;
    }
    if (filters.relationType !== 'all' && relation.type !== filters.relationType) {
      return false;
    }
    return true;
  });

  console.log('🔧 FILTROS APLICADOS:', filters);
  console.log('🔧 Relações após filtros:', filteredRelations.length, 'de', relations.length);

  // Para as linhas de relação, usar as relações filtradas normalmente
  // Se um país estiver selecionado, filtrar adicionalmente para esse país
  const relationsForLines = selectedCountry 
    ? filteredRelations.filter(r => r.fromCountry === selectedCountry || r.toCountry === selectedCountry)
    : filteredRelations;

  console.log('🎯 RELAÇÕES PARA LINHAS:', relationsForLines.length);
  if (selectedCountry) {
    console.log(`🎯 País selecionado: ${selectedCountry}, suas relações:`, relationsForLines);
  }

  // Calcular estatísticas
  const stats = {
    totalRelations: filteredRelations.length,
    averageIntensity: filteredRelations.length > 0 
      ? Math.round(filteredRelations.reduce((sum, r) => sum + r.intensity, 0) / filteredRelations.length)
      : 0,
    dependencyCount: filteredRelations.filter(r => r.type === 'dependency').length,
    provisionCount: filteredRelations.filter(r => r.type === 'provision').length
  };

  const getCountryStyle = (countryId: string) => {
    if (countryId === selectedCountry) return 'country-selected';
    if (countryId === hoveredCountry) return 'country-highlighted';
    
    // Destacar países que têm relações ativas
    const hasActiveRelations = filteredRelations.some(r => 
      r.fromCountry === countryId || r.toCountry === countryId
    );
    
    return hasActiveRelations ? 'country-highlighted' : 'country-default';
  };

  const handleCountryFeature = (feature: any, layer: any) => {
    const countryId = feature.properties.id;
    
    layer.setStyle({
      className: getCountryStyle(countryId)
    });

    layer.on({
      click: () => {
        console.log('🔥 CLIQUE NO PAÍS! ID:', countryId);
        console.log('🔥 Nome do país:', feature.properties.name);
        
        const country = countries.find(c => c.id === countryId);
        if (country) {
          console.log('🌍 País encontrado nos dados:', country.name);
        } else {
          console.log('❌ País não encontrado nos dados com ID:', countryId);
          console.log('🔍 IDs disponíveis:', countries.map(c => c.id));
        }
        
        onCountryClick(countryId);
      },
      mouseover: () => {
        setHoveredCountry(countryId);
        layer.setStyle({ className: 'country-highlighted' });
      },
      mouseout: () => {
        setHoveredCountry(null);
        layer.setStyle({ className: getCountryStyle(countryId) });
      }
    });

    // Tooltip com informações do país
    const countryRelations = filteredRelations.filter(r => 
      r.fromCountry === countryId || r.toCountry === countryId
    );
    
    layer.bindTooltip(
      `<b>${feature.properties.name}</b><br/>
       Relações ativas: ${countryRelations.length}<br/>
       Dependências: ${countryRelations.filter(r => r.fromCountry === countryId).length}<br/>
       Provisões: ${countryRelations.filter(r => r.toCountry === countryId).length}`,
      { 
        permanent: false,
        direction: 'top',
        className: 'country-tooltip'
      }
    );
  };

  return (
    <MapWrapper>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        worldCopyJump={true}
        maxBounds={new LatLngBounds([-90, -180], [90, 180])}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        
        <GeoJSON
          data={getCountryGeoJSON(countries)}
          onEachFeature={handleCountryFeature}
          pointToLayer={(_feature, latlng) => {
            return window.L.circleMarker(latlng, {
              radius: 8,
              fillColor: '#81a1c1',
              color: '#88c0d0',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            });
          }}
        />

        <RelationLines
          relations={relationsForLines}
          countries={countries}
          selectedCountry={selectedCountry}
        />
      </MapContainer>

      <Stats>
        <h4>Estatísticas em Tempo Real</h4>
        <div className="stat-item">
          <span>Total de Relações:</span>
          <span className="stat-value">{stats.totalRelations}</span>
        </div>
        <div className="stat-item">
          <span>Intensidade Média:</span>
          <span className="stat-value">{stats.averageIntensity}%</span>
        </div>
        <div className="stat-item">
          <span>Dependências:</span>
          <span className="stat-value">{stats.dependencyCount}</span>
        </div>
        <div className="stat-item">
          <span>Provisões:</span>
          <span className="stat-value">{stats.provisionCount}</span>
        </div>
      </Stats>

      <Legend>
        <h4>Legenda</h4>
        <div className="legend-item">
          <div className="legend-color dependency"></div>
          <span>Linhas de Dependência</span>
        </div>
        <div className="legend-item">
          <div className="legend-color provision"></div>
          <span>Linhas de Provisão</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>País Selecionado</span>
        </div>
        <div className="legend-item">
          <div className="legend-color highlighted"></div>
          <span>País com Relações</span>
        </div>
        <div className="legend-item">
          <div className="legend-color default"></div>
          <span>País Padrão</span>
        </div>
      </Legend>
    </MapWrapper>
  );
};
