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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject, takeUntil } from 'rxjs';
import { JurorCardComponent } from '../shared/components/juror-card/juror-card.component';
import { JurorEditComponent } from '../shared/components/juror-edit/juror-edit.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Juror } from '../shared/models/juror';
import { JuryData } from '../shared/models/jury-data';
import { TrialDetails } from '../shared/models/trial-details';
import { ResizableDirective } from '../shared/resizable.directive';
import { JurorService } from '../shared/services/juror.service';
import { StorageService } from '../shared/services/storage.service';
import { TrialService } from '../shared/services/trial.service';

@Component({
  selector: 'app-jury-selection',
  standalone: true,
  imports: [
    DragDropModule,
    JurorCardComponent,
    LoadingComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
  currentTrial: TrialDetails | undefined | null = null;
  notifier$ = new Subject();

  loadingTrial = false;
  loadingJurors = true;
  get loading(): boolean {
    return this.loadingTrial || this.loadingJurors;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private $TrialService: TrialService,
    private $JurorService: JurorService,
    private $StorageService: StorageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.notifier$))
      .subscribe((params) => {
        let trialId = params['trialId'];
        this.location.replaceState(`trial/${trialId}/jury-selection`);
        this.$JurorService.getJurorsOfTrial(trialId).subscribe((res) => {
          this.data = res.juryData;
          this.loadingJurors = false;
        });
      });
    this.$TrialService.loadingTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingTrial) => (this.loadingTrial = loadingTrial));
    this.$TrialService.currentTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((currentTrial) => (this.currentTrial = currentTrial));
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  private saveTrial() {
    if (!this.currentTrial) return;
    this.$StorageService.saveData(
      LocalStorageKeys.currentTrial,
      JSON.stringify(this.currentTrial)
    );
    this.$TrialService.currentTrial$.next(this.currentTrial);
    this.$TrialService.updateTrial(this.currentTrial).subscribe();
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
      trialId: this.currentTrial?.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  createRange(num: number) {
    return new Array(num).fill(0).map((n, index) => index + 1);
  }

  addTotalStrike(amount: number = 1) {
    if (!this.currentTrial) return;
    // Minimum of 1 and don't allow lower than other strikes
    this.currentTrial.strikes.total = Math.max(
      this.currentTrial.strikes.total + amount,
      this.currentTrial.strikes.defendant,
      this.currentTrial.strikes.plaintiff,
      1
    );
    this.saveTrial();
  }

  addDefendantStrike(amount: number = 1) {
    if (!this.currentTrial) return;
    // Set within 0 and total strikes
    this.currentTrial.strikes.defendant = Math.min(
      Math.max(this.currentTrial.strikes.defendant + amount, 0),
      this.currentTrial.strikes.total
    );
    this.saveTrial();
  }

  addPlaintiffStrike(amount: number = 1) {
    if (!this.currentTrial) return;
    // Set within 0 and total strikes
    this.currentTrial.strikes.plaintiff = Math.min(
      Math.max(this.currentTrial.strikes.plaintiff + amount, 0),
      this.currentTrial.strikes.total
    );
    this.saveTrial();
  }

  addJuror() {
    let juror: Juror = <Juror>{
      id: crypto.randomUUID(),
      trialId: this.currentTrial?.id,
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
