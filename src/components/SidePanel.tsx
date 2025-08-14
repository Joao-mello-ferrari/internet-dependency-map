import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Country, DependencyRelation, CDN, ContentClass } from "../types";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface SidePanelProps {
  selectedCountry: string | null;
  countries: Country[];
  relations: DependencyRelation[];
  cdns: CDN[];
  contentClasses: ContentClass[];
  onClose: () => void;
}

const PanelWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-400px")};
  width: 400px;
  height: 100vh;
  background: #2e3440;
  border-left: 1px solid #4c566a;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
  color: #eceff4;
`;

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #4c566a;
  background: #3b4252;
  position: sticky;
  top: 0;
  z-index: 1002;

  h2 {
    margin: 0;
    color: #88c0d0;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    background: none;
    border: none;
    color: #d8dee9;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background: #4c566a;
      color: #eceff4;
    }
  }
`;

const PanelContent = styled.div`
  padding: 0;
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid #434c5e;

  h3 {
    margin: 0 0 16px 0;
    color: #81a1c1;
    font-size: 16px;
    border-bottom: 1px solid #4c566a;
    padding-bottom: 8px;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background: #3b4252;
  border-radius: 6px;
  padding: 12px;
  text-align: center;

  .label {
    font-size: 12px;
    color: #81a1c1;
    margin-bottom: 4px;
  }

  .value {
    font-size: 24px;
    font-weight: bold;
    color: #a3be8c;
  }

  &.dependency .value {
    color: #bf616a;
  }

  &.provision .value {
    color: #a3be8c;
  }

  &.intensity .value {
    color: #ebcb8b;
  }
`;

const ColorLegend = styled.div`
  background: #3b4252;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  h4 {
    margin: 0 0 12px 0;
    color: #88c0d0;
    font-size: 14px;
    text-align: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;

    .color-indicator {
      width: 20px;
      height: 3px;
      border-radius: 2px;
      margin-right: 8px;
    }

    &.dependency .color-indicator {
      background: #bf616a;
    }

    &.provision .color-indicator {
      background: #a3be8c;
    }
  }

  .intensity-spectrum {
    margin-top: 12px;

    .spectrum-label {
      font-size: 11px;
      color: #d8dee9;
      margin-bottom: 6px;
      text-align: center;
    }

    .spectrum-bar {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(
        to right,
        rgba(163, 190, 140, 1) 0%,
        rgba(235, 203, 139, 1) 50%,
        rgba(191, 97, 106, 1) 100%
      );
      position: relative;
      margin-bottom: 4px;
    }

    .spectrum-labels {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #81a1c1;
    }
  }
`;

const RelationsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const RelationItem = styled.div`
  background: #3b4252;
  border: 1px solid #4c566a;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  transition: background 0.2s;

  &:hover {
    background: #434c5e;
  }

  .relation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .relation-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
  }

  .relation-type.dependency {
    background: #bf616a;
    color: #fff;
  }

  .relation-type.provision {
    background: #a3be8c;
    color: #fff;
  }

  .relation-details {
    font-size: 12px;
    color: #d8dee9;

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
    }
  }
`;

const ChartContainer = styled.div`
  .chart-wrapper {
    background: #3b4252;
    border-radius: 8px;
    padding: 16px;
  }
`;

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedCountry,
  countries,
  relations,
  cdns,
  contentClasses,
  onClose,
}) => {
  if (!selectedCountry) return null;

  const country = countries.find((c) => c.id === selectedCountry);
  const countryRelations = relations.filter(
    (r) => r.fromCountry === selectedCountry || r.toCountry === selectedCountry
  );

  const dependencies = countryRelations.filter(
    (r) => r.fromCountry === selectedCountry && r.type === "dependency"
  );
  const provisions = countryRelations.filter(
    (r) => r.toCountry === selectedCountry && r.type === "provision"
  );

  const avgIntensity =
    countryRelations.length > 0
      ? Math.round(
          countryRelations.reduce((sum, r) => sum + r.intensity, 0) /
            countryRelations.length
        )
      : 0;

  // Dados para gráfico de classes de conteúdo
  const contentClassCounts = contentClasses.reduce((acc, contentClass) => {
    const count = countryRelations.filter(
      (r) => r.contentClass === contentClass.id
    ).length;
    acc[contentClass.name] = count;
    return acc;
  }, {} as Record<string, number>);

  const contentClassData = {
    labels: Object.keys(contentClassCounts),
    datasets: [
      {
        label: "Relações por Classe",
        data: Object.values(contentClassCounts),
        backgroundColor: [
          "#bf616a",
          "#d08770",
          "#ebcb8b",
          "#a3be8c",
          "#88c0d0",
          "#81a1c1",
          "#b48ead",
          "#5e81ac",
        ],
        borderColor: "#4c566a",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#d8dee9",
          font: { size: 10 },
        },
        grid: {
          color: "#4c566a",
        },
      },
      x: {
        ticks: {
          color: "#d8dee9",
          font: { size: 10 },
          maxRotation: 45,
        },
        grid: {
          color: "#4c566a",
        },
      },
    },
  };

  return (
    <PanelWrapper isOpen={!!selectedCountry}>
      <PanelHeader>
        <h2>
          {country?.name || selectedCountry}
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </h2>
      </PanelHeader>

      <PanelContent>
        <Section>
          <h3>Estatísticas</h3>
          <StatGrid>
            <StatCard className="dependency">
              <div className="label">Dependências</div>
              <div className="value">{dependencies.length}</div>
            </StatCard>
            <StatCard className="provision">
              <div className="label">Provisões</div>
              <div className="value">{provisions.length}</div>
            </StatCard>
            <StatCard>
              <div className="label">Total</div>
              <div className="value">{countryRelations.length}</div>
            </StatCard>
            <StatCard className="intensity">
              <div className="label">Intensidade Média</div>
              <div className="value">{avgIntensity}%</div>
            </StatCard>
          </StatGrid>

          <ColorLegend>
            <h4>Legenda de Cores</h4>
            <div className="legend-item dependency">
              <div className="color-indicator"></div>
              <span>Dependência (vermelho)</span>
            </div>
            <div className="legend-item provision">
              <div className="color-indicator"></div>
              <span>Provisão (verde)</span>
            </div>
            <div className="intensity-spectrum">
              <div className="spectrum-label">Intensidade das Relações</div>
              <div className="spectrum-bar"></div>
              <div className="spectrum-labels">
                <span>Baixa (0%)</span>
                <span>Alta (100%)</span>
              </div>
            </div>
          </ColorLegend>
        </Section>

        <Section>
          <h3>Classes de Conteúdo</h3>
          <ChartContainer>
            <div className="chart-wrapper">
              <div style={{ height: "200px" }}>
                <Bar data={contentClassData} options={chartOptions} />
              </div>
            </div>
          </ChartContainer>
        </Section>

        <Section>
          <h3>Relações Detalhadas</h3>
          <RelationsList>
            {countryRelations.length === 0 ? (
              <p
                style={{
                  color: "#d8dee9",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Nenhuma relação encontrada para este país
              </p>
            ) : (
              countryRelations.map((relation, index) => (
                <RelationItem
                  key={`${relation.fromCountry}-${relation.toCountry}-${index}`}
                >
                  <div className="relation-header">
                    <strong>
                      {
                        countries.find((c) => c.id === relation.fromCountry)
                          ?.name
                      }{" "}
                      →{" "}
                      {countries.find((c) => c.id === relation.toCountry)?.name}
                    </strong>
                    <span className={`relation-type ${relation.type}`}>
                      {relation.type === "dependency"
                        ? "Dependência"
                        : "Provisão"}
                    </span>
                  </div>
                  <div className="relation-details">
                    <div className="detail-row">
                      <span>CDN:</span>
                      <span>
                        {cdns.find((cdn) => cdn.id === relation.cdnProvider)
                          ?.name || relation.cdnProvider}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Classe:</span>
                      <span>
                        {contentClasses.find(
                          (cc) => cc.id === relation.contentClass
                        )?.name || relation.contentClass}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Intensidade:</span>
                      <span
                        style={{
                          color:
                            relation.intensity > 70
                              ? "#bf616a"
                              : relation.intensity > 40
                              ? "#ebcb8b"
                              : "#a3be8c",
                        }}
                      >
                        {relation.intensity}%
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Protocolo:</span>
                      <span>{relation.protocol.type}</span>
                    </div>
                  </div>
                </RelationItem>
              ))
            )}
          </RelationsList>
        </Section>
      </PanelContent>
    </PanelWrapper>
  );
};

export default SidePanel;
