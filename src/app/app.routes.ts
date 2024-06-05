import { Routes } from '@angular/router';
import { EvidenceComponent } from './evidence/evidence.component';
import { JuryPlacementComponent } from './jury-placement/jury-placement.component';
import { JurySelectionComponent } from './jury-selection/jury-selection.component';
import { TrialsComponent } from './trials/trials.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'trials' },
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
    title: 'Jury Selection',
    component: JurySelectionComponent,
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
