import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
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
  currentCase: CaseSummary | null;
  cases: CaseSummary[] = [];

  constructor(
    private $CaseService: CaseService,
    private $StorageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadSelectedCase();
    this.loadCases();
  }

  loadSelectedCase() {
    let data = this.$StorageService.getData(LocalStorageKeys.currentCase);
    this.currentCase = data ? JSON.parse(data) : null;
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
    this.currentCase = currentCase;
    this.$StorageService.saveData(
      LocalStorageKeys.currentCase,
      JSON.stringify(currentCase)
    );
  }

  addCase() {}
}
