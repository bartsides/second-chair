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
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Juror } from '../shared/models/juror';
import { JurySelectionData } from '../shared/models/jury-selection-data';
import { ResizableDirective } from '../shared/resizable.directive';
import { StorageService } from '../shared/services/storage.service';

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
  data: JurySelectionData = new JurySelectionData();

  constructor(
    public dialog: MatDialog,
    public $StorageService: StorageService
  ) {
    this.loadData();
  }

  private loadData() {
    var data = this.$StorageService.getData(LocalStorageKeys.jurySelection);
    if (data) this.data = JSON.parse(data);
  }

  private saveData() {
    this.$StorageService.saveData(
      LocalStorageKeys.jurySelection,
      JSON.stringify(this.data)
    );
  }

  fakeData() {
    for (var i = 0; i < 8; i++) {
      this.data.pool.push(this.generateJuror());
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
    this.data.totalStrikes = Math.max(
      this.data.totalStrikes + amount,
      1,
      this.data.defendantStrikes,
      this.data.plaintiffStrikes
    );
    this.saveData();
  }

  addDefendantStrike(amount: number = 1) {
    // Set within 0 and total strikes
    this.data.defendantStrikes = Math.min(
      Math.max(this.data.defendantStrikes + amount, 0),
      this.data.totalStrikes
    );
    this.saveData();
  }

  addPlaintiffStrike(amount: number = 1) {
    // Set within 0 and total strikes
    this.data.plaintiffStrikes = Math.min(
      Math.max(this.data.plaintiffStrikes + amount, 0),
      this.data.totalStrikes
    );
    this.saveData();
  }

  addJuror() {
    var juror: Juror = <Juror>{};
    var dialogRef = this.dialog.open(JurorEditComponent, {
      data: { juror, addMode: true },
      minWidth: '70%',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && (res.firstName || res.lastName)) {
        this.data.pool.push(res);
        this.saveData();
      }
    });
  }

  jurorClicked(juror: Juror) {
    this.dialog.open(JurorEditComponent, {
      data: { juror },
    });
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
    this.saveData();
  }

  private resetJurorNumbers() {
    for (var i = 0; i < this.data.selected.length; i++) {
      this.data.selected[i].number = i + 1;
    }
    for (var juror of this.data.pool) {
      juror.number = 0;
    }
    for (var juror of this.data.notSelected) {
      juror.number = 0;
    }
  }
}
