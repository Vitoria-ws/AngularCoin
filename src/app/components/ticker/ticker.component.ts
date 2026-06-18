import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { CurrencyService } from '../../services/currency.service';

interface TickerItem {
  code: string;
  rate: number;
  trend: 'up' | 'down' | 'flat';
}

/**
 * Faixa decorativa no topo do app, no estilo dos painéis de câmbio de
 * aeroportos/bancos: mostra a cotação do dólar (USD) contra várias outras
 * moedas e rola continuamente na tela.
 */
@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.css'
})
export class TickerComponent implements OnInit, OnDestroy {
  items: TickerItem[] = [];

  private readonly WATCHED = ['EUR', 'GBP', 'JPY', 'BRL', 'CAD', 'AUD', 'CHF', 'CNY'];
  private previousRates: { [code: string]: number } = {};
  private sub?: Subscription;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // Busca assim que o app abre (startWith(0)) e depois a cada 5 minutos
    this.sub = interval(5 * 60 * 1000)
      .pipe(
        startWith(0),
        switchMap(() => this.currencyService.getLatestRates('USD'))
      )
      .subscribe((res) => {
        this.items = this.WATCHED.filter((code) => res.rates[code] != null).map((code) => {
          const rate = res.rates[code];
          const prev = this.previousRates[code];
          let trend: 'up' | 'down' | 'flat' = 'flat';
          if (prev != null) {
            trend = rate > prev ? 'up' : rate < prev ? 'down' : 'flat';
          }
          this.previousRates[code] = rate;
          return { code, rate, trend };
        });
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
