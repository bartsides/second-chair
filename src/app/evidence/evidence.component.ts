import { Component, OnDestroy } from '@angular/core';
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
export class EvidenceComponent implements OnDestroy {
  notifier$ = new Subject();
  data: EvidenceData = <EvidenceData>{
    plaintiffEvidence: [],
    defendantEvidence: [],
    defendantNumbered: true,
  };

  constructor(public activatedRoute: ActivatedRoute, public dialog: MatDialog) {
    this.fakeData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    for (var i = 0; i < 25; i++) {
      this.data.plaintiffEvidence.push(this.generateExhibit(i + 1));
      this.data.defendantEvidence.push(this.generateExhibit(i + 1));
    }
  }

  generateExhibit(marker: number): Exhibit {
    return <Exhibit>{
      marker: marker.toString(),
      description: faker.vehicle.model(),
      supportingWitness: faker.vehicle.fuel(),
      admittanceStoplight: 'green',
    };
  }

  addExhibit(defendant: boolean = true) {
    var exhibit: Exhibit = <Exhibit>{};
    exhibit.marker = this.getNextMarker(defendant);
    var dialogRef = this.openEditDialog(exhibit, true);
    dialogRef.afterClosed().subscribe((res: Exhibit) => {
      if (res && (res.description || res.supportingWitness)) {
        var list = defendant
          ? this.data.defendantEvidence
          : this.data.plaintiffEvidence;
        list.push(res);
        this.saveData();
      }
    });
  }

  getNextMarker(defendant: boolean): string {
    var list = defendant
      ? this.data.defendantEvidence
      : this.data.plaintiffEvidence;
    var numbered = defendant === this.data.defendantNumbered;
    if (numbered) {
      var marker = 0;
      for (var i = 0; i < list.length; i++) {
        if (!list[i]?.marker) continue;
        var num = Number(list[i].marker);
        if (!isNaN(num) && num > marker) {
          console.log(marker, ' -> ', num);
          marker = num;
        }
      }
      return (marker + 1).toString();
    } else {
      return 'A';
    }
  }

  exhibitClicked(exhibit: Exhibit) {
    var dialogRef = this.openEditDialog(exhibit);
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
}
