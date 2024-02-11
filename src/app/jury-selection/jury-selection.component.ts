import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { faker } from '@faker-js/faker';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
import { Juror } from '../shared/models/juror';
import { ResizableDirective } from '../shared/resizable.directive';

@Component({
  selector: 'app-jury-selection',
  standalone: true,
  imports: [
    DragDropModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    JurorCardComponent,
    ResizableDirective,
  ],
  templateUrl: './jury-selection.component.html',
  styleUrl: './jury-selection.component.scss',
})
export class JurySelectionComponent {
  totalStrikes = 3;
  plaintiffStrikes = 0;
  defendantStrikes = 0;
  pool: Juror[] = [];
  selected: Juror[] = [];
  notSelected: Juror[] = [];

  constructor(public dialog: MatDialog) {
    this.fakeData();
  }

  fakeData() {
    for (var i = 0; i < 8; i++) {
      this.pool.push(this.generateJuror());
    }
  }

  generateJuror(): Juror {
    return <Juror>{
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  createRange(num: number) {
    return new Array(num).fill(0).map((n, index) => index + 1);
  }

  addTotalStrike(amount: number = 1) {
    // Minimum of 1 and don't allow lower than other strikes
    this.totalStrikes = Math.max(
      this.totalStrikes + amount,
      1,
      this.defendantStrikes,
      this.plaintiffStrikes
    );
  }

  addDefendantStrike(amount: number = 1) {
    // Set within 0 and total strikes
    this.defendantStrikes = Math.min(
      Math.max(this.defendantStrikes + amount, 0),
      this.totalStrikes
    );
  }

  addPlaintiffStrike(amount: number = 1) {
    // Set within 0 and total strikes
    this.plaintiffStrikes = Math.min(
      Math.max(this.plaintiffStrikes + amount, 0),
      this.totalStrikes
    );
  }

  jurorClicked(juror: Juror) {
    this.dialog.open(JurorEditComponent, { data: { juror }, minWidth: '70%' });
  }

  drop(event: CdkDragDrop<Juror[]>) {
    // TODO: Fix bug where if multiple rows of jurors, selecting the second card actually selected the third
    if (event.previousContainer === event.container) {
      // Reorder items within the same list
      if (event.container.id == 'selected-jurors') return;
      // Move to front
      moveItemInArray(event.container.data, event.previousIndex, 0);
    } else {
      // Move items between lists
      var index = 0;
      if (event.container.id == 'selected-jurors') {
        index = event.container.data.length;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        index
      );
      this.resetJurorNumbers();
    }
  }

  private resetJurorNumbers() {
    for (var i = 0; i < this.selected.length; i++) {
      this.selected[i].number = i + 1;
    }
    for (var juror of this.pool) {
      juror.number = 0;
    }
    for (var juror of this.notSelected) {
      juror.number = 0;
    }
  }
}
