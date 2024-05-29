import { Routes } from '@angular/router';
import { CasesComponent } from './cases/cases.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { JuryPlacementComponent } from './jury-placement/jury-placement.component';
import { JurySelectionComponent } from './jury-selection/jury-selection.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'jury-selection' },
  {
    path: 'cases',
    title: 'Cases',
    component: CasesComponent,
  },
  {
    path: 'refresh',
    title: 'Jury Selection',
    component: JurySelectionComponent,
  },
  {
    path: 'jury-selection',
    title: 'Jury Selection',
    component: JurySelectionComponent,
  },
  {
    path: 'jury-placement',
    title: 'Jury Placement',
    component: JuryPlacementComponent,
  },
  {
    path: 'evidence',
    title: 'Evidence',
    component: EvidenceComponent,
  },
];
