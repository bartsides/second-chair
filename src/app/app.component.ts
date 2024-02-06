import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faker } from '@faker-js/faker';
import { Juror } from './models/juror';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { JurorCardComponent } from './juror-card/juror-card.component';
import { JurorEditComponent } from './juror-edit/juror-edit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DragDropModule, JurorCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jury-select';
  pool: Juror[] = [];
  selected: Juror[] = [];
  rejected: Juror[] = [];

  constructor(public dialog: MatDialog) {
    this.fakeData();
  }

  fakeData() {
    for (var i = 0; i < 20; i++) {
      this.pool.push(this.generateJuror());
    }
    for (var i = 0; i < 4; i++) {
      this.selected.push(this.generateJuror());
    }
  }

  generateJuror(): Juror {
    return <Juror>{
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  jurorClicked(juror: Juror) {
    console.log('juror clicked', juror);
    const dialogRef = this.dialog.open(JurorEditComponent, { data: { juror } });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog closed', res);
    });
  }

  drop(event: CdkDragDrop<Juror[]>) {
    if (event.previousContainer === event.container) {
      // Reorder items within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // TODO: Move juror to end of list
      // Move items between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
