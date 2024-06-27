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
import { JurorCardComponent } from '../../components/juror-card/juror-card.component';
import { JurorEditComponent } from '../../components/juror-edit/juror-edit.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';
import { Juror } from '../../models/juror';
import { JuryData } from '../../models/jury-data';
import { TrialDetails } from '../../models/trial-details';
import { JurorService } from '../../services/juror.service';
import { TrialService } from '../../services/trial.service';
import { ResizableDirective } from '../../util/resizable.directive';

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
  trial: TrialDetails | undefined | null = null;
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
    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => (this.trial = trial));
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  private saveTrial() {
    if (!this.trial) return;
    this.$TrialService.trial$.next(this.trial);
    this.$TrialService.updateTrial(this.trial).subscribe();
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
      trialId: this.trial?.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  createRange(num: number) {
    return new Array(num).fill(0).map((n, index) => index + 1);
  }

  addTotalStrike(amount: number = 1) {
    if (!this.trial) return;
    // Minimum of 1 and don't allow lower than other strikes
    this.trial.strikes.total = Math.max(
      this.trial.strikes.total + amount,
      this.trial.strikes.defendant,
      this.trial.strikes.plaintiff,
      1
    );
    this.saveTrial();
  }

  addDefendantStrike(amount: number = 1) {
    if (!this.trial) return;
    // Set within 0 and total strikes
    this.trial.strikes.defendant = Math.min(
      Math.max(this.trial.strikes.defendant + amount, 0),
      this.trial.strikes.total
    );
    this.saveTrial();
  }

  addPlaintiffStrike(amount: number = 1) {
    if (!this.trial) return;
    // Set within 0 and total strikes
    this.trial.strikes.plaintiff = Math.min(
      Math.max(this.trial.strikes.plaintiff + amount, 0),
      this.trial.strikes.total
    );
    this.saveTrial();
  }

  addJuror() {
    let juror: Juror = <Juror>{
      id: crypto.randomUUID(),
      trialId: this.trial?.id,
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
