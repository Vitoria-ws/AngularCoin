import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { ConversionEntry } from '../../models/currency.model';

/**
 * Tela que mostra o histórico de conversões salvas localmente
 * (Local Storage), permitindo consultar conversões antigas sem
 * precisar chamar a API de novo.
 */
@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent implements OnInit {
  entries: ConversionEntry[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.entries = this.historyService.getHistory();
  }

  clear(): void {
    this.historyService.clearHistory();
    this.entries = [];
  }
}
