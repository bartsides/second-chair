import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageKeys } from './shared/config/local-storage-keys';
import { Steps } from './shared/config/steps';
import { CurrentStep } from './shared/models/current-step';
import { TrialDetails } from './shared/models/trial-details';
import { StepService } from './shared/services/step.service';
import { StorageService } from './shared/services/storage.service';
import { TrialService } from './shared/services/trial.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  themes: string[] = ['dark-theme', 'light-theme'];
  useDarkTheme = true;
  notifier$ = new Subject();
  routerTitleSub: Subscription;

  steps = Steps;
  currentStep: CurrentStep | undefined;
  currentTrial: TrialDetails | undefined | null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private $TrialService: TrialService,
    private $StorageService: StorageService,
    private $StepService: StepService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.setThemeByUserPreference();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        this.setThemeByUserPreference();
      });

    this.$TrialService.currentTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((currentTrial) => (this.currentTrial = currentTrial));

    this.router.events.pipe(takeUntil(this.notifier$)).subscribe((e) => {
      if (e instanceof ActivationEnd) this.handleActivationEnd(e);
      else if (e instanceof NavigationEnd) this.handleNavigationEnd(e);
    });
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  handleActivationEnd(e: ActivationEnd) {
    // Get trial details
    let trialId = e.snapshot.params['trialId'];

    this.$TrialService.loadingTrial$.next(true);
    let trial = this.$StorageService.getData(LocalStorageKeys.currentTrial);
    if (trial) {
      let currentTrial = JSON.parse(trial);
      if (!trialId || currentTrial?.id == trialId) {
        this.$TrialService.currentTrial$.next(currentTrial);
        this.$TrialService.loadingTrial$.next(false);
        return;
      }
    }

    if (!trialId) {
      this.$TrialService.loadingTrial$.next(false);
      return;
    }

    this.$TrialService
      .getTrial(trialId)
      .pipe(takeUntil(this.notifier$))
      .subscribe((res) => {
        this.$StorageService.saveData(
          LocalStorageKeys.currentTrial,
          JSON.stringify(res.trialDetails)
        );
        this.$TrialService.currentTrial$.next(res.trialDetails);
        this.$TrialService.loadingTrial$.next(false);
      });
  }

  handleNavigationEnd(e: NavigationEnd) {
    // Track changing steps
    let route = this.getChild(this.activatedRoute);
    if (this.routerTitleSub) this.routerTitleSub.unsubscribe();
    this.routerTitleSub = route.title
      .pipe(takeUntil(this.notifier$))
      .subscribe(
        (t) => (this.currentStep = this.$StepService.getCurrentStep(t))
      );
  }

  getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    return activatedRoute.firstChild
      ? this.getChild(activatedRoute.firstChild)
      : activatedRoute;
  }

  private setThemeByUserPreference() {
    let darkMode =
      !window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme(this.themes[darkMode ? 0 : 1]);
  }

  setTheme(theme: string) {
    this.useDarkTheme = theme == this.themes[0];
    this.document.body.classList.add(theme);
    this.document.body.classList.remove(
      this.useDarkTheme ? this.themes[1] : this.themes[0]
    );
  }

  clearData() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear all data',
        message: 'Are you sure you want to clear all data?',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res) => {
        if (res === 'Yes') {
          this.$StorageService.clearData();
          let url = this.router.url;
          this.router
            .navigateByUrl('refresh', { skipLocationChange: true })
            .then(() => this.router.navigateByUrl(url));
        }
      });
  }
}
