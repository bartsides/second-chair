import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { CaseDetails } from '../shared/models/case-details';
import { CaseSummary } from '../shared/models/case-summary';
import { CaseService } from '../shared/services/case.service';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent implements OnInit {
  notifier$ = new Subject();
  currentCase: CaseDetails | undefined | null;
  cases: CaseSummary[] = [];

  constructor(
    private $CaseService: CaseService,
    private $StorageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.$CaseService.currentCase$
      .pipe(takeUntil(this.notifier$))
      .subscribe((currentCase) => (this.currentCase = currentCase));
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
    this.$CaseService.getCases().subscribe((data) => {
      this.cases = data?.caseSummaries ?? [];
    });
  }

  selectCase(currentCase: CaseSummary) {
    this.$CaseService.getCase(currentCase.id).subscribe((res) => {
      this.currentCase = res.caseDetails;
      this.$CaseService.currentCase$.next(this.currentCase);
      this.$StorageService.saveData(
        LocalStorageKeys.currentCase,
        JSON.stringify(this.currentCase)
      );
      this.router.navigate(['case', currentCase.id]);
    });
  }

  addCase() {}
}
