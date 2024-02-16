import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss',
})
export class EvidenceComponent {
  plaintiffEvidence: string[] = [];
  defendantEvidence: string[] = [];

  constructor() {
    this.fakeData();
  }

  fakeData() {
    for (var i = 0; i < 50; i++) {
      this.plaintiffEvidence.push(faker.vehicle.model());
      this.defendantEvidence.push(faker.vehicle.model());
    }
  }
}
