import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPickerComponent } from '../currency-picker/currency-picker.component';
import { CurrencyService } from '../../services/currency.service';

interface ChartPoint {
  x: number;
  y: number;
  date: string;
  value: number;
}

/**
 * Tela extra (funcionalidade adicional pedida no projeto): mostra um
 * gráfico de linha com a variação da cotação entre duas moedas nos
 * últimos 30 dias, usando dados históricos reais da API.
 */
@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, CurrencyPickerComponent],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.css'
})
export class GraficoComponent implements OnInit {
  currencies: { [code: string]: string } = {};
  from = 'USD';
  to = 'BRL';

  points: ChartPoint[] = [];
  pathD = '';
  minValue = 0;
  maxValue = 0;
  loading = false;
  hasData = false;

  readonly viewW = 600;
  readonly viewH = 220;
  readonly padding = 28;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe((map) => (this.currencies = map));
    this.loadChart();
  }

  onFromChange(code: string): void {
    this.from = code;
    this.loadChart();
  }

  onToChange(code: string): void {
    this.to = code;
    this.loadChart();
  }

  loadChart(): void {
    this.loading = true;
    this.currencyService.getHistoricalRates(this.from, this.to, 30).subscribe((res) => {
      this.loading = false;
      const dates = Object.keys(res.rates).sort();
      this.hasData = dates.length > 1;

      if (!this.hasData) {
        this.points = [];
        this.pathD = '';
        return;
      }

      const values = dates.map((d) => res.rates[d][this.to]);
      this.minValue = Math.min(...values);
      this.maxValue = Math.max(...values);
      const range = this.maxValue - this.minValue || 1;

      const innerW = this.viewW - this.padding * 2;
      const innerH = this.viewH - this.padding * 2;

      this.points = dates.map((d, i) => {
        const x = this.padding + (i / (dates.length - 1)) * innerW;
        const y = this.padding + innerH - ((values[i] - this.minValue) / range) * innerH;
        return { x, y, date: d, value: values[i] };
      });

      this.pathD = this.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    });
  }
}
