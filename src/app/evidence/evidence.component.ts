import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject } from 'rxjs';
import { ExhibitCardComponent } from '../shared/components/exhibit-card/exhibit-card.component';
import { ExhibitEditComponent } from '../shared/components/exhibit-edit/exhibit-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
import { EvidenceData } from '../shared/models/evidence-data';
import { Exhibit } from '../shared/models/exhibit';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [
    ExhibitCardComponent,
    ExhibitEditComponent,
    MatButtonModule,
    SecondToolbarComponent,
  ],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss',
})
export class EvidenceComponent implements OnInit, OnDestroy {
  notifier$ = new Subject();
  data: EvidenceData = new EvidenceData();
  private dictionary = 'ABC'; //'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.fakeData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    for (let i = 0; i < 27; i++) {
      this.data.plaintiffEvidence.push(this.generateExhibit(false));
      this.data.defendantEvidence.push(this.generateExhibit(true));
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
    if (numbered) {
      let marker = 0;
      for (let i = 0; i < list.length; i++) {
        if (!list[i]?.marker) continue;
        let num = Number(list[i].marker);
        if (!isNaN(num) && num > marker) {
          marker = num;
        }
      }
      return (marker + 1).toString();
    } else {
      let marker = 0;
      for (let i = 0; i < list.length; i++) {
        if (!list[i]?.marker) continue;
        let num = this.atn(list[i].marker);
        if (num > marker) marker = num;
      }
      marker++;
      return this.nta(marker).toUpperCase();
    }
  }

  numberToAlpha(num: number): string {
    if (num <= this.dictionary.length) {
      return this.dictionary.slice(num - 1, num);
    }
    let index = num % this.dictionary.length;
    let quotient = num / this.dictionary.length;
    let result;

    if (quotient >= 1) {
      if (index === 0) quotient--;
      result = this.numberToAlpha(quotient);
    }

    if (index === 0) index = this.dictionary.length;

    return result + this.dictionary.slice(index - 1, index);
  }

  alphaToNumber(alpha: string): number {
    let result = 0;
    let index = 0;

    for (let i = 0; i <= alpha.length; i++) {
      index = this.dictionary.search(alpha.slice(i - 1, i)) + 1;
      if (index === 0) return 0;
      result += index * Math.pow(this.dictionary.length, alpha.length - i);
    }

    return result;
  }

  nta(n: number): string {
    if (n < 1) return '';
    return (
      this.nta(Math.floor((n - 1) / this.dictionary.length)) +
      this.dictionary[n - 1]
    );
  }

  atn(a: string): number {
    return a
      .toUpperCase()
      .split('')
      .reduce(
        (a, val) => a * this.dictionary.length + val.charCodeAt(0) - 64,
        0
      );
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
