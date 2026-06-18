import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CurrencyPair {
  from: string;
  to: string;
}

/**
 * Pequeno serviço de estado compartilhado: guarda qual par de moedas
 * (origem/destino) o usuário está observando no Conversor, para que o
 * componente raiz (app.component) saiba qual par "vigiar" para o alerta
 * de variação de taxa configurado em Configurações.
 */
@Injectable({ providedIn: 'root' })
export class SelectedPairService {
  private pairSubject = new BehaviorSubject<CurrencyPair>({ from: 'USD', to: 'BRL' });
  readonly pair$ = this.pairSubject.asObservable();

  setPair(from: string, to: string): void {
    this.pairSubject.next({ from, to });
  }

  getPair(): CurrencyPair {
    return this.pairSubject.value;
  }
}
