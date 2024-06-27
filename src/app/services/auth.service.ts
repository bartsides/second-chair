import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import environment from '../../environment';
import { LocalStorageKeys } from '../config/local-storage-keys';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private $StorageService: StorageService,
    private $UserService: UserService
  ) {}

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  hasRefreshToken() {
    return !!this.getRefreshToken();
  }

  private getRefreshToken() {
    return this.$StorageService.getData(LocalStorageKeys.refreshKey);
  }

  login(
    email: string,
    password: string,
    redirectUrl: string
  ): Subject<boolean> {
    let subject = new Subject<boolean>();

    this.http
      .post(`${environment.apiUrl}/auth/login`, {
        email,
        password,
        twoFactorCode: null,
        twoFactorRecoveryCode: null,
      })
      .subscribe({
        next: (res: any) => {
          this.processCredentials(res, subject, redirectUrl);
          subject.next(true);
        },
        error: () => {
          subject.next(false);
        },
      });

    return subject;
  }

  logout() {
    this.token = '';
    this.$StorageService.clearData();
    this.isAuthenticated$.next(false);
    this.router.navigateByUrl('/');
  }

  register(email: string, password: string) {
    let subject = new Subject();

    this.http
      .post(`${environment.apiUrl}/auth/register`, {
        email,
        password,
      })
      .subscribe({
        next: () => subject.next(true),
        error: () => subject.next(false),
      });

    return subject;
  }

  refreshToken(redirectUrl: string = ''): Subject<boolean> {
    let subject = new Subject<boolean>();

    this.http
      .post(`${environment.apiUrl}/auth/refresh`, {
        refreshToken: this.getRefreshToken(),
      })
      .subscribe({
        next: (res: any) => {
          this.processCredentials(res, subject, redirectUrl);
          subject.next(true);
        },
        error: () => {
          this.logout();
          subject.next(false);
        },
      });

    return subject;
  }

  private processCredentials(
    res: any,
    subject: Subject<boolean>,
    redirectUrl: string
  ) {
    this.token = res.accessToken;
    this.$StorageService.saveData(
      LocalStorageKeys.refreshKey,
      res.refreshToken
    );

    this.$UserService.getUserProfile().subscribe({
      next: (res) => {
        this.isAuthenticated$.next(this.isAuthenticated());
        let userProfile = res.userProfile;
        if (!userProfile || !userProfile.firstName || !userProfile.lastName) {
          this.$UserService.newUser = true;
          this.router.navigateByUrl('/profile');
        } else if (!userProfile.currentFirm || !userProfile.firms?.length) {
          this.router.navigateByUrl('/firms');
        } else if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        }
        subject.next(true);
      },
      error: () => subject.next(false),
    });
  }
}
