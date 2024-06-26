import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';
import { TrialAddComponent } from '../../components/trial-add/trial-add.component';
import { Steps } from '../../config/steps';
import { Step } from '../../models/step';
import { TrialDetails } from '../../models/trial-details';
import { TrialSummary } from '../../models/trial-summary';
import { TrialService } from '../../services/trial.service';

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

  loadTrials() {
    this.loadingTrials = true;
    this.$TrialService.getTrials().subscribe({
      next: (data) => {
        this.trials = data?.trialSummaries ?? [];
        this.loadingTrials = false;
      },
      error: (err) => console.error(err),
    });
  }

  selectTrialSummary(trial: TrialSummary) {
    this.$TrialService.getTrial(trial.id).subscribe({
      next: (res) => {
        this.selectTrial(res.trialDetails);
      },
      error: (err) => console.error(err),
    });
  }

  selectTrial(trial: TrialDetails) {
    this.$TrialService.trial$.next(trial);
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
      .subscribe({
        next: (res: TrialDetails) => {
          if (res && res.name) {
            this.trials.push(res);
            this.$TrialService
              .addTrial(res)
              .subscribe({ error: (err) => console.error(err) });
            this.selectTrial(res);
          }
        },
        error: (err) => console.error(err),
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
