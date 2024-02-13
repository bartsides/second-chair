import { Routes } from '@angular/router';
import { JurySelectionComponent } from './jury-selection/jury-selection.component';

export const routes: Routes = [
  { path: '', component: JurySelectionComponent },
  { path: 'refresh', component: JurySelectionComponent },
  { path: 'jury-selection', component: JurySelectionComponent },
];
