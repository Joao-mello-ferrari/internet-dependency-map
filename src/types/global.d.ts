// Declarações de tipos globais para Leaflet
declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

export {};
