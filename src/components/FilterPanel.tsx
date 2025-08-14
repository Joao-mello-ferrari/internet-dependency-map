import React from 'react';
import styled from 'styled-components';
import type { FilterOptions, CDN, ContentClass } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  cdns: CDN[];
  contentClasses: ContentClass[];
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-350px'};
  width: 350px;
  height: 100vh;
  background: #2e3440;
  border-right: 1px solid #4c566a;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  transition: left 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
  color: #eceff4;
`;

const FilterToggle = styled.button<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: ${props => props.isOpen ? '350px' : '0'};
  transform: translateY(-50%);
  background: #5e81ac;
  border: none;
  color: white;
  padding: 15px 8px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1002;
  font-size: 18px;
  writing-mode: vertical-lr;
  text-orientation: mixed;

  &:hover {
    background: #81a1c1;
  }
`;

const FilterHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #4c566a;
  background: #3b4252;
  position: sticky;
  top: 0;
  z-index: 1002;

  h2 {
    margin: 0;
    color: #88c0d0;
    font-size: 18px;
  }

  .reset-btn {
    background: #bf616a;
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    
    &:hover {
      background: #d08770;
    }
  }
`;

const FilterContent = styled.div`
  padding: 20px;
`;

const FilterSection = styled.div`
  margin-bottom: 25px;

  h3 {
    color: #81a1c1;
    margin: 0 0 12px 0;
    font-size: 14px;
    border-bottom: 1px solid #4c566a;
    padding-bottom: 5px;
  }
`;

const MultiSelect = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #4c566a;
  border-radius: 6px;
  background: #3b4252;
`;

const SelectOption = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;

  &:hover {
    background: #434c5e;
  }

  input[type="checkbox"] {
    margin-right: 8px;
    accent-color: #5e81ac;
  }

  .option-count {
    margin-left: auto;
    color: #d8dee9;
    font-size: 11px;
    background: #4c566a;
    padding: 2px 6px;
    border-radius: 3px;
  }
`;

const RangeSlider = styled.div`
  .range-container {
    margin: 10px 0;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    color: #d8dee9;
    font-size: 12px;
    margin-bottom: 5px;
  }

  .range-input {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #4c566a;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
    accent-color: #5e81ac;

    &:hover {
      opacity: 1;
    }
  }

  .range-values {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    color: #a3be8c;
    font-size: 12px;
    font-weight: bold;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;

  input[type="radio"] {
    margin-right: 8px;
    accent-color: #5e81ac;
  }

  .radio-count {
    margin-left: auto;
    color: #d8dee9;
    font-size: 11px;
    background: #4c566a;
    padding: 2px 6px;
    border-radius: 3px;
  }
`;

const FilterSummary = styled.div`
  background: #3b4252;
  border: 1px solid #4c566a;
  border-radius: 6px;
  padding: 12px;
  margin-top: 15px;

  .summary-title {
    color: #81a1c1;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #d8dee9;
    margin: 3px 0;
  }

  .summary-value {
    color: #a3be8c;
    font-weight: bold;
  }
`;

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  cdns,
  contentClasses,
  onFiltersChange,
  isOpen,
  onToggle
}) => {
  // Removida função handleCountryChange

  const handleCDNChange = (cdnId: string, checked: boolean) => {
    const updatedCDNs = checked
      ? [...filters.cdns, cdnId]
      : filters.cdns.filter(id => id !== cdnId);
    
    onFiltersChange({ ...filters, cdns: updatedCDNs });
  };

  const handleContentClassChange = (classId: string, checked: boolean) => {
    const updatedClasses = checked
      ? [...filters.contentClasses, classId]
      : filters.contentClasses.filter(id => id !== classId);
    
    onFiltersChange({ ...filters, contentClasses: updatedClasses });
  };

  const handleIntensityRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.intensityRange];
    newRange[index] = value;
    onFiltersChange({ ...filters, intensityRange: newRange });
  };

  const handleRelationTypeChange = (type: 'all' | 'dependency' | 'provision') => {
    onFiltersChange({ ...filters, relationType: type });
  };

  const resetFilters = () => {
    onFiltersChange({
      cdns: [],
      protocols: [],
      contentClasses: [],
      intensityRange: [0, 100],
      relationType: 'all'
    });
  };

  // Calcular contadores para exibir nos filtros
  const activeFiltersCount = {
    cdns: filters.cdns.length,
    contentClasses: filters.contentClasses.length
  };

  return (
    <>
      <FilterToggle isOpen={isOpen} onClick={onToggle}>
        {isOpen ? '◀ Ocultar' : '▶ Filtros'}
      </FilterToggle>

      <FilterWrapper isOpen={isOpen}>
        <FilterHeader>
          <h2>Filtros Avançados</h2>
          <button className="reset-btn" onClick={resetFilters}>
            Limpar Todos os Filtros
          </button>
        </FilterHeader>

        <FilterContent>
          {/* Removida seção de filtro de países - países são selecionados diretamente no mapa */}

          <FilterSection>
            <h3>CDNs ({activeFiltersCount.cdns} selecionados)</h3>
            <MultiSelect>
              {cdns.map(cdn => (
                <SelectOption key={cdn.id}>
                  <input
                    type="checkbox"
                    checked={filters.cdns.includes(cdn.id)}
                    onChange={(e) => handleCDNChange(cdn.id, e.target.checked)}
                  />
                  {cdn.name}
                  <span className="option-count">{cdn.type}</span>
                </SelectOption>
              ))}
            </MultiSelect>
          </FilterSection>

          <FilterSection>
            <h3>Classes de Conteúdo ({activeFiltersCount.contentClasses} selecionadas)</h3>
            <MultiSelect>
              {contentClasses.map(contentClass => (
                <SelectOption key={contentClass.id}>
                  <input
                    type="checkbox"
                    checked={filters.contentClasses.includes(contentClass.id)}
                    onChange={(e) => handleContentClassChange(contentClass.id, e.target.checked)}
                  />
                  {contentClass.name}
                  <span className="option-count">{contentClass.category}</span>
                </SelectOption>
              ))}
            </MultiSelect>
          </FilterSection>

          <FilterSection>
            <h3>Intensidade da Relação</h3>
            <RangeSlider>
              <div className="range-container">
                <div className="range-labels">
                  <span>Mínima</span>
                  <span>Máxima</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.intensityRange[0]}
                  onChange={(e) => handleIntensityRangeChange(0, parseInt(e.target.value))}
                  className="range-input"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.intensityRange[1]}
                  onChange={(e) => handleIntensityRangeChange(1, parseInt(e.target.value))}
                  className="range-input"
                />
                <div className="range-values">
                  <span>{filters.intensityRange[0]}%</span>
                  <span>{filters.intensityRange[1]}%</span>
                </div>
              </div>
            </RangeSlider>
          </FilterSection>

          <FilterSection>
            <h3>Tipo de Relação</h3>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="relationType"
                  value="all"
                  checked={filters.relationType === 'all'}
                  onChange={() => handleRelationTypeChange('all')}
                />
                Todas as Relações
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="relationType"
                  value="dependency"
                  checked={filters.relationType === 'dependency'}
                  onChange={() => handleRelationTypeChange('dependency')}
                />
                Apenas Dependências
                <span className="radio-count">Vermelho</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="relationType"
                  value="provision"
                  checked={filters.relationType === 'provision'}
                  onChange={() => handleRelationTypeChange('provision')}
                />
                Apenas Provisões
                <span className="radio-count">Verde</span>
              </RadioOption>
            </RadioGroup>
          </FilterSection>

          <FilterSummary>
            <div className="summary-title">Resumo dos Filtros</div>
            {/* Removido resumo de países - países são selecionados diretamente no mapa */}
            <div className="summary-item">
              <span>CDNs:</span>
              <span className="summary-value">
                {activeFiltersCount.cdns || 'Todos'}
              </span>
            </div>
            <div className="summary-item">
              <span>Classes:</span>
              <span className="summary-value">
                {activeFiltersCount.contentClasses || 'Todas'}
              </span>
            </div>
            <div className="summary-item">
              <span>Intensidade:</span>
              <span className="summary-value">
                {filters.intensityRange[0]}% - {filters.intensityRange[1]}%
              </span>
            </div>
            <div className="summary-item">
              <span>Tipo:</span>
              <span className="summary-value">
                {filters.relationType === 'all' ? 'Todas' : 
                 filters.relationType === 'dependency' ? 'Dependências' : 'Provisões'}
              </span>
            </div>
          </FilterSummary>
        </FilterContent>
      </FilterWrapper>
    </>
  );
};
