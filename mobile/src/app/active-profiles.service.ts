import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Profile } from './models/class/profile';

@Injectable({
  providedIn: 'root'
})
export class ActiveProfilesService {


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
