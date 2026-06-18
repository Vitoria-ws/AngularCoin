// Símbolos das moedas suportadas pela API (Frankfurter). Usado só para deixar
// a interface mais bonita; se uma moeda não estiver aqui, mostramos o código mesmo (ex: "XYZ").
export const CURRENCY_SYMBOLS: { [code: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', BRL: 'R$', CNY: '¥', CHF: 'Fr',
  CAD: '$', AUD: '$', INR: '₹', KRW: '₩', MXN: '$', SEK: 'kr', NOK: 'kr',
  DKK: 'kr', PLN: 'zł', TRY: '₺', ZAR: 'R', SGD: '$', HKD: '$', NZD: '$',
  THB: '฿', ILS: '₪', CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв',
  IDR: 'Rp', MYR: 'RM', PHP: '₱', ISK: 'kr'
};
