
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { cfaSignIn, cfaSignOut } from 'capacitor-firebase-auth';
import { auth } from 'firebase';
import { tap, take, exhaustMap, map } from 'rxjs/operators';
import { of, Observable, from } from 'rxjs';
import { UserDataService } from 'services/user-data/user-data.service';
import { User } from 'services/user-data/user.interface';
import { ProfileService } from 'services/profile.service';

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

    public checkAuth(): Observable<firebase.User> {
        return this.ngFireAuth.authState.pipe(
            exhaustMap(user => user ? from(this.setUserData(user)).pipe(map(_ => user)) : of(user)),
            take(1)
        );
    }

    public login(type: 'google.com'): Observable<void> {
        return of(null)
            .pipe(
                exhaustMap(_ => {
                    if (this.platform.is('capacitor')) {
                        this.loginWithMobileSocial = true;
                        return this.mobileSocialAuth(type);
                    } else {
                        return this.webSocialAuth(new auth.GoogleAuthProvider());
                    }
                }),
                exhaustMap(user => this.setUserData(user))
            );
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
                    this.userDataService.removeUser();
                    this.loginWithMobileSocial = false;
                })
            );
    }

    private mobileSocialAuth(type: 'google.com'): Observable<firebase.User> {
        return cfaSignIn(type);
    }

    // Auth providers
    private webSocialAuth(provider): Observable<firebase.User> {
        return from(this.ngFireAuth.auth.signInWithPopup(provider))
            .pipe(map(authorization => authorization.user));
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
