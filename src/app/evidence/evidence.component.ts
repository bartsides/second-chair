import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { faker } from '@faker-js/faker';
import { Subject } from 'rxjs';
import { SecondToolbarComponent } from '../shared/components/second-toolbar/second-toolbar.component';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [MatButtonModule, SecondToolbarComponent],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss',
})
export class EvidenceComponent implements OnDestroy {
  notifier$ = new Subject();
  plaintiffEvidence: string[] = [];
  defendantEvidence: string[] = [];

  constructor(public activatedRoute: ActivatedRoute) {
    this.fakeData();
  }

  ngOnDestroy(): void {
    this.notifier$.next(undefined);
    this.notifier$.complete();
  }

  fakeData() {
    for (var i = 0; i < 50; i++) {
      this.plaintiffEvidence.push(faker.vehicle.model());
      this.defendantEvidence.push(faker.vehicle.model());
    }
  }
}
