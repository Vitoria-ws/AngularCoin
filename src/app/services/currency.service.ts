import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CurrenciesMap, RatesResponse, TimeSeriesResponse } from '../models/currency.model';

/**
 * Este serviço é o único lugar do app que conversa com a API externa
 * (https://www.frankfurter.dev — uma API REST pública e gratuita de
 * cotações de moedas, sem necessidade de cadastro ou chave de acesso).
 *
 * Ele também é responsável pela funcionalidade OFFLINE: toda resposta que
 * chega com sucesso é salva no Local Storage. Se uma próxima requisição
 * falhar (sem internet), devolvemos os últimos dados salvos.
 */
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly API_URL = 'https://api.frankfurter.dev/v1';

  // Observable que qualquer componente pode "escutar" para saber se estamos
  // online (pegando dados novos da API) ou offline (usando dados salvos).
  private onlineStatus = new BehaviorSubject<boolean>(true);
  readonly isOnline$ = this.onlineStatus.asObservable();

  constructor(private http: HttpClient) {}

  /** Lista de moedas suportadas, ex: { "USD": "United States Dollar" } */
  getCurrencies(): Observable<CurrenciesMap> {
    return this.http.get<CurrenciesMap>(`${this.API_URL}/currencies`).pipe(
      tap((data) => this.saveCache('currencies', data)),
      catchError(() => of(this.loadCache<CurrenciesMap>('currencies') ?? {}))
    );
  }

  /** Cotação mais recente de todas as moedas em relação a uma moeda base */
  getLatestRates(base: string): Observable<RatesResponse> {
    return this.http.get<RatesResponse>(`${this.API_URL}/latest?base=${base}`).pipe(
      tap((data) => {
        this.onlineStatus.next(true);
        this.saveCache(`rates_${base}`, { ...data, fetchedAt: Date.now() });
      }),
      catchError(() => {
        this.onlineStatus.next(false);
        const cached = this.loadCache<RatesResponse>(`rates_${base}`);
        return of(cached ?? { amount: 1, base, date: '', rates: {} });
      })
    );
  }

  /** Série histórica (por padrão, últimos 30 dias) para montar o gráfico */
  getHistoricalRates(base: string, target: string, days = 30): Observable<TimeSeriesResponse> {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const format = (d: Date) => d.toISOString().slice(0, 10); // AAAA-MM-DD

    const url = `${this.API_URL}/${format(start)}..${format(end)}?base=${base}&symbols=${target}`;

    return this.http.get<TimeSeriesResponse>(url).pipe(
      tap((data) => {
        this.onlineStatus.next(true);
        this.saveCache(`history_${base}_${target}`, data);
      }),
      catchError(() => {
        this.onlineStatus.next(false);
        const cached = this.loadCache<TimeSeriesResponse>(`history_${base}_${target}`);
        return of(cached ?? { amount: 1, base, start_date: '', end_date: '', rates: {} });
      })
    );
  }

  // --- Funções auxiliares de cache (Local Storage) ---

  private saveCache(key: string, data: unknown): void {
    try {
      localStorage.setItem(`angularcoin_${key}`, JSON.stringify(data));
    } catch {
      // Local Storage pode falhar em modo anônimo/privado: ignoramos o erro.
    }
  }

  private loadCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`angularcoin_${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
}
