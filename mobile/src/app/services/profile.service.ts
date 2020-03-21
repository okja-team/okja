import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Profile } from '../models/profile';
import { UserDataService } from './user-data/user-data.service';
import { User } from './user-data/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profile: Observable<Profile>;
  private profileDoc: AngularFirestoreDocument<Profile>;

  private publishProfileDoc: AngularFirestoreDocument<Profile>;
  private user: User

  constructor(
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userDataService: UserDataService
  ) {
    this.userDataService.getUser().subscribe(user => {
      this.user = user;
    });
  }


  getProfile(): Observable<Profile> {
    this.profileDoc = this.afStore.doc(`profiles/${this.user.uid}`);
    this.profile = this.profileDoc.valueChanges();
    return this.profile;
  }

  deleteProfile(profile) {
    this.profileDoc.delete();
  }
  addProfile(profile: Profile) {
    if (profile.published && profile.position && profile.position.lat && profile.position.lng) {
      this.publishProfile(profile);
    } else {
      this.unpublishProfile(profile);
    }
    return from(this.afStore.doc(`profiles/${this.user.uid}`).set(Object.assign({}, profile, { merge: true })));
  }

  publishProfile(profile: Profile) {
    this.publishProfileDoc = this.afStore.collection('active_profiles').doc(this.user.uid);
    return this.publishProfileDoc.set(Object.assign({}, profile));
  }

  unpublishProfile(profile: Profile) {
    this.publishProfileDoc = this.afStore.collection('active_profiles').doc(this.user.uid);
    return this.publishProfileDoc.delete();
  }
}
