import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../../environment';
import {
  GetCaseQueryResult,
  GetCasesQueryResult,
} from '../models/results/case-results';

@Injectable({ providedIn: 'root' })
export class CaseService {
  constructor(private http: HttpClient) {}

  getCase(caseId: string) {
    return this.http.get<GetCaseQueryResult>(
      `${environment.apiUrl}/cases/${caseId}`
    );
  }

  getCases() {
    return this.http.get<GetCasesQueryResult>(`${environment.apiUrl}/cases`);
  }
}
