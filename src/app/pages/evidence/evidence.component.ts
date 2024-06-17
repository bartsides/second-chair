import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject, takeUntil, tap } from 'rxjs';
import { EvidenceListComponent } from '../../components/evidence-list/evidence-list.component';
import { ExhibitCardComponent } from '../../components/exhibit-card/exhibit-card.component';
import { ExhibitEditComponent } from '../../components/exhibit-edit/exhibit-edit.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SecondToolbarComponent } from '../../components/second-toolbar/second-toolbar.component';
import { EvidenceData } from '../../models/evidence-data';
import { Exhibit } from '../../models/exhibit';
import { TrialDetails } from '../../models/trial-details';
import { ExhibitService } from '../../services/exhibit.service';
import { TrialService } from '../../services/trial.service';
import { Util } from '../../util/util';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [
    EvidenceListComponent,
    ExhibitCardComponent,
    ExhibitEditComponent,
    FormsModule,
    LoadingComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SecondToolbarComponent,
  ],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss',
})
export class EvidenceComponent implements OnInit, OnDestroy {
  trial: TrialDetails | undefined | null = null;
  notifier$ = new Subject();

  filter$ = new Subject<string>();
  searchFilter: string = '';
  data: EvidenceData = new EvidenceData();
  filteredData: EvidenceData;
  evidenceSearchControl = new FormControl();

  loadingExhibits = false;
  loadingTrial = false;
  get loading() {
    return this.loadingExhibits || this.loadingTrial;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private $ExhibitService: ExhibitService,
    private $TrialService: TrialService
  ) {
    this.filteredData = new EvidenceData();
    this.filter$
      .pipe(takeUntil(this.notifier$))
      .subscribe((val) => this.filterData(val));
  }

  ngOnInit(): void {
    this.$TrialService.loadingTrial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((loadingTrial) => (this.loadingTrial = loadingTrial));
    this.$TrialService.trial$
      .pipe(takeUntil(this.notifier$))
      .subscribe((trial) => {
        this.trial = trial;
        this.loadData();
      });
    this.evidenceSearchControl.valueChanges
      .pipe(
        takeUntil(this.notifier$),
        tap((val) => (this.searchFilter = val))
      )
      .subscribe((val) => {
        this.filter$.next(val);
      });
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    let fakeCount = 6;
    for (let i = 0; i < fakeCount; i++) {
      let e = this.generateExhibit(false);
      if (i % 2 === 1) e.marker += ' - 1';
      this.data.plaintiffEvidence.push(e);
      this.saveExhibit(e);

      e = this.generateExhibit(true);
      if (i % 2 === 1) e.marker += ' - 1';
      this.data.defendantEvidence.push(e);
      this.saveExhibit(e);
    }
  }

  generateExhibit(defendant: boolean): Exhibit {
    return <Exhibit>{
      marker: this.getNextMarker(defendant),
      description: faker.vehicle.model(),
      supportingWitness: faker.vehicle.fuel(),
      admittanceStoplight: 'green',
    };
  }

  addExhibit(defendant: boolean = true) {
    if (!this.trial) return;
    let exhibit: Exhibit = <Exhibit>{
      id: crypto.randomUUID(),
      trialId: this.trial.id,
      defendant: defendant,
    };
    exhibit.marker = this.getNextMarker(defendant);
    let dialogRef = this.openEditDialog(exhibit, true);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe((res: Exhibit) => {
        if (res && (res.description || res.supportingWitness)) {
          let list = defendant
            ? this.data.defendantEvidence
            : this.data.plaintiffEvidence;
          list.push(res);
          this.$ExhibitService.addExhibit(res).subscribe();
          this.filter$.next(this.searchFilter);
        }
      });
  }

  getNextMarker(defendant: boolean): string {
    if (!this.trial) return '';
    let list = defendant
      ? this.data.defendantEvidence
      : this.data.plaintiffEvidence;
    let numbered = defendant === this.trial.defendantNumbered;
    return numbered
      ? this.getNextNumberMarker(list)
      : this.getNextAlphaMarker(list);
  }

  getNextNumberMarker(list: Exhibit[]): string {
    let nextMarker = 0;
    for (let i = 0; i < list.length; i++) {
      if (!list[i]?.marker) continue;
      let num = Number(list[i].marker.trim());
      if (!isNaN(num) && num > nextMarker) {
        nextMarker = num;
      }
    }
    return (nextMarker + 1).toString();
  }

  getNextAlphaMarker(list: Exhibit[]): string {
    let nextMarker = 0;
    for (let i = 0; i < list.length; i++) {
      let marker = list[i]?.marker;
      if (!marker || !/^[a-zA-Z]+$/.test(marker)) continue;
      let num = this.alphaToNumber(marker);
      if (num > nextMarker) nextMarker = num;
    }
    nextMarker++;
    return this.numberToAlpha(nextMarker).toUpperCase();
  }

  numberToAlpha(num: number): string {
    if (num < 1) return '';
    return (
      this.numberToAlpha(Math.floor((num - 1) / 26)) +
      String.fromCharCode(((num - 1) % 26) + 65)
    );
  }

  alphaToNumber(alpha: string): number {
    return alpha
      .toUpperCase()
      .split('')
      .reduce((i, val) => i * 26 + val.charCodeAt(0) - 64, 0);
  }

  exhibitClicked(exhibit: Exhibit) {
    let dialogRef = this.openEditDialog(exhibit);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => {
        this.saveExhibit(exhibit);
      });
  }

  private openEditDialog(
    exhibit: Exhibit,
    addMode: boolean = false
  ): MatDialogRef<ExhibitEditComponent, any> {
    return this.dialog.open(ExhibitEditComponent, {
      data: { exhibit: exhibit, addMode: addMode },
      minWidth: '70%',
    });
  }

  saveExhibit(exhibit: Exhibit) {
    this.$ExhibitService.updateExhibit(exhibit).subscribe();
  }

  loadData() {
    if (!this.trial) return;
    this.loadingExhibits = true;
    this.$ExhibitService.getExhibitsOfTrial(this.trial.id).subscribe((res) => {
      this.loadingExhibits = false;
      this.data = res.evidenceData;
      this.filter$.next(this.searchFilter);
    });
  }

  filterData(val: string) {
    this.filteredData.plaintiffEvidence = [];
    this.filteredData.defendantEvidence = [];
    this.data.plaintiffEvidence
      .filter((exhibit) => Util.search(exhibit, val))
      .forEach((exhibit) => this.filteredData.plaintiffEvidence.push(exhibit));
    this.data.defendantEvidence
      .filter((exhibit) => Util.search(exhibit, val))
      .forEach((exhibit) => this.filteredData.defendantEvidence.push(exhibit));
  }
}
