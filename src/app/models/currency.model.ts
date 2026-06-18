// Mapa simples de código da moeda -> nome em português/inglês (vem direto da API)
// Exemplo: { "USD": "United States Dollar", "BRL": "Brazilian Real" }
export interface CurrenciesMap {
  [code: string]: string;
}

// Resposta da API para a cotação mais atual de uma moeda base
export interface RatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [code: string]: number };
}

// Resposta da API para a série histórica de cotações (usada no gráfico)
export interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: { [date: string]: { [code: string]: number } };
}

// Um item salvo no histórico de conversões do usuário (fica no Local Storage)
export interface ConversionEntry {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
}

// Preferências do usuário, também salvas no Local Storage
export interface AppSettings {
  refreshFrequencyMinutes: number;
  notificationsEnabled: boolean;
  notificationThreshold: number;
}
