import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

var isRefreshing = false;

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  let authService = inject(AuthService);
  req = authorizeRequest(req, authService);

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('auth/login') &&
        error.status === 401
      ) {
        return handle401Error(req, next, authService);
      }

      return throwError(() => error);
    })
  );
}

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;

    if (authService.getRefreshToken()) {
      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          req = authorizeRequest(req, authService);
          return next(req);
        }),
        catchError((error) => {
          isRefreshing = false;

          return throwError(() => error);
        })
      );
    }
  }

  return next(req);
}

function authorizeRequest(
  req: HttpRequest<any>,
  authService: AuthService
): HttpRequest<any> {
  const token = authService.getToken();
  if (token) {
    let headers = req.headers.append('Authorization', 'Bearer ' + token);
    req = req.clone({
      headers: headers,
      withCredentials: true,
    });
  }
  return req;
}
