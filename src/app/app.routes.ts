import { Routes } from '@angular/router';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { FirmsComponent } from './pages/firms/firms.component';
import { JuryPlacementComponent } from './pages/jury-placement/jury-placement.component';
import { JurySelectionComponent } from './pages/jury-selection/jury-selection.component';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { RegisterComponent } from './pages/register/register.component';
import { TrialComponent } from './pages/trial/trial.component';
import { TrialsComponent } from './pages/trials/trials.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'profile', title: 'Your Details', component: UserProfileComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'firms', title: 'Firms', component: FirmsComponent },
  { path: 'refresh', title: 'Trials', component: TrialsComponent },
  { path: 'trials', title: 'Trials', component: TrialsComponent },
  { path: 'trial/:trialId', title: 'Trial Details', component: TrialComponent },
  {
    path: 'trial/:trialId/details',
    title: 'Trial Details',
    component: TrialComponent,
  },
  {
    path: 'trial/:trialId/jury-selection',
    title: 'Jury Selection',
    component: JurySelectionComponent,
  },
  {
    path: 'trial/:trialId/jury-placement',
    title: 'Jury Placement',
    component: JuryPlacementComponent,
  },
  {
    path: 'trial/:trialId/evidence',
    title: 'Evidence',
    component: EvidenceComponent,
  },
  {
    path: 'trial/:trialId/messages',
    title: 'Messages',
    component: MessagesComponent,
  },
];
