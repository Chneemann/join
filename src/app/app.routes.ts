import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { HelpComponent } from './shared/components/help/help.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { ImprintComponent } from './shared/components/imprint/imprint.component';

export const routes: Routes = [
  { path: '', component: SummaryComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'help', component: HelpComponent },
  { path: 'imprint', component: ImprintComponent },

  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
