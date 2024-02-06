import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Juror } from '../models/juror';

@Component({
  selector: 'app-jury-card',
  standalone: true,
  template: ` <p>{{ juror.firstName }} {{ juror.lastName }}</p> `,
  styleUrl: './juror-card.component.scss',
})
export class JurorCardComponent {
  @Input({ required: true }) juror: Juror;
  @Output() clicked = new EventEmitter<Juror>();

  @HostListener('click') onClick() {
    this.clicked.emit(this.juror);
  }
}
