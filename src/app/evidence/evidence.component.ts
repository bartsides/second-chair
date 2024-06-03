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
import { EvidenceListComponent } from '../shared/components/evidence-list/evidence-list.component';
import { ExhibitCardComponent } from '../shared/components/exhibit-card/exhibit-card.component';
import { ExhibitEditComponent } from '../shared/components/exhibit-edit/exhibit-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { LocalStorageKeys } from '../shared/config/local-storage-keys';
import { EvidenceData } from '../shared/models/evidence-data';
import { Exhibit } from '../shared/models/exhibit';
import { StorageService } from '../shared/services/storage.service';
import { Util } from '../shared/util/util';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [
    EvidenceListComponent,
    ExhibitCardComponent,
    ExhibitEditComponent,
    FormsModule,
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
  notifier$ = new Subject();
  filter$ = new Subject<string>();
  searchFilter: string = '';
  data: EvidenceData = new EvidenceData();
  filteredData: EvidenceData;
  evidenceSearchControl = new FormControl();

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public $StorageService: StorageService
  ) {
    this.filteredData = new EvidenceData();
    this.filter$
      .pipe(takeUntil(this.notifier$))
      .subscribe((val) => this.filterData(val));
  }

  ngOnInit(): void {
    this.evidenceSearchControl.valueChanges
      .pipe(
        takeUntil(this.notifier$),
        tap((val) => (this.searchFilter = val))
      )
      .subscribe((val) => {
        this.filter$.next(val);
      });
    this.loadData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    let fakeCount = 8;
    for (let i = 0; i < fakeCount; i++) {
      let e = this.generateExhibit(false);
      if (i % 2 === 1) e.marker += ' - 1';
      this.data.plaintiffEvidence.push(e);

      e = this.generateExhibit(true);
      if (i % 2 === 1) e.marker += ' - 1';
      this.data.defendantEvidence.push(e);
    }
    this.saveData();
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
    let exhibit: Exhibit = <Exhibit>{};
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
          this.saveData();
        }
      });
  }

  getNextMarker(defendant: boolean): string {
    let list = defendant
      ? this.data.defendantEvidence
      : this.data.plaintiffEvidence;
    let numbered = defendant === this.data.defendantNumbered;
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
        this.saveData();
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

  saveData() {
    this.$StorageService.saveData(
      LocalStorageKeys.evidence,
      JSON.stringify(this.data)
    );
    this.filter$.next(this.searchFilter);
  }

  loadData() {
    let data = this.$StorageService.getData(LocalStorageKeys.evidence);
    if (data) this.data = JSON.parse(data);
    this.filter$.next(this.searchFilter);
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
