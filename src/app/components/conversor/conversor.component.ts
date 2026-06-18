import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPickerComponent } from '../currency-picker/currency-picker.component';
import { CurrencyService } from '../../services/currency.service';
import { HistoryService } from '../../services/history.service';
import { SelectedPairService } from '../../services/selected-pair.service';

/**
 * Tela principal do app: onde o usuário escolhe a moeda de origem,
 * a moeda de destino e o valor, e vê o resultado da conversão.
 */
@Component({
  selector: 'app-conversor',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPickerComponent],
  templateUrl: './conversor.component.html',
  styleUrl: './conversor.component.css'
})
export class ConversorComponent implements OnInit {
  currencies: { [code: string]: string } = {};

  from = 'USD';
  to = 'BRL';
  amount = 1;

  private allRates: { [code: string]: number } = {};
  rate: number | null = null;
  result: number | null = null;

  lastUpdated: string | null = null;
  isOffline = false;
  loading = false;
  justSaved = false;

  constructor(
    private currencyService: CurrencyService,
    private historyService: HistoryService,
    private selectedPairService: SelectedPairService
  ) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe((map) => {
      this.currencies = map;
    });

    this.currencyService.isOnline$.subscribe((status) => {
      this.isOffline = !status;
    });

    this.fetchRates();
  }

  onFromChange(code: string): void {
    this.from = code;
    this.fetchRates();
  }

  onToChange(code: string): void {
    this.to = code;
    this.updateResult();
  }

  /** Funcionalidade de conversão inversa: troca origem e destino com 1 clique */
  swap(): void {
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;
    this.fetchRates();
  }

  fetchRates(): void {
    this.loading = true;
    this.currencyService.getLatestRates(this.from).subscribe((res) => {
      this.loading = false;
      this.allRates = res.rates;
      this.lastUpdated = res.date || null;
      this.selectedPairService.setPair(this.from, this.to);
      this.updateResult();
    });
  }

  updateResult(): void {
    this.rate = this.allRates[this.to] ?? null;
    this.result = this.rate != null ? this.amount * this.rate : null;
  }

  /** Salva a conversão atual no histórico (Local Storage) */
  convert(): void {
    this.updateResult();
    if (this.rate == null || this.result == null) return;

    this.historyService.addEntry({
      from: this.from,
      to: this.to,
      amount: this.amount,
      result: this.result,
      rate: this.rate
    });

    this.justSaved = true;
    setTimeout(() => (this.justSaved = false), 2000);
  }
}
