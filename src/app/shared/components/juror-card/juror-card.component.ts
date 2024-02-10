import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { Juror } from '../../models/juror';

@Component({
  selector: 'app-jury-card',
  standalone: true,
  imports: [MatCardModule, MatRippleModule],
  templateUrl: './juror-card.component.html',
  styleUrl: './juror-card.component.scss',
})
export class JurorCardComponent {
  @Input({ required: true }) juror: Juror;
  @Output() clicked = new EventEmitter<Juror>();

  onClick() {
    this.clicked.emit(this.juror);
  }
}
