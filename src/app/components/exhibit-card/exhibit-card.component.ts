import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exhibit } from '../../models/exhibit';

@Component({
  selector: 'app-exhibit-card',
  standalone: true,
  imports: [],
  templateUrl: './exhibit-card.component.html',
  styleUrl: './exhibit-card.component.scss',
})
export class ExhibitCardComponent {
  @Input({ required: true }) exhibit: Exhibit;
  @Output() clicked = new EventEmitter<Exhibit>();

  click() {
    this.clicked.emit(this.exhibit);
  }
}
