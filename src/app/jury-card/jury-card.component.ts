import { Component, Input } from '@angular/core';
import { Juror } from '../models/juror';

@Component({
  selector: 'app-jury-card',
  standalone: true,
  imports: [],
  template: `
    <p>{{ juror.firstName }} {{ juror.lastName }}</p>
  `,
  styleUrl: './jury-card.component.scss'
})
export class JuryCardComponent {
  @Input({ required: true }) juror: Juror;
}
