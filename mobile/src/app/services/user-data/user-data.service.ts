import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from './user.interface';
import { skipWhile, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private user$: BehaviorSubject<User>;
  private isLogged$: BehaviorSubject<boolean>;

  constructor(private afStore: AngularFirestore) {
    this.user$ = new BehaviorSubject(null);
    this.isLogged$ = new BehaviorSubject(null);
  }

  // Returns true when user is looged in
  // public get isLoggedIn(): boolean {
  //   const user = this.user$.getValue() || JSON.parse(localStorage.getItem('user'));
  //   return (user !== null && user.emailVerified !== false) ? true : false;
  // }

  public isLogged(): Observable<boolean> {
    return this.isLogged$.asObservable();

  }
  // Returns true when user's email is verified
  public get isEmailVerified(): boolean {
    const user = this.user$.getValue() || JSON.parse(localStorage.getItem('user'));
    return (user && user.emailVerified !== false) ? true : false;
  }

  public getUser(): Observable<User> {
    return this.user$.asObservable().pipe(skipWhile(user => user === null));
  }

  public setUser(user: User): Observable<void> {
    return this.storeUser(user).pipe(tap(_ => {
      this.isLogged$.next(true);
      this.user$.next(user);
    }));
  }

  public removeUser() {
    this.user$.complete();
    this.user$ = new BehaviorSubject(null);
    this.isLogged$.next(false);
  }

  private storeUser(user: User): Observable<void> {
    return from(this.afStore.doc(`users/${user.uid}`).set(user, { merge: true }));
  }
}