import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Profile } from '../models/class/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // public currentProfile: Profile;
  private profile: Observable<Profile>;
  private profileDoc: AngularFirestoreDocument<Profile>;

  // private publishedProfile: Observable<Profile[]>;
  // private publishedProfileColl: AngularFirestoreCollection<Profile>;

  private publishProfileDoc: AngularFirestoreDocument<Profile>;


  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {

  }

  async hasProfile(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.getProfile().subscribe(p => {
        if (p) {
          res(true);
        } else {
          res(false);
        }
      })
    });
  }


  getProfile() {
    const userId = this.afAuth.auth.currentUser.uid;
    this.profileDoc = this.db.collection('users').doc(userId).collection('profiles').doc<Profile>('profile');
    this.profile = this.profileDoc.valueChanges();
    return this.profile;
  }

  deleteProfile(profile) {
    this.profileDoc.delete();
  }
  addProfile(profile: Profile) {
    return this.profileDoc.set(Object.assign({}, profile));
  }

  publishProfile(profile: Profile) {
    const userId = this.afAuth.auth.currentUser.uid;
    this.publishProfileDoc = this.db.collection('active_profiles').doc(userId);
    return this.publishProfileDoc.set(Object.assign({}, profile));
  }

  unpublishProfile(profile: Profile) {
    const userId = this.afAuth.auth.currentUser.uid;
    this.publishProfileDoc = this.db.collection('active_profiles').doc(userId);
    return this.publishProfileDoc.delete();
  }
}
