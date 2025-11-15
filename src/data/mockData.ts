import type {
  Country,
  CDN,
  ContentClass,
  DependencyRelation,
  MapData
} from '../types';

import { relations } from './relations';

// Dados mockados de países principais
export const mockCountries: Country[] = [
  {
    id: 'AR',
    name: 'AR',
    code: 'AR',
    coordinates: [-63.6167, -38.4161],
    region: 'South America'
  },
  {
    id: 'AU',
    name: 'AU',
    code: 'AU',
    coordinates: [133.7751, -25.2744],
    region: 'Oceania'
  },
  {
    id: 'BR',
    name: 'BR',
    code: 'BR',
    coordinates: [-47.9292, -15.7801],
    region: 'South America'
  },
  {
    id: 'CA',
    name: 'CA',
    code: 'CA',
    coordinates: [-106.3468, 56.1304],
    region: 'North America'
  },
  {
    id: 'JP',
    name: 'JP',
    code: 'JP',
    coordinates: [138.2529, 36.2048],
    region: 'Asia'
  },
  {
    id: 'CO',
    name: 'CO',
    code: 'CO',
    coordinates: [-74.2973, 4.5709],
    region: 'South America'
  },
  {
    id: 'CR',
    name: 'CR',
    code: 'CR',
    coordinates: [-84.0907, 9.7489],
    region: 'Central America'
  },
  {
    id: 'DE',
    name: 'DE',
    code: 'DE',
    coordinates: [10.4515, 51.1657],
    region: 'Europe'
  },
  {
    id: 'DO',
    name: 'DO',
    code: 'DO',
    coordinates: [-70.1627, 18.7357],
    region: 'Caribbean'
  },
  {
    id: 'EG',
    name: 'EG',
    code: 'EG',
    coordinates: [30.8025, 26.8206],
    region: 'Africa'
  },
  {
    id: 'ES',
    name: 'ES',
    code: 'ES',
    coordinates: [-3.7492, 40.4637],
    region: 'Europe'
  },
  {
    id: 'FR',
    name: 'FR',
    code: 'FR',
    coordinates: [2.2137, 46.2276],
    region: 'Europe'
  },
  {
    id: 'GB',
    name: 'GB',
    code: 'GB',
    coordinates: [-3.436, 55.3781],
    region: 'Europe'
  },
  {
    id: 'GT',
    name: 'GT',
    code: 'GT',
    coordinates: [-90.2308, 15.7835],
    region: 'Central America'
  },
  {
    id: 'ID',
    name: 'ID',
    code: 'ID',
    coordinates: [113.9213, -0.7893],
    region: 'Asia'
  },
  {
    id: 'IN',
    name: 'IN',
    code: 'IN',
    coordinates: [78.9629, 20.5937],
    region: 'Asia'
  },
  {
    id: 'MX',
    name: 'MX',
    code: 'MX',
    coordinates: [-102.5528, 23.6345],
    region: 'North America'
  },
  {
    id: 'NG',
    name: 'NG',
    code: 'NG',
    coordinates: [8.6753, 9.082],
    region: 'Africa'
  },
  {
    id: 'NZ',
    name: 'NZ',
    code: 'NZ',
    coordinates: [174.886, -40.9006],
    region: 'Oceania'
  },
  {
    id: 'PG',
    name: 'PG',
    code: 'PG',
    coordinates: [143.9555, -6.315],
    region: 'Oceania'
  },
  {
    id: 'IT',
    name: 'IT',
    code: 'IT',
    coordinates: [12.5674, 41.8719],
    region: 'Europe'
  },
  {
    id: 'US',
    name: 'US',
    code: 'US',
    coordinates: [-95.7129, 37.0902],
    region: 'North America'
  },
  {
    id: 'ZA',
    name: 'ZA',
    code: 'ZA',
    coordinates: [22.9375, -30.5595],
    region: 'Africa'
  }
];

// Dados mockados de CDNs
export const mockCDNs: CDN[] = [
  {
    id: 'Cloudflare',
    name: 'Cloudflare',
    provider: 'Cloudflare Inc.',
    type: 'global'
  },
  {
    id: 'Akamai',
    name: 'Akamai',
    provider: 'Akamai Technologies',
    type: 'global'
  },
  {
    id: 'Cloudfront',
    name: 'AWS CloudFront',
    provider: 'Amazon Web Services',
    type: 'global'
  },
  {
    id: 'Google',
    name: 'Google Cloud CDN',
    provider: 'Google LLC',
    type: 'global'
  },
  {
    id: 'Fastly',
    name: 'Fastly',
    provider: 'Fastly Inc.',
    type: 'global'
  },
  {
    id: 'Yahoo',
    name: 'Yahoo',
    provider: 'Yahoo',
    type: 'global'
  }
];
// Dados mockados de classes de conteúdo
export const mockContentClasses: ContentClass[] = [
  {
    id: 'News',
    name: 'news',
    category: 'media',
    description: 'Portais de notícias, jornalismo digital e informação'
  },
  {
    id: 'Critical Services',
    name: 'critical-services',
    category: 'finance',
    description: 'Bancos, fintechs, pagamentos digitais e serviços críticos'
  },
  {
    id: 'General Digital Services',
    name: 'general-digital-services',
    category: 'commerce',
    description: 'E-commerce, plataformas digitais e serviços gerais'
  },
  {
    id: 'Entertainment',
    name: 'entertainment',
    category: 'entertainment',
    description: 'Streaming de vídeo, música, jogos e conteúdo digital'
  }
];

// Dados completos mockados
export const mockData: MapData = {
  countries: mockCountries,
  cdns: mockCDNs,
  contentClasses: mockContentClasses,
  relations: relations as DependencyRelation[]
};
