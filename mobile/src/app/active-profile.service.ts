import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Profile } from './models/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveProfileService {


  private activeProfiles: Observable<Profile[]>;
  private activeProfilesColl: AngularFirestoreCollection<Profile>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth, ) { }


    getActiveProfile() {
      this.activeProfilesColl = this.db.collection('active_profiles');
      this.activeProfiles = this.activeProfilesColl.valueChanges();
      return this.activeProfiles;
    }


}
