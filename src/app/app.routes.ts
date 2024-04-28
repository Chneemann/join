import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { HelpComponent } from './shared/components/help/help.component';
import { ImprintComponent } from './shared/components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { TaskOverlayComponent } from './shared/components/overlay/task-overlay/task-overlay.component';
import { TaskEditOverlayComponent } from './shared/components/overlay/task-edit-overlay/task-edit-overlay.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: SummaryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'add-task/:id', component: AddTaskComponent },
  { path: 'board', component: BoardComponent },
  { path: 'task/:id', component: TaskOverlayComponent },
  { path: 'task-edit/:id', component: TaskEditOverlayComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'contacts/:id', component: ContactsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
