import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { Steps } from './shared/config/steps';
import { CurrentStep } from './shared/models/current-step';
import { StepService } from './shared/services/step.service';
import { StorageService } from './shared/services/storage.service';

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
export class AppComponent implements OnInit, OnDestroy {
  themes: string[] = ['dark-theme', 'light-theme'];
  useDarkTheme = true;
  notifier$ = new Subject();
  routerTitleSub: Subscription;

  steps = Steps;
  currentStep: CurrentStep | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document,
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
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.notifier$),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        var route = this.getChild(this.activatedRoute);
        if (this.routerTitleSub) this.routerTitleSub.unsubscribe();
        this.routerTitleSub = route.title
          .pipe(takeUntil(this.notifier$))
          .subscribe(
            (t) => (this.currentStep = this.$StepService.getCurrentStep(t))
          );
      });
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  private setThemeByUserPreference() {
    var darkMode =
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
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear all data',
        message: 'Are you sure you want to clear all data?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes') {
        this.$StorageService.clearData();
        var url = this.router.url;
        this.router
          .navigateByUrl('refresh', { skipLocationChange: true })
          .then(() => this.router.navigateByUrl(url));
      }
    });
  }
}
