import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../../environment';
import { Exhibit } from '../models/exhibit';
import { GetExhibitsOfTrialResult } from '../models/results/exhibit-results';

@Injectable({ providedIn: 'root' })
export class ExhibitService {
  constructor(private http: HttpClient) {}

  addExhibit(exhibit: Exhibit) {
    return this.http.post(`${environment.apiUrl}/exhibits`, exhibit);
  }

  updateExhibit(exhibit: Exhibit) {
    return this.http.put(
      `${environment.apiUrl}/exhibits/${exhibit.id}`,
      exhibit
    );
  }

  getExhibitsOfTrial(trialId: string) {
    return this.http.get<GetExhibitsOfTrialResult>(
      `${environment.apiUrl}/trials/${trialId}/exhibits`
    );
  }
}
