import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, from, } from 'rxjs';
import { User } from '../models/inteface/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserDataService {

  private userId;
  private user: Observable<User>;
  private userDoc: AngularFirestoreDocument<User>;

  constructor(
    private readonly afStore: AngularFirestore,
    private readonly ngFireAuth: AngularFireAuth,
  ) {
    this.ngFireAuth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = null;
      }
    });
  }

  public getUser(): Observable<User> {
    this.userDoc = this.afStore.doc<User>(`users/${this.userId}`);
    this.user = this.userDoc.valueChanges();
    return this.user;
  }

  public setUser(user: User): Observable<void> {
    this.userId = user.uid;
    return from(this.afStore.doc(`users/${user.uid}`).set(user, { merge: true }));
  }

  public getId(){
    return this.userId;
  }
}