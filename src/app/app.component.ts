import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Juror } from './models/juror';
import { faker } from '@faker-js/faker';
import { JuryCardComponent } from './jury-card/jury-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DragDropModule, JuryCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jury-select';
  pool: Juror[] = []
  selected: Juror[] = []
  rejected: Juror[] = []

  constructor() {
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
      lastName: faker.person.lastName()
    };
  }

  drop(event: CdkDragDrop<Juror[]>) {
    console.log(event.previousContainer, ' ', event.container);
    if (event.previousContainer === event.container) {
      console.log('reorder ', event);
      // Reorder items within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('transfer ', event);
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
