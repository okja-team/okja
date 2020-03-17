
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { cfaSignIn, cfaSignOut } from 'capacitor-firebase-auth';
import { auth } from 'firebase';
import { tap, catchError, take, exhaustMap, map } from 'rxjs/operators';
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

    // Login in with email/password
    SignIn(email, password) {
        return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password);
    }

    // Register user with email/password
    RegisterUser(email, password) {
        return this.ngFireAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    // Email verification when new user register
    async SendVerificationMail() {
        return this.ngFireAuth.auth.currentUser.sendEmailVerification()
            .then(() => {
                this.router.navigate(['verify-email']);
            });
    }

    // Recover password
    PasswordRecover(passwordResetEmail) {
        return this.ngFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email has been sent, please check your inbox.');
            }).catch((error) => {
                window.alert(error);
            });
    }

    public socialAuth(type: 'google.com'): Promise<User> {
        if (this.platform.is('capacitor')) {
            return this.mobileSocialAuth(type).toPromise();
        } else {
            return this.authLogin(new auth.GoogleAuthProvider());
        }
    }

    public checkAuth(): Observable<firebase.User> {
        return this.ngFireAuth.authState.pipe(
            exhaustMap(user => user ? from(this.setUserData(user)).pipe(map(_ => user)) : of(user)),
            take(1)
        );
    }

    private mobileSocialAuth(type: 'google.com'): Observable<firebase.User> {
        return cfaSignIn(type)
            .pipe(
                tap(async (user: firebase.User) => {
                    this.loginWithMobileSocial = true;
                    this.signInSuccess(user);
                }),
                catchError(error => {
                    window.alert(error);
                    return of(error);
                })
            );
    }

    // Auth providers
    private async authLogin(provider): Promise<User> {
        try {
            const authorization = await this.ngFireAuth.auth.signInWithPopup(provider);
            this.signInSuccess(authorization.user);
            return authorization.user;
        } catch (error) {
            window.alert(error);
        }
    }

    // TODO: remove
    private async signInSuccess(user: firebase.User) {
        await this.setUserData(user);
        const hasProfile = await this.profileService.hasProfile();
        if (hasProfile) {
            this.navCtrl.navigateRoot('home/tabs/tab1');
        } else {
            this.router.navigate(['profile']);
        }
    }

    // TODO: remove
    private signOutSuccess() {
        this.userDataService.removeUser();
        this.router.navigate(['login']);
    }

    private async setUserData(user: firebase.User) {
        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber
        };
        await this.userDataService.setUser(userData);
    }

    public signOut(): Promise<void> {
        if (this.loginWithMobileSocial) {
            return cfaSignOut().pipe(
                tap(() => {
                    this.loginWithMobileSocial = false;
                    this.signOutSuccess();
                })
            ).toPromise();
        } else {
            this.ngFireAuth.auth.signOut().then(() => {
                this.signOutSuccess();
            });
        }
    }

}
