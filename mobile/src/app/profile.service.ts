import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Role } from './modules/profile/role';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private rolesCollection: AngularFirestoreCollection<Role>;
  private roles: Observable<Role[]>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthenticationService) {
    // let currentUser = this.authService.GetCurrentUser();
    // if (this.afAuth.auth.currentUser) {
    //   let user = this.afAuth.auth.currentUser.uid;
    // }

    // if (currentUser) {
    //   this.refreshRolesCollection(currentUser.uid);
    // }
  }
  refreshRolesCollection(userId) {
    this.rolesCollection = this.db.collection('users').doc(userId).collection<Role>('roles');
    this.roles = this.rolesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  refreshAndGetRoleCollectionForCurrentUser() {
    this.refreshRolesCollection(this.authService.GetCurrentUser().uid);
    return this.roles;
  }

  getRole() {
    return this.roles;
  }
  updateRole(role) {
    return this.rolesCollection.doc(role.id).update(role);
  }
  deleteRole(role) {
    this.rolesCollection.doc(role.id).delete();
  }
  addRole(role) {
    return this.rolesCollection.add(role);
  }
}
