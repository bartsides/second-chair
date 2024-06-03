import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject, takeUntil } from 'rxjs';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { CaseDetails } from '../shared/models/case-details';
import { Juror } from '../shared/models/juror';
import { JuryData } from '../shared/models/jury-data';
import { ResizableDirective } from '../shared/resizable.directive';
import { CaseService } from '../shared/services/case.service';
import { JurorService } from '../shared/services/juror.service';
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
  currentCase: CaseDetails | undefined | null = null;
  notifier$ = new Subject();

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public $CaseService: CaseService,
    public $JurorService: JurorService,
    public $StorageService: StorageService,
    public route: ActivatedRoute,
    public location: Location
  ) {}

  ngOnInit(): void {
    // TODO: Add loading handling and symbol
    this.activatedRoute.params
      .pipe(takeUntil(this.notifier$))
      .subscribe((params) => {
        let caseId = params['caseId'];
        this.location.replaceState(`case/${caseId}/jury-selection`);
        this.$JurorService
          .getJurorsOfCase(caseId)
          .subscribe((res) => (this.data = res.juryData));
      });
    this.$CaseService.currentCase$
      .pipe(takeUntil(this.notifier$))
      .subscribe((currentCase) => (this.currentCase = currentCase));
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  private saveCase() {
    if (!this.currentCase) return;
    this.$StorageService.saveData(
      LocalStorageKeys.currentCase,
      JSON.stringify(this.currentCase)
    );
    this.$CaseService.currentCase$.next(this.currentCase);
    this.$CaseService.updateCase(this.currentCase).subscribe();
  }

  fakeData() {
    for (let i = 0; i < 8; i++) {
      let juror = this.generateJuror();
      this.data.pool.push(juror);
      this.$JurorService.addJuror(juror).subscribe();
    }
  }

  generateJuror(): Juror {
    return <Juror>{
      id: crypto.randomUUID(),
      caseId: this.currentCase?.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  createRange(num: number) {
    return new Array(num).fill(0).map((n, index) => index + 1);
  }

  addTotalStrike(amount: number = 1) {
    if (!this.currentCase) return;
    // Minimum of 1 and don't allow lower than other strikes
    this.currentCase.strikes.total = Math.max(
      this.currentCase.strikes.total + amount,
      1,
      this.currentCase.strikes.defendant,
      this.currentCase.strikes.plaintiff
    );
    this.saveCase();
  }

  addDefendantStrike(amount: number = 1) {
    if (!this.currentCase) return;
    // Set within 0 and total strikes
    this.currentCase.strikes.defendant = Math.min(
      Math.max(this.currentCase.strikes.defendant + amount, 0),
      this.currentCase.strikes.total
    );
    this.saveCase();
  }

  addPlaintiffStrike(amount: number = 1) {
    if (!this.currentCase) return;
    // Set within 0 and total strikes
    this.currentCase.strikes.plaintiff = Math.min(
      Math.max(this.currentCase.strikes.plaintiff + amount, 0),
      this.currentCase.strikes.total
    );
    this.saveCase();
  }

  addJuror() {
    let juror: Juror = <Juror>{
      id: crypto.randomUUID(),
      caseId: this.currentCase?.id,
      selected: 'pool',
    };
    let dialogRef = this.openEditDialog(juror, true);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: Juror) => {
        if (res && (res.firstName || res.lastName)) {
          this.data.pool.push(res);
          this.$JurorService.addJuror(juror).subscribe();
        }
      });
  }

  saveJuror(juror: Juror) {
    this.$JurorService.updateJuror(juror).subscribe();
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
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => {
        this.saveJuror(juror);
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

      switch (event.container.id) {
        case 'juror-pool':
          juror.selected = 'pool';
          break;
        case 'selected-jurors':
          juror.selected = 'selected';
          break;
        case 'not-selected-jurors':
          juror.selected = 'not selected';
          break;
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

      this.saveJuror(juror);
    }
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
