import { Routes } from '@angular/router';
import { ConversorComponent } from './components/conversor/conversor.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { GraficoComponent } from './components/grafico/grafico.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';

export const routes: Routes = [
  { path: '', component: ConversorComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'grafico', component: GraficoComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent },
  { path: '**', redirectTo: '' }
];
