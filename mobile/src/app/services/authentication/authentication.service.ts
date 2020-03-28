
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { cfaSignIn, cfaSignOut } from 'capacitor-firebase-auth';
import { auth } from 'firebase';
import { tap, exhaustMap } from 'rxjs/operators';
import { of, Observable, from } from 'rxjs';
import { UserDataService } from '../../services/user-data/user-data.service';
import { User } from '../../services/user-data/user.interface';
import { ProfileService } from '../../services/profile.service';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    private loginWithMobileSocial: boolean;
    constructor(
        public afStore: AngularFirestore,
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public profileService: ProfileService,
        public navCtrl: NavController,
        private platform: Platform,
        private userDataService: UserDataService

    ) {
        this.loginWithMobileSocial = false;
    }

    public async login(type: 'google.com'): Promise<firebase.User> {
        if (this.platform.is('capacitor')) {
            this.loginWithMobileSocial = true;
            return this.mobileSocialAuth(type);
        } else {
            return this.webSocialAuth(new auth.GoogleAuthProvider());
        }
    }

    public logout(): Observable<void> {
        return of(null)
            .pipe(
                exhaustMap(_ => {
                    if (this.loginWithMobileSocial) {
                        return cfaSignOut();
                    } else {
                        return from(this.ngFireAuth.auth.signOut());
                    }
                }),
                tap(_ => {
                    this.loginWithMobileSocial = false;
                })
            );
    }

    private mobileSocialAuth(type: 'google.com'): Promise<firebase.User> {
        return new Promise(resolve => {
            this.ngFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                cfaSignIn(type).subscribe(user => {
                    this.setUserData(user).subscribe(() => {
                        resolve(user)
                    });
                });
            });
        });
    }

    private webSocialAuth(provider): Promise<firebase.User> {
        return new Promise(resolve => {
            this.ngFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                this.ngFireAuth.auth.signInWithPopup(provider).then(auth => {
                    this.setUserData(auth.user).subscribe(() => {
                        resolve(auth.user)
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
