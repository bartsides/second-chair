import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../environment';
import { Juror } from '../models/juror';
import { GetJurorsOfTrialResult } from '../models/results/juror-results';

@Injectable({ providedIn: 'root' })
export class JurorService {
  constructor(private http: HttpClient) {}

  addJuror(juror: Juror) {
    return this.http.post(`${environment.apiUrl}/jurors`, juror);
  }

  updateJuror(juror: Juror) {
    return this.http.put(`${environment.apiUrl}/jurors/${juror.id}`, juror);
  }

  updateJurors(jurors: Juror[]) {
    return this.http.put(`${environment.apiUrl}/jurors`, { jurors: jurors });
  }

  getJurorsOfTrial(trialId: string) {
    return this.http.get<GetJurorsOfTrialResult>(
      `${environment.apiUrl}/trials/${trialId}/jurors`
    );
  }
}
