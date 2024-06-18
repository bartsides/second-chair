import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import environment from '../../environment';
import { LocalStorageKeys } from '../config/local-storage-keys';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private $StorageService: StorageService
  ) {}

  getToken() {
    return this.token;
  }

  hasRefreshToken() {
    return !!this.getRefreshToken();
  }

  private getRefreshToken() {
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

  logout() {
    this.$StorageService.clearData();
    this.router.navigateByUrl('/');
  }

  register(email: string, password: string) {
    let subject = new Subject();

    this.http
      .post(`${environment.apiUrl}/auth/register`, {
        email,
        password,
      })
      .subscribe(() => {
        subject.next(true);
      });

    return subject;
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
