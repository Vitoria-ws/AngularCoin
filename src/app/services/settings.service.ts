import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSettings } from '../models/currency.model';

/**
 * Guarda as preferências do usuário (frequência de atualização das taxas
 * e notificações de variação) no Local Storage.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly STORAGE_KEY = 'angularcoin_settings';

  private readonly DEFAULTS: AppSettings = {
    refreshFrequencyMinutes: 60, // padrão: a cada hora
    notificationsEnabled: false,
    notificationThreshold: 1 // variação mínima de 1% para notificar
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.load());
  readonly settings$ = this.settingsSubject.asObservable();

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  updateSettings(partial: Partial<AppSettings>): void {
    const updated = { ...this.settingsSubject.value, ...partial };
    this.settingsSubject.next(updated);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignora se o Local Storage não estiver disponível
    }
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? { ...this.DEFAULTS, ...JSON.parse(raw) } : this.DEFAULTS;
    } catch {
      return this.DEFAULTS;
    }
  }
}
