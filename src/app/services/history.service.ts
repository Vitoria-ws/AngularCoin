import { Injectable } from '@angular/core';
import { ConversionEntry } from '../models/currency.model';

/**
 * Guarda o histórico de conversões feitas pelo usuário direto no
 * armazenamento local do navegador (Local Storage), para que ele continue
 * disponível mesmo depois de fechar e abrir o app de novo, ou se estiver offline.
 */
@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly STORAGE_KEY = 'angularcoin_conversion_history';
  private readonly MAX_ITEMS = 50;

  getHistory(): ConversionEntry[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ConversionEntry[]) : [];
    } catch {
      return [];
    }
  }

  addEntry(entry: Omit<ConversionEntry, 'id' | 'date'>): void {
    const history = this.getHistory();

    const newEntry: ConversionEntry = {
      ...entry,
      id: this.generateId(),
      date: new Date().toISOString()
    };

    history.unshift(newEntry); // adiciona no início (mais recente primeiro)
    const trimmed = history.slice(0, this.MAX_ITEMS);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // se o armazenamento estiver cheio ou indisponível, apenas ignoramos
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
