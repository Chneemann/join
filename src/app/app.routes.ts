import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { HelpComponent } from './shared/components/help/help.component';

export const routes: Routes = [
  { path: '', component: SummaryComponent },
  { path: 'help', component: HelpComponent },
];
