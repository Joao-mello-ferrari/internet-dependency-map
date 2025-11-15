import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
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
import { useTranslatedData } from "../hooks/useTranslatedData";
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
  top: 80px;
  right: ${(props) => (props.isOpen ? "0" : "-400px")};
  width: 400px;
  height: calc(100vh - 80px);
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
  position: relative;

  .label {
    font-size: 12px;
    color: #81a1c1;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .info-icon {
    cursor: help;
    color: #88c0d0;
    font-size: 14px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #88c0d0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;

    &:hover {
      background: #88c0d0;
      color: #2e3440;
    }
  }

  .tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 100%;
    right: 10px;
    background: #3b4252;
    color: #eceff4;
    padding: 12px;
    border-radius: 6px;
    font-size: 11px;
    line-height: 1.5;
    width: 280px;
    margin-bottom: 8px;
    border: 1px solid #4c566a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 1003;
    transition: opacity 0.2s, visibility 0.2s;
    text-align: left;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      right: 20px;
      border: 6px solid transparent;
      border-top-color: #4c566a;
    }
  }

  .info-icon:hover + .tooltip,
  .tooltip:hover {
    visibility: visible;
    opacity: 1;
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
  countries: _countries,
  relations,
  cdns,
  contentClasses,
  onClose,
}) => {
  const { t } = useTranslation();
  const { getContentClassName } = useTranslatedData();

  if (!selectedCountry) return null;

  const countryRelations = relations.filter(
    (r) =>
      r.originCountry === selectedCountry || r.hostCountry === selectedCountry
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
    const translatedName = getContentClassName(contentClass.id);
    acc[translatedName] = count;
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
          {t(`countries.${selectedCountry}`)}
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </h2>
      </PanelHeader>

      <PanelContent>
        <Section>
          <h3>{t("sidePanel.overview")}</h3>
          <StatGrid>
            {/* <StatCard className="dependency">
              <div className="label">{t("sidePanel.dependencies")}</div>
              <div className="value">{dependencies.length}</div>
            </StatCard>
            <StatCard className="provision">
              <div className="label">{t("sidePanel.provisions")}</div>
              <div className="value">{provisions.length}</div>
            </StatCard> */}
            <StatCard>
              <div className="label">
                {t("sidePanel.totalVisibleRelations")}
              </div>
              <div className="value">{countryRelations.length}</div>
            </StatCard>
            <StatCard className="intensity">
              <div className="label">
                {t("sidePanel.criticalityLevel")}
                <span className="info-icon">i</span>
                <div className="tooltip">{t("sidePanel.intensityTooltip")}</div>
              </div>
              <div className="value">{avgIntensity}%</div>
            </StatCard>
          </StatGrid>

          <ColorLegend>
            <h4>{t("sidePanel.colorLegend")}</h4>
            <div className="legend-item dependency">
              <div className="color-indicator"></div>
              <span>{t("sidePanel.moreIntense")}</span>
            </div>
            <div className="legend-item provision">
              <div className="color-indicator"></div>
              <span>{t("sidePanel.lessIntense")}</span>
            </div>
            <div className="intensity-spectrum">
              <div className="spectrum-label">{t("map.criticality")}</div>
              <div className="spectrum-bar"></div>
              <div className="spectrum-labels">
                <span>{t("filters.low")} (0%)</span>
                <span>{t("filters.critical")} (100%)</span>
              </div>
            </div>
          </ColorLegend>
        </Section>

        <Section>
          <h3>{t("sidePanel.contentClassDistribution")}</h3>
          <ChartContainer>
            <div className="chart-wrapper">
              <div style={{ height: "200px" }}>
                <Bar data={contentClassData} options={chartOptions} />
              </div>
            </div>
          </ChartContainer>
        </Section>

        <Section>
          <h3>{t("sidePanel.detailedRelations")}</h3>
          <RelationsList>
            {countryRelations.length === 0 ? (
              <p
                style={{
                  color: "#d8dee9",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                {t("sidePanel.noDependencies")}
              </p>
            ) : (
              countryRelations.map((relation, index) => {
                const isOutgoing = relation.originCountry === selectedCountry;
                const otherCountry = isOutgoing
                  ? relation.hostCountry
                  : relation.originCountry;
                const otherCountryName = t(`countries.${otherCountry}`);
                const currentCountryName = t(`countries.${selectedCountry}`);

                return (
                  <RelationItem
                    key={`${relation.originCountry}-${relation.hostCountry}-${index}`}
                  >
                    <div className="relation-header">
                      <strong>
                        {isOutgoing
                          ? `${currentCountryName} → ${otherCountryName}`
                          : `${otherCountryName} → ${currentCountryName}`}
                      </strong>
                      <span className={`relation-type dependency`}>
                        {isOutgoing
                          ? t("sidePanel.dependsOnRelation")
                          : t("sidePanel.receivesDependency")}
                      </span>
                    </div>
                    <div className="relation-details">
                      <div className="detail-row">
                        <span>{t("sidePanel.cdnLabel")}</span>
                        <span>
                          {cdns.find((cdn) => cdn.id === relation.cdnProvider)
                            ?.name || relation.cdnProvider}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>{t("sidePanel.classLabel")}</span>
                        <span>
                          {t(`contentClassCategories.${relation.contentClass}`)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>{t("sidePanel.criticalityLabel")}</span>
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
                        <span>{t("sidePanel.protocolLabel")}</span>
                        <span>{relation.protocol.type}</span>
                      </div>
                    </div>
                  </RelationItem>
                );
              })
            )}
          </RelationsList>
        </Section>
      </PanelContent>
    </PanelWrapper>
  );
};

export default SidePanel;
