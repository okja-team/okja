import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userDataService: UserDataService
  ) {
    this.userDataService.getUser().subscribe(user => {
      this.user = user;
    });
  }  


  getProfile(): Observable<Profile> {
    this.profileDoc = this.db.collection('users')
      .doc(this.user.uid)
      .collection('profiles')
      .doc<Profile>('profile');
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
    this.publishProfileDoc = this.db.collection('active_profiles').doc(this.user.uid);
    return this.publishProfileDoc.set(Object.assign({}, profile));
  }

  unpublishProfile(profile: Profile) {
    this.publishProfileDoc = this.db.collection('active_profiles').doc(this.user.uid);
    return this.publishProfileDoc.delete();
  }
}
