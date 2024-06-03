import { Routes } from '@angular/router';
import { CasesComponent } from './cases/cases.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { JuryPlacementComponent } from './jury-placement/jury-placement.component';
import { JurySelectionComponent } from './jury-selection/jury-selection.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cases' },
  {
    path: 'refresh',
    title: 'Cases',
    component: CasesComponent,
  },
  {
    path: 'cases',
    title: 'Cases',
    component: CasesComponent,
  },
  {
    path: 'case/:caseId',
    title: 'Jury Selection',
    component: JurySelectionComponent,
  },
  {
    path: 'case/:caseId/jury-selection',
    title: 'Jury Selection',
    component: JurySelectionComponent,
  },
  {
    path: 'case/:caseId/jury-placement',
    title: 'Jury Placement',
    component: JuryPlacementComponent,
  },
  {
    path: 'case/:caseId/evidence',
    title: 'Evidence',
    component: EvidenceComponent,
  },
];
