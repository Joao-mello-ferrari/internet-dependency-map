import { useTranslation } from 'react-i18next';

/**
 * Custom hook to get translated names for countries and content classes
 */
export const useTranslatedData = () => {
  const { t } = useTranslation();

  /**
   * Get translated country name by country code
   */
  const getCountryName = (countryCode: string): string => {
    return t(`countries.${countryCode}`, countryCode);
  };

  /**
   * Get translated content class name by category
   */
  const getContentClassName = (category: string): string => {
    return t(`contentClassCategories.${category}`, category);
  };

  return {
    getCountryName,
    getContentClassName
  };
};
