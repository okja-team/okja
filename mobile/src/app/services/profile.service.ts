import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from './user-data/user.interface';
import { Profile } from 'models/class/profile';
import { Roles } from 'models/enums/roles.enum';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profile: Observable<Profile>;
  private profileDoc: AngularFirestoreDocument<Profile>;
  private publishProfileDoc: AngularFirestoreDocument<Profile>;

  constructor(
    private readonly afStore: AngularFirestore,
    private readonly ngFireAuth: AngularFireAuth,
  ) {

  }

  getProfile(): Observable<Profile> {
    this.profileDoc = this.afStore.doc(`profiles/${this.ngFireAuth.auth.currentUser.uid}`);
    this.profile = this.profileDoc.valueChanges();
    return this.profile;
  }

  deleteProfile(profile) {
    this.profileDoc.delete();
  }
  addProfile(profile: Profile) {
    console.log(profile)
    if (profile.isAvailable && profile.position && profile.position.lat && profile.position.lng) {
      this.publishProfile(profile);
    } else {
      this.unpublishProfile(profile);
    }
    return from(this.afStore.doc(`profiles/${this.ngFireAuth.auth.currentUser.uid}`).set(Object.assign({}, profile, { merge: true })));
  }

  publishProfile(profile: Profile) {
    this.publishProfileDoc = this.afStore.collection('active_profiles').doc(this.ngFireAuth.auth.currentUser.uid);
    return this.publishProfileDoc.set(Object.assign({}, profile));
  }

  unpublishProfile(profile: Profile) {
    this.publishProfileDoc = this.afStore.collection('active_profiles').doc(this.ngFireAuth.auth.currentUser.uid);
    return this.publishProfileDoc.delete();
  }

  public setProfileByUser(profile: Profile, user: User) {
    if (user) {
      profile.id = user.uid;
      user.displayName.split(' ').forEach((partialName, index) => {
        index === 0 ? profile.name = partialName : profile.surName += partialName + ' ';
      });
      profile.phone = user.phoneNumber || '+39';
      profile.photoURL = user.photoURL || '';
    }
  }

  public setCapability(profile: Profile, help: Roles, value: boolean): void {
    const i = profile.capabilities.findIndex(x => x.type === help);
    if (i > -1) {
      profile.capabilities[i].available = value;
    } else {
      profile.capabilities.push({ type: help, available: value });
    }
  }

  public getCapability(profile: Profile, help: Roles): boolean {
    const i = profile.capabilities.findIndex(x => x.type === help);
    if (i > -1) {
      return profile.capabilities[i].available;;
    } else {
      return false;
    }
  }
}
