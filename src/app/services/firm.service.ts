import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from '../../environment';
import { GetFirmQueryResult } from '../models/results/firm-results';

@Injectable({ providedIn: 'root' })
export class FirmService {
  constructor(private http: HttpClient) {}

  getFirm(id: string) {
    return this.http.get<GetFirmQueryResult>(
      `${environment.apiUrl}/firms/${id}`
    );
  }

  addFirm(id: string, name: string) {
    return this.http.post(`${environment.apiUrl}/firms`, { id, name });
  }

  updateFirm(id: string, name: string) {
    return this.http.put(`${environment.apiUrl}/firms/${id}`, { id, name });
  }

  changeFirm(firmId: string) {
    return this.http.put(`${environment.apiUrl}/firms/change`, { firmId });
  }
}
