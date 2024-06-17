import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import environment from '../../environment';
import { LocalStorageKeys } from '../config/local-storage-keys';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string;

  constructor(
    private http: HttpClient,
    private $StorageService: StorageService
  ) {}

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.$StorageService.getData(LocalStorageKeys.refreshKey);
  }

  login(email: string, password: string) {
    let subject = new Subject();

    this.http
      .post(`${environment.apiUrl}/auth/login`, {
        email,
        password,
        twoFactorCode: null,
        twoFactorRecoveryCode: null,
      })
      .subscribe((res: any) => {
        this.processCredentials(res);
        subject.next(true);
      });

    return subject;
  }

  register(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      email,
      password,
    });
  }

  refreshToken() {
    let subject = new Subject<boolean>();

    this.http
      .post(`${environment.apiUrl}/auth/refresh`, {
        refreshToken: this.getRefreshToken(),
      })
      .subscribe((res: any) => {
        this.processCredentials(res);
        subject.next(true);
      });

    return subject;
  }

  private processCredentials(res: any) {
    this.token = res.accessToken;
    this.$StorageService.saveData(
      LocalStorageKeys.refreshKey,
      res.refreshToken
    );
  }
}
