import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { User } from '../models/inteface/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserDataService {

  constructor(
    private readonly afStore: AngularFirestore,
    private readonly ngFireAuth: AngularFireAuth,
  ) {
  }

  public getUser(): Observable<User> {
    const userDoc = this.afStore.doc<User>(`users/${this.ngFireAuth.auth.currentUser.uid}}`);
    return userDoc.valueChanges();
  }

  public setUser(user: User): Observable<void> {
    return from(this.afStore.doc(`users/${user.uid}`).set(user, { merge: true }));
  }
}