// Algoritmo avançado para calcular criticidade de relações CDN
// Este seria usado em um sistema real com dados do RIPE Atlas

interface NetworkMetrics {
  latency: number; // ms
  bandwidth: number; // Mbps
  reliability: number; // % uptime
  hopCount: number; // número de saltos BGP
  trafficVolume: number; // GB/dia
  redundancy: number; // número de rotas alternativas
}

interface GeopoliticalFactors {
  economicTies: number; // 0-10 (baseado em PIB, comércio)
  culturalTies: number; // 0-10 (idioma, história)
  digitalMaturity: number; // 0-10 (infraestrutura digital)
  regulations: number; // 0-10 (facilidade regulatória)
}

interface ContentFactors {
  contentType:
    | 'finance'
    | 'health'
    | 'entertainment'
    | 'education'
    | 'government'
    | 'commerce'
    | 'media'
    | 'social';
  userBase: number; // milhões de usuários
  businessCritical: boolean; // se é crítico para negócios
  realTimeRequirement: boolean; // se precisa baixa latência
}

export function calculateCriticality(
  metrics: NetworkMetrics,
  geopolitical: GeopoliticalFactors,
  content: ContentFactors,
  cdnType: 'global' | 'regional' | 'local'
): number {
  // 1. PERFORMANCE SCORE (0-30 pontos)
  const performanceScore = calculatePerformanceScore(metrics);

  // 2. BUSINESS IMPACT SCORE (0-25 pontos)
  const businessScore = calculateBusinessImpact(content, metrics.trafficVolume);

  // 3. GEOPOLITICAL SCORE (0-20 pontos)
  const geoScore = calculateGeopoliticalScore(geopolitical);

  // 4. REDUNDANCY SCORE (0-15 pontos) - INVERSO (menos redundância = mais crítico)
  const redundancyScore = calculateRedundancyScore(metrics.redundancy, cdnType);

  // 5. NETWORK QUALITY SCORE (0-10 pontos)
  const networkScore = calculateNetworkQuality(metrics);

  const totalScore =
    performanceScore +
    businessScore +
    geoScore +
    redundancyScore +
    networkScore;

  // Normalizar para 0-100
  return Math.min(100, Math.max(0, totalScore));
}

function calculatePerformanceScore(metrics: NetworkMetrics): number {
  // Latência (0-10): <50ms=10, 50-100ms=8, 100-200ms=5, >200ms=2
  const latencyScore =
    metrics.latency < 50
      ? 10
      : metrics.latency < 100
        ? 8
        : metrics.latency < 200
          ? 5
          : 2;

  // Bandwidth (0-10): >1000Mbps=10, 500-1000=8, 100-500=5, <100=2
  const bandwidthScore =
    metrics.bandwidth > 1000
      ? 10
      : metrics.bandwidth > 500
        ? 8
        : metrics.bandwidth > 100
          ? 5
          : 2;

  // Reliability (0-10): >99%=10, 95-99%=8, 90-95%=5, <90%=2
  const reliabilityScore =
    metrics.reliability > 99
      ? 10
      : metrics.reliability > 95
        ? 8
        : metrics.reliability > 90
          ? 5
          : 2;

  return latencyScore + bandwidthScore + reliabilityScore;
}

function calculateBusinessImpact(
  content: ContentFactors,
  trafficVolume: number
): number {
  // Base score por tipo de conteúdo
  const contentScores = {
    finance: 10, // Mais crítico
    health: 9, // Muito crítico
    government: 8, // Crítico
    commerce: 7, // Importante
    education: 6, // Importante
    media: 5, // Moderado
    social: 4, // Moderado
    entertainment: 3 // Menos crítico
  };

  let score = contentScores[content.contentType];

  // Multiplicadores
  if (content.businessCritical) score *= 1.5;
  if (content.realTimeRequirement) score *= 1.3;

  // Volume de tráfego (0-10)
  const volumeScore =
    trafficVolume > 1000
      ? 10
      : trafficVolume > 500
        ? 8
        : trafficVolume > 100
          ? 5
          : 2;

  return Math.min(25, score + volumeScore);
}

function calculateGeopoliticalScore(geo: GeopoliticalFactors): number {
  // Média ponderada dos fatores geopolíticos
  return (
    (geo.economicTies * 0.4 + // 40% peso
      geo.culturalTies * 0.2 + // 20% peso
      geo.digitalMaturity * 0.3 + // 30% peso
      geo.regulations * 0.1) * // 10% peso
    2
  ); // Multiplicar por 2 para escala 0-20
}

function calculateRedundancyScore(redundancy: number, cdnType: string): number {
  // Menos redundância = mais crítico (score INVERSO)
  const baseScore =
    redundancy === 0
      ? 15 // Único ponto de falha
      : redundancy === 1
        ? 12 // Pouca redundância
        : redundancy <= 3
          ? 8 // Alguma redundância
          : redundancy <= 5
            ? 5
            : 2; // Muita redundância

  // CDNs locais são mais críticos se únicos
  const cdnMultiplier =
    cdnType === 'local' ? 1.2 : cdnType === 'regional' ? 1.1 : 1.0;

  return baseScore * cdnMultiplier;
}

function calculateNetworkQuality(metrics: NetworkMetrics): number {
  // Número de saltos BGP (menos saltos = melhor)
  const hopScore =
    metrics.hopCount <= 3
      ? 5
      : metrics.hopCount <= 6
        ? 3
        : metrics.hopCount <= 10
          ? 2
          : 1;

  // Score total de qualidade da rede
  return hopScore + Math.min(5, metrics.reliability / 20);
}

// EXEMPLO DE USO REAL:
export function calculateBrazilToUSStreaming(): number {
  const metrics: NetworkMetrics = {
    latency: 120, // ms (São Paulo -> Miami)
    bandwidth: 850, // Mbps
    reliability: 99.2, // % uptime
    hopCount: 8, // saltos BGP
    trafficVolume: 2500, // GB/dia (muito alto para streaming)
    redundancy: 2 // 2 rotas alternativas
  };

  const geopolitical: GeopoliticalFactors = {
    economicTies: 8, // Brasil-EUA têm forte comércio
    culturalTies: 6, // Influência cultural americana
    digitalMaturity: 7, // Brasil moderadamente digital
    regulations: 7 // Regulamentações razoáveis
  };

  const content: ContentFactors = {
    contentType: 'entertainment',
    userBase: 50, // 50 milhões de usuários brasileiros
    businessCritical: true, // Streaming é negócio crítico
    realTimeRequirement: true // Precisa baixa latência
  };

  return calculateCriticality(metrics, geopolitical, content, 'global');
  // Resultado esperado: ~85-90% (alta criticidade)
}

// EXEMPLO: Relação menos crítica
export function calculateSwedenToUKHealthcare(): number {
  const metrics: NetworkMetrics = {
    latency: 45, // Muito baixa latência (próximos)
    bandwidth: 1200, // Alta bandwidth
    reliability: 99.8, // Muito confiável
    hopCount: 4, // Poucos saltos
    trafficVolume: 50, // Volume baixo (nicho)
    redundancy: 5 // Muitas alternativas na Europa
  };

  const geopolitical: GeopoliticalFactors = {
    economicTies: 9, // UE = forte integração
    culturalTies: 8, // Culturas similares
    digitalMaturity: 10, // Ambos muito digitais
    regulations: 9 // GDPR alinhado
  };

  const content: ContentFactors = {
    contentType: 'health',
    userBase: 2, // Poucos usuários (especialistas)
    businessCritical: true, // Saúde é crítica
    realTimeRequirement: false // Não precisa tempo real
  };

  return calculateCriticality(metrics, geopolitical, content, 'regional');
  // Resultado esperado: ~65-75% (criticidade média-alta)
}
