import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, debounceTime, Subject, tap, throwError } from 'rxjs';
import { User } from '../models/user-model';
import { CookieStorageService } from './cookie-storage-service';
import { LocalStorageService } from './local-storage-service';
import { IStorage } from './storage-interface';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
  registered?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  //protected storageService: IStorage = new LocalStorageService();
  protected storageService: IStorage;

  // urls
  protected URL_SIGNUP = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCy8Qp55AY7Cb4agy9krS_veQN-suxgNTA';
  protected URL_LOGIN = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCy8Qp55AY7Cb4agy9krS_veQN-suxgNTA';

  constructor(
    protected http: HttpClient,
    protected router: Router,
    protected cookie: CookieService
  ) {
    this.storageService = new CookieStorageService(cookie);
    //this.storageService = new LocalStorageService();
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.URL_SIGNUP, {
      email: email,
      password: password,
      returnSecureToken: true
      // debounce nie będzie działał ponieważ cały czas tworzymy nowy observable
    }).pipe(
      debounceTime(1000),
      catchError(this.handleSignUpError), 
      tap(res => { this.handleAuthentication(res); })
    );
  };

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.URL_LOGIN, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleLoginError),
      tap(res => { this.handleAuthentication(res); })
    );
  }

  logout() {
    this.storageService.removeUserData();

    this.user.next(null);
    window.location.reload();

    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const loadedUser = this.storageService.getUserData();

    if(!loadedUser) {
      return;
    }

    if(loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration = loadedUser._tokenExpirationDate.getTime() - new Date().getTime();

      this.autoLogout(expDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // ##############################
  // helper methods
  // ##############################

  private handleSignUpError(response) {
    console.log(response);
    if (response.error.error.message === 'EMAIL_EXISTS') {
      return throwError(() => 'This email is already taken!');
    }
    else {
      return throwError(() => 'An error ocurred!');
    }
  }

  private handleLoginError(response) {
    console.log(response);

      let resMessage = 'an error occured';

      const message = response.error.error.message;
      switch(message) {
        case 'EMAIL_NOT_FOUND':
        resMessage = 'User with provided email does not exist!'
        break;

        case 'INVALID_PASSWORD':
        resMessage = 'Password is invalid!'
        break;

        case 'USER_DISABLED':
        resMessage = 'Account is disabled by administrator!'
        break; 
      }

      return throwError(() => resMessage);
  }

  private handleAuthentication(res) {
    const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
    const user = new User(res.email, res.localId, res.idToken, expDate);
    this.user.next(user);
    this.autoLogout(res.expiresIn * 1000)
    this.storageService.saveUserData(user);
  }
}
