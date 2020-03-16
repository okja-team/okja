import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.interface';
import { skipWhile } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private user$: BehaviorSubject<User>;
  constructor(private afStore: AngularFirestore) {
    this.user$ = new BehaviorSubject(null);
  }

  // Returns true when user is looged in
  public get isLoggedIn(): boolean {
    const user = this.user$.getValue() || JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  public get isEmailVerified(): boolean {
    const user = this.user$.getValue() || JSON.parse(localStorage.getItem('user'));
    return (user && user.emailVerified !== false) ? true : false;
  }

  public getUser(): Observable<User> {
    return this.user$.asObservable().pipe(skipWhile(user => user === null));
  }

  public async setUser(user: User): Promise<void> {
    try {
      await this.storeUser(user);
      console.log(`[UserDataService] - user stored on firebase`, user);
      this.user$.next(user);
      console.log(`[UserDataService] - user stored in session`, user);
    } catch (error) {
      console.error(`[UserDataService] - error on store user`, error);
    }
  }

  public removeUser() {
    this.user$.complete();
    this.user$ = new BehaviorSubject(null);
  }

  private storeUser(user: User): Promise<void> {
    return this.afStore.doc(`users/${user.uid}`).set(user, { merge: true });
  }
}