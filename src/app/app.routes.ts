import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { HelpComponent } from './shared/components/legal-information/help/help.component';
import { ImprintComponent } from './shared/components/legal-information/imprint/imprint.component';
import { PrivacyPolicyComponent } from './shared/components/legal-information/privacy-policy/privacy-policy.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { TaskOverlayComponent } from './shared/components/overlay/task-overlay/task-overlay.component';
import { TaskEditOverlayComponent } from './shared/components/overlay/task-edit-overlay/task-edit-overlay.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/login/register/register.component';
import { ForgotPwComponent } from './components/login/forgot-pw/forgot-pw.component';
import { PwResetComponent } from './components/login/forgot-pw/pw-reset/pw-reset.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/notice/:id', component: LoginComponent },
  { path: 'login/imprint', component: ImprintComponent },
  { path: 'login/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-pw', component: ForgotPwComponent },
  { path: 'pw-reset', component: PwResetComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard] },
  { path: 'add-task', component: AddTaskComponent, canActivate: [AuthGuard] },
  {
    path: 'add-task/:id',
    component: AddTaskComponent,
    canActivate: [AuthGuard],
  },
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard] },
  {
    path: 'task/:id',
    component: TaskOverlayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'task-edit/:id',
    component: TaskEditOverlayComponent,
    canActivate: [AuthGuard],
  },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'imprint', component: ImprintComponent, canActivate: [AuthGuard] },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    canActivate: [AuthGuard],
  },
];
