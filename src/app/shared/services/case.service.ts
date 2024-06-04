import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import environment from '../../../environment';
import { CaseDetails } from '../models/case-details';
import {
  GetCaseQueryResult,
  GetCasesQueryResult,
} from '../models/results/case-results';

@Injectable({ providedIn: 'root' })
export class CaseService {
  public currentCase$ = new BehaviorSubject<CaseDetails | undefined | null>(
    null
  );

  constructor(private http: HttpClient) {}

  addCase(caseDetails: CaseDetails) {
    return this.http.post(`${environment.apiUrl}/cases`, caseDetails);
  }

  getCase(caseId: string) {
    return this.http.get<GetCaseQueryResult>(
      `${environment.apiUrl}/cases/${caseId}`
    );
  }

  getCases() {
    return this.http.get<GetCasesQueryResult>(`${environment.apiUrl}/cases`);
  }

  updateCase(caseDetails: CaseDetails) {
    return this.http.put(
      `${environment.apiUrl}/cases/${caseDetails.id}`,
      caseDetails
    );
  }
}
