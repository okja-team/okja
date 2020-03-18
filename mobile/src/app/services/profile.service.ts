import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { map, take } from 'rxjs/operators';

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

  public hasProfile(): Observable<boolean> {
    return this.getProfile()
      .pipe(
        map(profile => !!profile)
      );
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
