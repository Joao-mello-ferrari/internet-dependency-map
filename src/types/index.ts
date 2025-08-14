// Tipos principais da aplicação

export interface Country {
  id: string;
  name: string;
  code: string; // ISO country code
  coordinates: [number, number]; // [longitude, latitude]
  region: string;
}

export interface CDN {
  id: string;
  name: string;
  provider: string;
  coverage: string[]; // country codes
  type: 'global' | 'regional' | 'local';
}

export interface Protocol {
  type: 'IPv4';
  version: string;
}

export interface ContentClass {
  id: string;
  name: string;
  category: 'finance' | 'health' | 'entertainment' | 'education' | 'government' | 'commerce' | 'media' | 'social';
  description: string;
}

export interface DependencyRelation {
  id: string;
  fromCountry: string;
  toCountry: string;
  cdnProvider: string;
  protocol: Protocol;
  contentClass: string;
  intensity: number; // 0-100, representing dependency strength
  type: 'dependency' | 'provision';
  latency?: number; // in ms
  bandwidth?: number; // in Mbps
  reliability?: number; // 0-100 percentage
}

export interface FilterOptions {
  cdns: string[];
  protocols: ('IPv4')[];
  contentClasses: string[];
  intensityRange: [number, number];
  relationType: 'all' | 'dependency' | 'provision';
}

export interface MapData {
  countries: Country[];
  cdns: CDN[];
  contentClasses: ContentClass[];
  relations: DependencyRelation[];
}

export interface AnalyticsData {
  totalRelations: number;
  averageIntensity: number;
  protocolDistribution: Record<string, number>;
  contentClassDistribution: Record<string, number>;
  topDependentCountries: Array<{ country: string; dependencyCount: number }>;
  topProviderCountries: Array<{ country: string; provisionCount: number }>;
}
