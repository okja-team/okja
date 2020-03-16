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

  private storeUser(user: User): Promise<void> {
    return this.afStore.doc(`users/${user.uid}`).set(user, { merge: true });
  }
}