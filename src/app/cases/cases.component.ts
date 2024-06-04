import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CaseEditComponent } from '../shared/components/case-edit/case-edit.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { Steps } from '../shared/config/steps';
import { CaseDetails } from '../shared/models/case-details';
import { CaseSummary } from '../shared/models/case-summary';
import { Step } from '../shared/models/step';
import { CaseService } from '../shared/services/case.service';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [
    LoadingComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SecondToolbarComponent,
  ],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent implements OnInit {
  notifier$ = new Subject();
  currentCase: CaseDetails | undefined | null;
  cases: CaseSummary[] = [];
  firstStep: Step = Steps[0];

  loadingCases = false;
  loadingCase = false;
  get loading(): boolean {
    return this.loadingCase || this.loadingCases;
  }

  constructor(
    private $CaseService: CaseService,
    private $StorageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.$CaseService.currentCase$
      .pipe(takeUntil(this.notifier$))
      .subscribe((currentCase) => (this.currentCase = currentCase));
    this.$CaseService.loadingCase$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingCase) => (this.loadingCase = loadingCase));
    this.loadCases();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  saveSelectedCase() {
    this.currentCase = JSON.parse(
      this.$StorageService.getData(LocalStorageKeys.currentCase)
    );
  }

  loadCases() {
    this.loadingCases = true;
    this.$CaseService.getCases().subscribe((data) => {
      this.cases = data?.caseSummaries ?? [];
      this.loadingCases = false;
    });
  }

  selectCaseSummary(currentCase: CaseSummary) {
    this.$CaseService.getCase(currentCase.id).subscribe((res) => {
      this.selectCase(res.caseDetails);
    });
  }

  selectCase(currentCase: CaseDetails) {
    this.$CaseService.currentCase$.next(currentCase);
    this.$StorageService.saveData(
      LocalStorageKeys.currentCase,
      JSON.stringify(currentCase)
    );
    this.router.navigate(['case', currentCase.id]);
  }

  addCase() {
    // TODO: Store and use strike defaults when creating cases
    let caseDetails: CaseDetails = <CaseDetails>{
      id: crypto.randomUUID(),
      name: '',
      strikes: {
        total: 3,
        defendant: 0,
        plaintiff: 0,
      },
    };
    let dialogRef = this.openEditDialog(caseDetails, true);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: CaseDetails) => {
        if (res && res.name) {
          this.cases.push(res);
          this.$CaseService.addCase(res).subscribe();
          this.selectCase(res);
        }
      });
  }

  private openEditDialog(
    caseDetails: CaseDetails,
    addMode: boolean = false
  ): MatDialogRef<CaseEditComponent, any> {
    return this.dialog.open(CaseEditComponent, {
      data: { case: caseDetails, addMode },
      minWidth: '70%',
    });
  }
}
