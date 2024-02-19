import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject } from 'rxjs';
import { ExhibitCardComponent } from '../shared/components/exhibit-card/exhibit-card.component';
import { ExhibitEditComponent } from '../shared/components/exhibit-edit/exhibit-edit.component';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';
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
  plaintiffEvidence: Exhibit[] = [];
  defendantEvidence: Exhibit[] = [];

  constructor(public activatedRoute: ActivatedRoute, public dialog: MatDialog) {
    this.fakeData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    for (var i = 0; i < 50; i++) {
      this.plaintiffEvidence.push(this.generateExhibit(i));
      this.defendantEvidence.push(this.generateExhibit(i));
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

  exhibitClicked(exhibit: Exhibit) {
    var dialogRef = this.openEditDialog(exhibit);
    dialogRef.afterClosed().subscribe(() => {
      //this.saveData();
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
}
