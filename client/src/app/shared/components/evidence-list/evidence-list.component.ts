import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Exhibit } from '../../models/exhibit';
import { ExhibitCardComponent } from '../exhibit-card/exhibit-card.component';

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [ExhibitCardComponent, MatButtonModule],
  templateUrl: './evidence-list.component.html',
  styleUrl: './evidence-list.component.scss',
})
export class EvidenceListComponent {
  @Input({ required: true }) exhibits: Exhibit[];
  @Input({ required: true }) isDefendant: boolean;
  @Output() add = new EventEmitter<boolean>();
  @Output() exhibitSelected = new EventEmitter<Exhibit>();

  get icon(): string {
    return this.isDefendant ? 'Δ' : 'π';
  }

  addExhibit() {
    this.add.emit(this.isDefendant);
  }

  exhibitClicked(exhibit: Exhibit) {
    this.exhibitSelected.emit(exhibit);
  }
}
