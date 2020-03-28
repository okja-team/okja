import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { cfaSignIn, cfaSignOut } from 'capacitor-firebase-auth';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { User } from '../../services/user-data/user.interface';
import { UserDataService } from '../../services/user-data/user-data.service';


@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    public loggedUser: Observable<firebase.User>;

    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public profileService: ProfileService,
        public navCtrl: NavController,
        private platform: Platform,
        private userDataService: UserDataService

    ) {
        this.loggedUser = ngFireAuth.authState;
    }

    public async login(type: 'google.com'): Promise<firebase.User> {
        if (this.platform.is('capacitor')) {
            return this.mobileSocialAuth(type);
        } else {
            return this.webSocialAuth(new auth.GoogleAuthProvider());
        }
    }

    public logout(): Promise<void> {
        return new Promise(resolve => {
            if (this.platform.is('capacitor')) {
                cfaSignOut()
                    .subscribe(() => {
                        this.router.navigate(['home/tabs/map']);
                        resolve();
                    });

            } else {
                this.ngFireAuth.auth.signOut()
                    .then(() => {
                        this.router.navigate(['home/tabs/map']);
                        resolve();
                    });
            }
        });
    }

    private mobileSocialAuth(type: 'google.com'): Promise<firebase.User> {
        return new Promise(resolve => {
            this.ngFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    cfaSignIn(type)
                        .subscribe(user => {
                            this.setUserData(user)
                                .subscribe(() => {
                                    resolve(user)
                                });
                        });
                });
        });
    }

    private webSocialAuth(provider): Promise<firebase.User> {
        return new Promise(resolve => {
            this.ngFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    this.ngFireAuth.auth.signInWithPopup(provider)
                        .then(userCredentials => {
                            this.setUserData(userCredentials.user)
                                .subscribe(() => {
                                    resolve(userCredentials.user)
                                });
                        });
                });
        });
    }

    private setUserData(user: firebase.User): Observable<void> {
        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber
        };
        return this.userDataService.setUser(userData);
    }

}
