import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import environment from '../../../environment';
import {
  GetTrialQueryResult,
  GetTrialsQueryResult,
} from '../models/results/trial-results';
import { TrialDetails } from '../models/trial-details';

@Injectable({ providedIn: 'root' })
export class TrialService {
  public currentTrial$ = new BehaviorSubject<TrialDetails | undefined | null>(
    null
  );
  public loadingTrial$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  addTrial(trial: TrialDetails) {
    return this.http.post(`${environment.apiUrl}/trials`, trial);
  }

  getTrial(trialId: string) {
    return this.http.get<GetTrialQueryResult>(
      `${environment.apiUrl}/trials/${trialId}`
    );
  }

  getTrials() {
    return this.http.get<GetTrialsQueryResult>(`${environment.apiUrl}/trials`);
  }

  updateTrial(trial: TrialDetails) {
    return this.http.put(`${environment.apiUrl}/trials/${trial.id}`, trial);
  }
}
