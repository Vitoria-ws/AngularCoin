import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CURRENCY_SYMBOLS } from '../../data/currency-symbols';

/**
 * Componente reutilizável: um "seletor" de moeda com busca.
 * É usado duas vezes na tela de Conversão (origem e destino) e também
 * na tela de Gráfico. Recebe a lista de moedas disponíveis de fora
 * (Input) e avisa quem o está usando quando o usuário escolhe outra (Output).
 */
@Component({
  selector: 'app-currency-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-picker.component.html',
  styleUrl: './currency-picker.component.css'
})
export class CurrencyPickerComponent {
  @Input() label = '';
  @Input() selected = 'USD';
  @Input() currencies: { [code: string]: string } = {};
  @Output() selectedChange = new EventEmitter<string>();

  isOpen = false;
  searchTerm = '';

  get selectedName(): string {
    return this.currencies[this.selected] ?? this.selected;
  }

  get selectedSymbol(): string {
    return CURRENCY_SYMBOLS[this.selected] ?? this.selected;
  }

  get filteredCodes(): string[] {
    const term = this.searchTerm.trim().toLowerCase();
    return Object.keys(this.currencies)
      .filter((code) => {
        if (!term) return true;
        const name = this.currencies[code].toLowerCase();
        return code.toLowerCase().includes(term) || name.includes(term);
      })
      .sort();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.searchTerm = '';
  }

  close(): void {
    this.isOpen = false;
  }

  choose(code: string): void {
    this.selected = code;
    this.selectedChange.emit(code);
    this.isOpen = false;
  }

  symbolFor(code: string): string {
    return CURRENCY_SYMBOLS[code] ?? code;
  }
}
