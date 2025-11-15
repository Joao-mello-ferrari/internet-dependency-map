import { LatLngBounds } from 'leaflet';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import styled from 'styled-components';

import { useTranslatedData } from '../hooks/useTranslatedData';
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
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  .relation-marker {
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// const Legend = styled.div`
//   position: absolute;
//   bottom: 100px;
//   left: 20px;
//   background: rgba(30, 30, 46, 0.9);
//   border: 1px solid #4c566a;
//   border-radius: 8px;
//   padding: 15px;
//   color: #eceff4;
//   font-size: 12px;
//   z-index: 1000;
//   min-width: 200px;

//   h4 {
//     margin: 0 0 10px 0;
//     color: #88c0d0;
//     font-size: 14px;
//   }

//   .legend-item {
//     display: flex;
//     align-items: center;
//     margin: 5px 0;
//     gap: 8px;
//   }

//   .legend-color {
//     width: 16px;
//     height: 3px;
//     border-radius: 2px;
//   }

//   .dependency {
//     background: #bf616a;
//   }
//   .provision {
//     background: #a3be8c;
//   }
//   .selected {
//     background: #bf616a;
//   }
//   .highlighted {
//     background: #81a1c1;
//   }
//   .default {
//     background: #3b4252;
//   }
// `;

// const Stats = styled.div`
//   position: absolute;
//   top: 20px;
//   left: 20px;
//   background: rgba(30, 30, 46, 0.9);
//   border: 1px solid #4c566a;
//   border-radius: 8px;
//   padding: 15px;
//   color: #eceff4;
//   font-size: 12px;
//   z-index: 1000;
//   min-width: 250px;

//   h4 {
//     margin: 0 0 10px 0;
//     color: #88c0d0;
//     font-size: 14px;
//   }

//   .stat-item {
//     margin: 5px 0;
//     display: flex;
//     justify-content: space-between;
//   }

//   .stat-value {
//     color: #a3be8c;
//     font-weight: bold;
//   }
// `;

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

// Função para calcular cor baseada na intensidade (0-100)
// 0-33: verde → amarelo
// 34-66: amarelo → laranja
// 67-100: laranja → vermelho
const getIntensityColor = (intensity: number): string => {
  // Normalizar intensidade para 0-1
  const normalized = Math.max(0, Math.min(100, intensity)) / 100;

  let r: number, g: number, b: number;

  if (normalized < 0.33) {
    // Verde (#a3be8c) → Amarelo (#ebcb8b)
    const t = normalized / 0.33;
    r = Math.round(163 + (235 - 163) * t);
    g = Math.round(190 + (203 - 190) * t);
    b = Math.round(140 + (139 - 140) * t);
  } else if (normalized < 0.67) {
    // Amarelo (#ebcb8b) → Laranja (#d08770)
    const t = (normalized - 0.33) / 0.34;
    r = Math.round(235 + (208 - 235) * t);
    g = Math.round(203 + (135 - 203) * t);
    b = Math.round(139 + (112 - 139) * t);
  } else {
    // Laranja (#d08770) → Vermelho (#bf616a)
    const t = (normalized - 0.67) / 0.33;
    r = Math.round(208 + (191 - 208) * t);
    g = Math.round(135 + (97 - 135) * t);
    b = Math.round(112 + (106 - 112) * t);
  }

  // Converter para hex
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Componente para desenhar linhas de relação
const RelationLines: React.FC<{
  relations: DependencyRelation[];
  countries: Country[];
  selectedCountry: string | null;
}> = ({ relations, countries, selectedCountry }) => {
  const map = useMap();
  const { getCountryName, getContentClassName } = useTranslatedData();

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

    // Filter relations based on selected country (origin or host)
    const filteredRelations = relations.filter(
      r =>
        r.originCountry === selectedCountry || r.hostCountry === selectedCountry
    );

    console.log(`🗺️ País selecionado: ${selectedCountry}`);
    console.log(`📊 Total de relações disponíveis: ${relations.length}`);
    console.log(
      `🔍 Relações encontradas para ${selectedCountry}: ${filteredRelations.length}`
    );
    console.log('📋 Detalhes das relações:', filteredRelations);

    // Group relations by country pair (considering BOTH directions)
    // To avoid duplication, always use alphabetical order of IDs
    const relationsByPair: { [key: string]: DependencyRelation[] } = {};

    filteredRelations.forEach(relation => {
      // Create unique key based on alphabetical order of countries
      const [country1, country2] = [
        relation.originCountry,
        relation.hostCountry
      ].sort();
      const pairKey = `${country1}-${country2}`;

      if (!relationsByPair[pairKey]) {
        relationsByPair[pairKey] = [];
      }
      relationsByPair[pairKey].push(relation);
    });

    console.log(
      '📦 Relações agrupadas por par (ambas direções):',
      relationsByPair
    );

    // Função auxiliar para criar arcos com diferentes offsets
    const createArc = (
      coord1: [number, number],
      coord2: [number, number],
      offsetMultiplier: number
    ): [number, number][] => {
      const midLat = (coord1[0] + coord2[0]) / 2;
      const midLng = (coord1[1] + coord2[1]) / 2;

      const distance = Math.sqrt(
        Math.pow(coord2[0] - coord1[0], 2) + Math.pow(coord2[1] - coord1[1], 2)
      );

      // Calcular offset base e ajustar baseado no multiplicador
      const baseOffset = Math.min(distance * 0.2, 5);
      const offset = baseOffset * offsetMultiplier;

      const angle = Math.atan2(coord2[0] - coord1[0], coord2[1] - coord1[1]);

      const controlPoint = [
        midLat + offset * Math.cos(angle),
        midLng - offset * Math.sin(angle)
      ];

      const arcPoints: [number, number][] = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const t2 = t * t;
        const mt = 1 - t;
        const mt2 = mt * mt;

        const lat =
          mt2 * coord1[0] + 2 * mt * t * controlPoint[0] + t2 * coord2[0];
        const lng =
          mt2 * coord1[1] + 2 * mt * t * controlPoint[1] + t2 * coord2[1];

        arcPoints.push([lat, lng]);
      }

      return arcPoints;
    };

    // Desenhar todas as relações como arcos
    let totalArcsDrawn = 0;

    Object.entries(relationsByPair).forEach(([pairKey, relationsInPair]) => {
      // pairKey is in alphabetical order, so we need to determine the actual countries
      const [id1, id2] = pairKey.split('-');
      const country1 = countries.find(c => c.id === id1);
      const country2 = countries.find(c => c.id === id2);

      if (!country1 || !country2) return;

      // Sort relations by origin country and CDN provider
      const sortedRelations = [...relationsInPair].sort((a, b) => {
        if (a.originCountry !== b.originCountry) {
          return a.originCountry.localeCompare(b.originCountry);
        }
        return a.cdnProvider.localeCompare(b.cdnProvider);
      });

      const numRelations = sortedRelations.length;

      console.log(
        `🔗 Par ${id1} ↔ ${id2}: ${numRelations} relação(ões) total`
      );
      console.log(
        `   Detalhes (ordenado):`,
        sortedRelations.map(
          (r, i) =>
            `[${i}] ${r.originCountry}→${r.hostCountry} (CDN: ${r.cdnProvider})`
        )
      );

      // Calculate offsets to distribute ALL relations symmetrically
      sortedRelations.forEach((relation, index) => {
        // Determine the direction of current relation (origin → host)
        const originCountry = countries.find(
          c => c.id === relation.originCountry
        );
        const hostCountry = countries.find(c => c.id === relation.hostCountry);

        if (!originCountry || !hostCountry) return;

        const coord1: [number, number] = [
          originCountry.coordinates[1],
          originCountry.coordinates[0]
        ];
        const coord2: [number, number] = [
          hostCountry.coordinates[1],
          hostCountry.coordinates[0]
        ];

        // For 1 arc: offset = 0 (center line or slightly curved)
        // For 2+ arcs: distribute all symmetrically
        let offsetMultiplier: number;
        if (numRelations === 1) {
          offsetMultiplier = 0.3; // Slight curve to distinguish from straight line
        } else {
          const step = 1;
          const startOffset = (-(numRelations - 1) * step) / 2;
          offsetMultiplier = startOffset + index * step;
        }

        const arcPoints = createArc(coord1, coord2, offsetMultiplier);

        const arc = window.L.polyline(arcPoints, {
          className: `relation-line dependency-arc multi-relation`,
          weight: 3,
          opacity: 0.8,
          color: getIntensityColor(relation.intensity)
        });

        arc.addTo(map);
        totalArcsDrawn++;

        console.log(
          `✅ Arco ${index + 1}/${numRelations} adicionado: ${
            originCountry.name
          } → ${hostCountry.name} (CDN: ${
            relation.cdnProvider
          }, offset: ${offsetMultiplier.toFixed(1)})`
        );

        // Add tooltip
        const originCountryName = getCountryName(originCountry.code);
        const hostCountryName = getCountryName(hostCountry.code);
        const contentClassName = getContentClassName(relation.contentClass);

        arc.bindTooltip(
          `<strong>${originCountryName} ← ${hostCountryName}</strong><br/>
           CDN: ${relation.cdnProvider}<br/>
           Class: ${contentClassName}<br/>
           Intensity: ${relation.intensity}%<br/>`,
          {
            permanent: false,
            direction: 'center',
            className: 'relation-tooltip'
          }
        );
      });
    });

    console.log(`🎉 Finalizado: ${totalArcsDrawn} arcos processados`);
  }, [
    relations,
    countries,
    selectedCountry,
    map,
    getContentClassName,
    getCountryName
  ]);

  return null;
};

export const WorldMap: React.FC<WorldMapProps> = ({
  countries,
  relations,
  filters,
  selectedCountry,
  onCountryClick
}) => {
  const { t, i18n } = useTranslation();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Filtrar relações baseadas nos filtros ativos
  const filteredRelations = relations.filter(relation => {
    if (filters.relationType === 'dependency') {
      // Show only relations where selected country is the origin (depends on others)
      if (relation.originCountry !== selectedCountry) {
        return false;
      }
    }
    if (filters.relationType === 'provision') {
      // Show only relations where selected country is the origin (depends on others)
      if (relation.hostCountry !== selectedCountry) {
        return false;
      }
    }

    // Removido filtro de países - países são selecionados diretamente no mapa
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
    return true;
  });

  console.log('🔧 FILTROS APLICADOS:', filters);
  console.log(
    '🔧 Relações após filtros:',
    filteredRelations.length,
    'de',
    relations.length
  );

  // For relation lines, use filtered relations normally
  // If a country is selected, filter additionally for that country
  const relationsForLines = selectedCountry
    ? filteredRelations.filter(
        r =>
          r.originCountry === selectedCountry ||
          r.hostCountry === selectedCountry
      )
    : filteredRelations;

  console.log('🎯 RELAÇÕES PARA LINHAS:', relationsForLines.length);
  if (selectedCountry) {
    console.log(
      `🎯 País selecionado: ${selectedCountry}, suas relações:`,
      relationsForLines
    );
  }

  // Calculate statistics
  // const stats = {
  //   totalRelations: filteredRelations.length,
  //   averageIntensity:
  //     filteredRelations.length > 0
  //       ? Math.round(
  //           filteredRelations.reduce((sum, r) => sum + r.intensity, 0) /
  //             filteredRelations.length
  //         )
  //       : 0,
  //   dependencyCount: filteredRelations.filter((r) => r.type === "dependency")
  //     .length,
  //   provisionCount: filteredRelations.filter((r) => r.type === "provision")
  //     .length,
  // };

  const getCountryStyle = (countryId: string) => {
    if (countryId === selectedCountry) return 'country-selected';
    if (countryId === hoveredCountry) return 'country-highlighted';

    // Highlight countries that have active relations
    const hasActiveRelations = filteredRelations.some(
      r => r.originCountry === countryId || r.hostCountry === countryId
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
          console.log(
            '🔍 IDs disponíveis:',
            countries.map(c => c.id)
          );
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

    // Tooltip with country information
    const countryRelations = filteredRelations.filter(
      r => r.originCountry === countryId || r.hostCountry === countryId
    );

    const countryName = t(`countries.${countryId}`);
    const countryCode = feature.properties.code;

    layer.bindTooltip(
      `<b>${countryName} (${countryCode})</b><br/>
       ${t('map.activeRelations')}: ${countryRelations.length}<br/>
       ${t('map.dependenciesOrigin')}: ${
         countryRelations.filter(r => r.originCountry === countryId).length
       }<br/>
       ${t('map.provisionsHost')}: ${
         countryRelations.filter(r => r.hostCountry === countryId).length
       }`,
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
          key={i18n.language}
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

      {/* <Stats>
        <h4>{t("map.stats.title")}</h4>
        <div className="stat-item">
          <span>{t("map.stats.totalRelations")}</span>
          <span className="stat-value">{stats.totalRelations}</span>
        </div>
        <div className="stat-item">
          <span>{t("map.stats.averageIntensity")}</span>
          <span className="stat-value">{stats.averageIntensity}%</span>
        </div>
        <div className="stat-item">
          <span>{t("map.stats.dependencies")}</span>
          <span className="stat-value">{stats.dependencyCount}</span>
        </div>
        <div className="stat-item">
          <span>{t("map.stats.provisions")}</span>
          <span className="stat-value">{stats.provisionCount}</span>
        </div>
      </Stats> */}

      {/* <Legend>
        <h4>{t("map.legend")}</h4>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{
              background:
                "linear-gradient(to right, #a3be8c, #ebcb8b, #d08770, #bf616a)",
              width: "80px",
            }}
          ></div>
          <span>{t("map.intensityGradient")}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>{t("map.selectedCountry")}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color highlighted"></div>
          <span>{t("map.relatedCountry")}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color default"></div>
          <span>{t("map.defaultCountry")}</span>
        </div>
      </Legend> */}
    </MapWrapper>
  );
};
