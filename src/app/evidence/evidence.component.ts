import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject, takeUntil } from 'rxjs';
import { ExhibitCardComponent } from '../shared/components/exhibit-card/exhibit-card.component';
import { ExhibitEditComponent } from '../shared/components/exhibit-edit/exhibit-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { EvidenceData } from '../shared/models/evidence-data';
import { Exhibit } from '../shared/models/exhibit';
import { Util } from '../shared/util/util';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [
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
  data: EvidenceData = new EvidenceData();
  filteredData: EvidenceData;
  evidenceSearchControl = new FormControl();

  constructor(public activatedRoute: ActivatedRoute, public dialog: MatDialog) {
    this.filteredData = new EvidenceData();
    this.filter$
      .pipe(takeUntil(this.notifier$))
      .subscribe((val) => this.filterData(val));
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

  ngOnInit(): void {
    this.evidenceSearchControl.valueChanges
      .pipe(takeUntil(this.notifier$))
      .subscribe((val) => {
        this.filter$.next(val);
      });
    this.loadData();
    this.fakeData();
    this.filter$.next('');
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    for (let i = 0; i < 8; i++) {
      this.data.plaintiffEvidence.push(this.generateExhibit(false));
      this.data.defendantEvidence.push(this.generateExhibit(true));
    }
    for (let i = 0; i < this.data.plaintiffEvidence.length; i++) {
      if (i % 2 === 1) this.data.plaintiffEvidence[i].marker += ' - 1';
    }
    for (let i = 0; i < this.data.defendantEvidence.length; i++) {
      if (i % 2 === 1) this.data.defendantEvidence[i].marker += ' - 1';
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
    let exhibit: Exhibit = <Exhibit>{};
    exhibit.marker = this.getNextMarker(defendant);
    let dialogRef = this.openEditDialog(exhibit, true);
    dialogRef.afterClosed().subscribe((res: Exhibit) => {
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
    dialogRef.afterClosed().subscribe(() => {
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

  saveData() {}

  loadData() {}
}
