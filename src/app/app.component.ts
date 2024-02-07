import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { faker } from '@faker-js/faker';
import { JurorCardComponent } from './juror-card/juror-card.component';
import { JurorEditComponent } from './juror-edit/juror-edit.component';
import { Juror } from './models/juror';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DragDropModule,
    JurorCardComponent,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jury-select';
  modes = ['Selection', 'Trial'];
  mode = this.modes[0];
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
      stoplight: 'yellow',
    };
  }

  changeMode(mode: string) {
    this.mode = mode;
  }

  jurorClicked(juror: Juror) {
    this.dialog.open(JurorEditComponent, { data: { juror }, minWidth: '70%' });
  }

  drop(event: CdkDragDrop<Juror[]>) {
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
