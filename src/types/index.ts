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
  type: 'global' | 'regional' | 'local';
}

export interface Protocol {
  type: 'IPv4';
  version: string;
}

export interface ContentClass {
  id: string;
  name: string;
  category:
    | 'finance'
    | 'health'
    | 'entertainment'
    | 'education'
    | 'government'
    | 'commerce'
    | 'media'
    | 'social';
  description: string;
}

export interface DependencyRelation {
  id: string;
  originCountry: string; // Country that depends on the host
  hostCountry: string; // Country that hosts/provides the service
  cdnProvider: string;
  protocol: Protocol;
  contentClass: string;
  intensity: number; // 0-100, representing dependency strength
  latency?: number | null; // in ms
  bandwidth?: number | null; // in Mbps
  reliability?: number | null; // 0-100 percentage
}

export interface FilterOptions {
  cdns: string[];
  protocols: string[];
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
