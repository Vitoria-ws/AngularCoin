import { Injectable } from '@angular/core';

/**
 * Encapsula o uso da API de Notificações do navegador.
 * Se o navegador não suportar (ou o usuário negar a permissão),
 * o app continua funcionando normalmente — apenas sem notificações.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission === 'denied') {
      return false;
    }
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  notify(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
