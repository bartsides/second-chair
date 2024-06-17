import { Routes } from '@angular/router';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { JuryPlacementComponent } from './pages/jury-placement/jury-placement.component';
import { JurySelectionComponent } from './pages/jury-selection/jury-selection.component';
import { LoginComponent } from './pages/login/login.component';
import { TrialComponent } from './pages/trial/trial.component';
import { TrialsComponent } from './pages/trials/trials.component';

export const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  {
    path: 'refresh',
    title: 'Trials',
    component: TrialsComponent,
  },
  {
    path: 'trials',
    title: 'Trials',
    component: TrialsComponent,
  },
  {
    path: 'trial/:trialId',
    title: 'Trial Details',
    component: TrialComponent,
  },
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
];
