import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, interval, switchMap } from 'rxjs';
import { TickerComponent } from './components/ticker/ticker.component';
import { CurrencyService } from './services/currency.service';
import { SettingsService } from './services/settings.service';
import { SelectedPairService } from './services/selected-pair.service';
import { NotificationService } from './services/notification.service';

/**
 * Componente raiz: monta a estrutura geral do app (cabeçalho, navegação,
 * faixa de cotações e o conteúdo da página atual via router-outlet).
 *
 * Também é responsável por "vigiar" o par de moedas que o usuário está
 * acompanhando e disparar uma notificação quando a variação configurada
 * em Configurações for atingida.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isOnline = true;

  private lastWatchedRate: number | null = null;
  private pollSub?: Subscription;
  private onlineSub?: Subscription;

  constructor(
    private currencyService: CurrencyService,
    private settingsService: SettingsService,
    private selectedPairService: SelectedPairService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.onlineSub = this.currencyService.isOnline$.subscribe((status) => (this.isOnline = status));
    this.startWatcher();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.onlineSub?.unsubscribe();
  }

  /**
   * Cria um "relógio" que dispara a cada X minutos (conforme escolhido em
   * Configurações) para verificar se a taxa do par observado mudou muito.
   * Usamos switchMap para reiniciar o relógio automaticamente sempre que
   * o usuário trocar a frequência nas Configurações.
   */
  private startWatcher(): void {
    this.pollSub = this.settingsService.settings$
      .pipe(switchMap((settings) => interval(Math.max(settings.refreshFrequencyMinutes, 1) * 60 * 1000)))
      .subscribe(() => this.checkForBigChange());
  }

  private checkForBigChange(): void {
    const settings = this.settingsService.getSettings();
    if (!settings.notificationsEnabled) return;

    const { from, to } = this.selectedPairService.getPair();

    this.currencyService.getLatestRates(from).subscribe((res) => {
      const rate = res.rates[to];
      if (rate == null) return;

      if (this.lastWatchedRate != null) {
        const change = Math.abs((rate - this.lastWatchedRate) / this.lastWatchedRate) * 100;
        if (change >= settings.notificationThreshold) {
          this.notificationService.notify(
            `AngularCoin: ${from} → ${to}`,
            `A taxa variou ${change.toFixed(2)}%. Novo valor: ${rate.toFixed(4)}`
          );
        }
      }
      this.lastWatchedRate = rate;
    });
  }
}
