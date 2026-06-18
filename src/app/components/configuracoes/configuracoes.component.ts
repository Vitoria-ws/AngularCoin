import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { NotificationService } from '../../services/notification.service';
import { AppSettings } from '../../models/currency.model';

/**
 * Tela onde o usuário escolhe a frequência de atualização automática das
 * taxas de câmbio e se quer (ou não) receber notificações quando a taxa
 * do par de moedas que ele está observando variar muito.
 */
@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent implements OnInit {
  settings!: AppSettings;
  permissionMessage = '';

  readonly frequencyOptions = [
    { label: 'A cada 15 minutos', value: 15 },
    { label: 'A cada 30 minutos', value: 30 },
    { label: 'A cada hora', value: 60 },
    { label: 'A cada 6 horas', value: 360 },
    { label: 'Uma vez por dia', value: 1440 }
  ];

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.settings = { ...this.settingsService.getSettings() };
  }

  save(): void {
    this.settingsService.updateSettings(this.settings);
  }

  async toggleNotifications(): Promise<void> {
    if (this.settings.notificationsEnabled) {
      const granted = await this.notificationService.requestPermission();
      if (!granted) {
        this.settings.notificationsEnabled = false;
        this.permissionMessage = 'Permissão de notificação negada pelo navegador.';
      } else {
        this.permissionMessage = 'Notificações ativadas! Você será avisado sobre variações grandes.';
      }
    } else {
      this.permissionMessage = '';
    }
    this.save();
  }
}
