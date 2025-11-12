import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SwitcherContainer>
      <LanguageButton
        active={i18n.language === "en"}
        onClick={() => changeLanguage("en")}
        title={t("language.en")}
      >
        EN
      </LanguageButton>
      <Separator>/</Separator>
      <LanguageButton
        active={i18n.language === "pt"}
        onClick={() => changeLanguage("pt")}
        title={t("language.pt")}
      >
        PT
      </LanguageButton>
    </SwitcherContainer>
  );
};

const SwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LanguageButton = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#5e81ac" : "transparent")};
  border: 1px solid ${(props) => (props.active ? "#5e81ac" : "#4c566a")};
  color: ${(props) => (props.active ? "#eceff4" : "#d8dee9")};
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? "#81a1c1" : "#3b4252")};
    border-color: #81a1c1;
    color: #eceff4;
  }
`;

const Separator = styled.span`
  color: #4c566a;
  font-size: 12px;
`;

export default LanguageSwitcher;
