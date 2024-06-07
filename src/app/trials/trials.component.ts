import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { TrialAddComponent } from '../shared/components/trial-add/trial-add.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Steps } from '../shared/config/steps';
import { Step } from '../shared/models/step';
import { TrialDetails } from '../shared/models/trial-details';
import { TrialSummary } from '../shared/models/trial-summary';
import { StorageService } from '../shared/services/storage.service';
import { TrialService } from '../shared/services/trial.service';

@Component({
  selector: 'app-trials',
  standalone: true,
  imports: [
    LoadingComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SecondToolbarComponent,
  ],
  templateUrl: './trials.component.html',
  styleUrl: './trials.component.scss',
})
export class TrialsComponent implements OnInit {
  notifier$ = new Subject();
  trial: TrialDetails | undefined | null;
  trials: TrialSummary[] = [];
  firstStep: Step = Steps[0];

  loadingTrials = false;
  loadingTrial = false;
  get loading(): boolean {
    return this.loadingTrial || this.loadingTrials;
  }

  constructor(
    private $TrialService: TrialService,
    private $StorageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => (this.trial = trial));
    this.$TrialService.loadingTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingTrial) => (this.loadingTrial = loadingTrial));
    this.loadTrials();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  saveSelectedTrial() {
    this.trial = JSON.parse(
      this.$StorageService.getData(LocalStorageKeys.trial)
    );
  }

  loadTrials() {
    this.loadingTrials = true;
    this.$TrialService.getTrials().subscribe((data) => {
      this.trials = data?.trialSummaries ?? [];
      this.loadingTrials = false;
    });
  }

  selectTrialSummary(trial: TrialSummary) {
    this.$TrialService.getTrial(trial.id).subscribe((res) => {
      this.selectTrial(res.trialDetails);
    });
  }

  selectTrial(trial: TrialDetails) {
    this.$TrialService.trial$.next(trial);
    this.$StorageService.saveData(
      LocalStorageKeys.trial,
      JSON.stringify(trial)
    );
    this.router.navigate(['trial', trial.id]);
  }

  addTrial() {
    // TODO: Store and use strike defaults when creating trials
    let trial: TrialDetails = <TrialDetails>{
      id: crypto.randomUUID(),
      name: '',
      strikes: {
        total: 3,
        defendant: 0,
        plaintiff: 0,
      },
    };
    let dialogRef = this.openEditDialog(trial, true);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: TrialDetails) => {
        if (res && res.name) {
          this.trials.push(res);
          this.$TrialService.addTrial(res).subscribe();
          this.selectTrial(res);
        }
      });
  }

  private openEditDialog(
    trial: TrialDetails,
    addMode: boolean = false
  ): MatDialogRef<TrialAddComponent, any> {
    return this.dialog.open(TrialAddComponent, {
      data: { trial: trial, addMode },
      minWidth: '70%',
    });
  }
}
