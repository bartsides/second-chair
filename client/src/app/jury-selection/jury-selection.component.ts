import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject } from 'rxjs';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Juror } from '../shared/models/juror';
import { JuryData } from '../shared/models/jury-data';
import { ResizableDirective } from '../shared/resizable.directive';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-jury-selection',
  standalone: true,
  imports: [
    DragDropModule,
    JurorCardComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatToolbarModule,
    ResizableDirective,
    RouterModule,
    SecondToolbarComponent,
  ],
  templateUrl: './jury-selection.component.html',
  styleUrl: './jury-selection.component.scss',
})
export class JurySelectionComponent implements OnInit, OnDestroy {
  private dragging: boolean;
  data: JuryData = new JuryData();
  notifier$ = new Subject();

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public $StorageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  private loadData() {
    let data = this.$StorageService.getData(LocalStorageKeys.jury);
    if (data) this.data = JSON.parse(data);
  }

  private saveData() {
    this.$StorageService.saveData(
      LocalStorageKeys.jury,
      JSON.stringify(this.data)
    );
  }

  fakeData() {
    for (let i = 0; i < 8; i++) {
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
    let juror: Juror = <Juror>{};
    let dialogRef = this.openEditDialog(juror, true);
    dialogRef.afterClosed().subscribe((res: Juror) => {
      if (res && (res.firstName || res.lastName)) {
        this.data.pool.push(res);
        this.saveData();
      }
    });
  }

  dragStarted() {
    this.dragging = true;
  }

  jurorClicked(juror: Juror) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    let dialogRef = this.openEditDialog(juror);
    dialogRef.afterClosed().subscribe(() => {
      this.saveData();
    });
  }

  private openEditDialog(
    juror: Juror,
    addMode: boolean = false
  ): MatDialogRef<JurorEditComponent, any> {
    return this.dialog.open(JurorEditComponent, {
      data: { juror, addMode: addMode },
      minWidth: '70%',
    });
  }

  drop(event: CdkDragDrop<Juror[]>) {
    if (event.previousContainer === event.container) {
      // Reorder items within the same list
      if (event.container.id == 'selected-jurors') return;
      // Move to front
      moveItemInArray(event.container.data, event.previousIndex, 0);
    } else {
      // Move items between lists

      // Manually find index as wrapped drag and drop lists produce off results
      let previousIndex = 0;
      for (let i = 0; i < event.previousContainer.data.length; i++) {
        if (event.previousContainer.data[i] == event.item.data) {
          previousIndex = i;
          break;
        }
      }

      let index = 0;
      let juror = event.previousContainer.data[previousIndex];
      let movingToSelected = event.container.id == 'selected-jurors';
      if (movingToSelected) {
        index = event.container.data.length;
        juror.number = this.getNextJurorNumber();
      } else {
        juror.number = 0;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        index
      );
      if (movingToSelected) {
        this.data.selected.sort((a, b) => a.number - b.number);
      }
    }
    this.saveData();
  }

  private getNextJurorNumber(): number {
    let jurorNumber = 1;

    for (let juror of this.data.selected) {
      if (juror.number > jurorNumber) {
        return jurorNumber;
      }
      jurorNumber++;
    }

    return jurorNumber;
  }
}
