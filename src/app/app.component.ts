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
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LocalStorageKeys } from './config/local-storage-keys';
import { Steps } from './config/steps';
import { CurrentStep } from './models/current-step';
import { TrialDetails } from './models/trial-details';
import { UserProfile } from './models/user-profile';
import { AuthService } from './services/auth.service';
import { StepService } from './services/step.service';
import { StorageService } from './services/storage.service';
import { TrialService } from './services/trial.service';
import { UserService } from './services/user.service';

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
  trial: TrialDetails | undefined | null;
  isAuthenticated = false;
  userProfile: UserProfile | null;

  get canAccessFirms(): boolean {
    return (
      this.isAuthenticated &&
      !!this.userProfile &&
      !!this.userProfile.firstName &&
      !!this.userProfile.lastName
    );
  }

  get canAccessTrials(): boolean {
    return !!this.userProfile?.currentFirm;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private $AuthService: AuthService,
    private $TrialService: TrialService,
    private $StorageService: StorageService,
    private $StepService: StepService,
    private $UserService: UserService
  ) {
    this.setThemeByUserPreference();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        this.setThemeByUserPreference();
      });

    this.$AuthService.isAuthenticated$
      .pipe(takeUntil(this.notifier$))
      .subscribe((val) => (this.isAuthenticated = val));

    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => (this.trial = trial));

    this.router.events.pipe(takeUntil(this.notifier$)).subscribe((e) => {
      if (e instanceof ActivationEnd) this.handleActivationEnd(e);
      else if (e instanceof NavigationEnd) this.handleNavigationEnd(e);
    });

    this.$UserService.user$
      .pipe(takeUntil(this.notifier$))
      .subscribe((userProfile) => (this.userProfile = userProfile));
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  handleActivationEnd(e: ActivationEnd) {
    // Get trial details
    this.$TrialService.loadingTrial$.next(true);
    let trialId = e.snapshot.params['trialId'];
    let data = this.$StorageService.getData(LocalStorageKeys.trial);
    if (data) {
      let trial = JSON.parse(data);
      if (!trialId || trial?.id == trialId) {
        this.$TrialService.trial$.next(trial);
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
          LocalStorageKeys.trial,
          JSON.stringify(res.trialDetails)
        );
        this.$TrialService.trial$.next(res.trialDetails);
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

  logout() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: 'Are you sure you want to logout?',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res) => {
        if (res === 'Yes') {
          this.$AuthService.logout();
        }
      });
  }
}
