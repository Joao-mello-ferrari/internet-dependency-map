import type {
  Country,
  CDN,
  ContentClass,
  DependencyRelation,
  MapData,
} from "../types";

// Dados mockados de países principais
export const mockCountries: Country[] = [
  {
    id: "BR",
    name: "BR",
    code: "BR",
    coordinates: [-47.9292, -15.7801],
    region: "South America",
  },
  {
    id: "US",
    name: "US",
    code: "US",
    coordinates: [-95.7129, 37.0902],
    region: "North America",
  },
  {
    id: "GB",
    name: "GB",
    code: "GB",
    coordinates: [-3.436, 55.3781],
    region: "Europe",
  },
  {
    id: "DE",
    name: "DE",
    code: "DE",
    coordinates: [10.4515, 51.1657],
    region: "Europe",
  },
  {
    id: "FR",
    name: "FR",
    code: "FR",
    coordinates: [2.2137, 46.2276],
    region: "Europe",
  },
  {
    id: "JP",
    name: "JP",
    code: "JP",
    coordinates: [138.2529, 36.2048],
    region: "Asia",
  },
  {
    id: "CN",
    name: "CN",
    code: "CN",
    coordinates: [104.1954, 35.8617],
    region: "Asia",
  },
  {
    id: "AU",
    name: "AU",
    code: "AU",
    coordinates: [133.7751, -25.2744],
    region: "Oceania",
  },
  {
    id: "CA",
    name: "CA",
    code: "CA",
    coordinates: [-106.3468, 56.1304],
    region: "North America",
  },
  {
    id: "IN",
    name: "IN",
    code: "IN",
    coordinates: [78.9629, 20.5937],
    region: "Asia",
  },
  {
    id: "RU",
    name: "RU",
    code: "RU",
    coordinates: [105.3188, 61.524],
    region: "Europe/Asia",
  },
  {
    id: "ZA",
    name: "ZA",
    code: "ZA",
    coordinates: [22.9375, -30.5595],
    region: "Africa",
  },
  {
    id: "AR",
    name: "AR",
    code: "AR",
    coordinates: [-63.6167, -38.4161],
    region: "South America",
  },
  {
    id: "MX",
    name: "MX",
    code: "MX",
    coordinates: [-102.5528, 23.6345],
    region: "North America",
  },
  {
    id: "IT",
    name: "IT",
    code: "IT",
    coordinates: [12.5674, 41.8719],
    region: "Europe",
  },
  {
    id: "ES",
    name: "ES",
    code: "ES",
    coordinates: [-3.7492, 40.4637],
    region: "Europe",
  },
  {
    id: "KR",
    name: "KR",
    code: "KR",
    coordinates: [127.7669, 35.9078],
    region: "Asia",
  },
  {
    id: "SG",
    name: "SG",
    code: "SG",
    coordinates: [103.8198, 1.3521],
    region: "Asia",
  },
  {
    id: "NL",
    name: "NL",
    code: "NL",
    coordinates: [5.2913, 52.1326],
    region: "Europe",
  },
  {
    id: "SE",
    name: "SE",
    code: "SE",
    coordinates: [18.6435, 60.1282],
    region: "Europe",
  },
];

// Dados mockados de CDNs
export const mockCDNs: CDN[] = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    provider: "Cloudflare Inc.",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "BR", "CA", "SG", "NL"],
    type: "global",
  },
  {
    id: "akamai",
    name: "Akamai",
    provider: "Akamai Technologies",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "BR", "CA", "IN", "KR"],
    type: "global",
  },
  {
    id: "aws_cloudfront",
    name: "AWS CloudFront",
    provider: "Amazon Web Services",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "BR", "CA", "IN", "SG"],
    type: "global",
  },
  {
    id: "google_cloud_cdn",
    name: "Google Cloud CDN",
    provider: "Google LLC",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "BR", "CA", "IN", "SG"],
    type: "global",
  },
  {
    id: "azure_cdn",
    name: "Azure CDN",
    provider: "Microsoft Corporation",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "BR", "CA", "IN", "NL"],
    type: "global",
  },
  {
    id: "fastly",
    name: "Fastly",
    provider: "Fastly Inc.",
    coverage: ["US", "GB", "DE", "FR", "JP", "AU", "SG"],
    type: "regional",
  },
  {
    id: "keycdn",
    name: "KeyCDN",
    provider: "KeyCDN",
    coverage: ["US", "GB", "DE", "FR", "SG", "AU"],
    type: "regional",
  },
  {
    id: "rnp_brasil",
    name: "RNP Brasil",
    provider: "Rede Nacional de Ensino e Pesquisa",
    coverage: ["BR"],
    type: "local",
  },
];

// Dados mockados de classes de conteúdo
export const mockContentClasses: ContentClass[] = [
  {
    id: "finance",
    name: "finance",
    category: "finance",
    description: "Bancos, fintechs, pagamentos digitais e criptomoedas",
  },
  {
    id: "health",
    name: "health",
    category: "health",
    description: "Telemedicina, prontuários eletrônicos e aplicações de saúde",
  },
  {
    id: "entertainment",
    name: "entertainment",
    category: "entertainment",
    description: "Streaming de vídeo, música, jogos e conteúdo digital",
  },
  {
    id: "education",
    name: "education",
    category: "education",
    description: "Ensino à distância, plataformas educacionais e pesquisa",
  },
  {
    id: "government",
    name: "government",
    category: "government",
    description: "Serviços públicos digitais e e-government",
  },
  {
    id: "commerce",
    name: "commerce",
    category: "commerce",
    description: "E-commerce, marketplaces e plataformas de vendas",
  },
  {
    id: "media",
    name: "media",
    category: "media",
    description: "Portais de notícias, jornalismo digital e mídia social",
  },
  {
    id: "social",
    name: "social",
    category: "social",
    description: "Plataformas sociais, mensageria e comunicação",
  },
];

// Função para gerar relações de dependência mockadas
export const generateMockRelations = (): DependencyRelation[] => {
  const relations: DependencyRelation[] = [];
  let relationId = 1;

  // Gerar relações baseadas em cenários realistas
  const scenarios = [
    // Brasil dependente de CDNs americanos para streaming
    {
      from: "BR",
      to: "US",
      cdns: ["aws_cloudfront", "cloudflare"],
      content: ["entertainment", "media"],
      type: "dependency" as const,
    },
    // EUA provendo serviços para vários países
    {
      from: "US",
      to: "BR",
      cdns: ["akamai", "google_cloud_cdn"],
      content: ["finance", "commerce"],
      type: "provision" as const,
    },
    {
      from: "US",
      to: "CA",
      cdns: ["aws_cloudfront", "fastly"],
      content: ["entertainment", "social"],
      type: "provision" as const,
    },
    // Europa como hub para África e outros
    {
      from: "GB",
      to: "ZA",
      cdns: ["cloudflare", "akamai"],
      content: ["finance", "government"],
      type: "provision" as const,
    },
    {
      from: "DE",
      to: "BR",
      cdns: ["azure_cdn", "keycdn"],
      content: ["education", "health"],
      type: "provision" as const,
    },
    // Ásia com dependências regionais
    {
      from: "JP",
      to: "KR",
      cdns: ["fastly", "google_cloud_cdn"],
      content: ["entertainment", "social"],
      type: "provision" as const,
    },
    {
      from: "SG",
      to: "AU",
      cdns: ["cloudflare", "aws_cloudfront"],
      content: ["finance", "commerce"],
      type: "provision" as const,
    },
    // Dependências Sul-Americanas
    {
      from: "AR",
      to: "BR",
      cdns: ["rnp_brasil", "cloudflare"],
      content: ["education", "government"],
      type: "dependency" as const,
    },
    // China com suas próprias provisões
    {
      from: "CN",
      to: "KR",
      cdns: ["akamai"],
      content: ["commerce", "media"],
      type: "provision" as const,
    },
    // Casos de dependência mútua
    {
      from: "IN",
      to: "SG",
      cdns: ["aws_cloudfront", "google_cloud_cdn"],
      content: ["finance", "commerce"],
      type: "dependency" as const,
    },
    {
      from: "SG",
      to: "IN",
      cdns: ["cloudflare", "akamai"],
      content: ["entertainment", "media"],
      type: "provision" as const,
    },
  ];

  scenarios.forEach((scenario) => {
    scenario.cdns.forEach((cdnId) => {
      scenario.content.forEach((contentId) => {
        // Apenas relações IPv4
        relations.push({
          id: `rel_${relationId++}`,
          fromCountry: scenario.from,
          toCountry: scenario.to,
          cdnProvider: cdnId,
          protocol: { type: "IPv4", version: "4.0" },
          contentClass: contentId,
          intensity: Math.floor(Math.random() * 40) + 60, // 60-100 for high intensity
          type: scenario.type,
          latency: Math.floor(Math.random() * 200) + 50,
          bandwidth: Math.floor(Math.random() * 900) + 100,
          reliability: Math.floor(Math.random() * 20) + 80,
        });
      });
    });
  });

  // Adicionar algumas relações de baixa intensidade para diversidade
  const lowIntensityScenarios = [
    {
      from: "MX",
      to: "US",
      cdns: ["cloudflare"],
      content: ["education"],
      type: "dependency" as const,
    },
    {
      from: "IT",
      to: "DE",
      cdns: ["azure_cdn"],
      content: ["government"],
      type: "dependency" as const,
    },
    {
      from: "ES",
      to: "FR",
      cdns: ["keycdn"],
      content: ["media"],
      type: "dependency" as const,
    },
    {
      from: "SE",
      to: "GB",
      cdns: ["fastly"],
      content: ["health"],
      type: "dependency" as const,
    },
    {
      from: "NL",
      to: "DE",
      cdns: ["akamai"],
      content: ["finance"],
      type: "dependency" as const,
    },
  ];

  lowIntensityScenarios.forEach((scenario) => {
    scenario.cdns.forEach((cdnId) => {
      scenario.content.forEach((contentId) => {
        relations.push({
          id: `rel_${relationId++}`,
          fromCountry: scenario.from,
          toCountry: scenario.to,
          cdnProvider: cdnId,
          protocol: { type: "IPv4", version: "4.0" },
          contentClass: contentId,
          intensity: Math.floor(Math.random() * 30) + 20, // 20-50 for low intensity
          type: scenario.type,
          latency: Math.floor(Math.random() * 150) + 100,
          bandwidth: Math.floor(Math.random() * 400) + 50,
          reliability: Math.floor(Math.random() * 30) + 60,
        });
      });
    });
  });

  return relations;
};

// Dados completos mockados
export const mockData: MapData = {
  countries: mockCountries,
  cdns: mockCDNs,
  contentClasses: mockContentClasses,
  relations: generateMockRelations(),
};
