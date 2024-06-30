import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import environment from '../../environment';
import { GetUserProfileQueryResults } from '../models/results/user-results';
import { UserProfile } from '../models/user-profile';

@Injectable({ providedIn: 'root' })
export class UserService {
  newUser = false;
  public user$ = new BehaviorSubject<UserProfile | null>(null);
  public loadingUser$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getUserProfile() {
    this.loadingUser$.next(true);
    let subject = new Subject<GetUserProfileQueryResults>();
    this.http
      .get<GetUserProfileQueryResults>(`${environment.apiUrl}/users/profile`)
      .subscribe({
        next: (res) => {
          this.loadingUser$.next(false);
          let userProfile = res?.userProfile;
          this.user$.next(userProfile);
          subject.next(res);
        },
        error: (err) => console.error(err),
      });
    return subject;
  }

  addUpdateUserProfile(firstName: string, lastName: string) {
    return this.http.post(`${environment.apiUrl}/users/profile`, {
      firstName,
      lastName,
    });
  }
}
