import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { cfaSignIn, cfaSignOut } from 'capacitor-firebase-auth';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { User } from '../models/inteface/user.interface';
import { UserDataService } from './user-data.service';


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
        return new Promise((resolve, reject) => {
            if (this.platform.is('capacitor')) {
                cfaSignOut()
                    .subscribe(
                        (res) => {
                            this.router.navigate(['home/tabs/map']);
                            resolve(res);
                        },
                        (err) => {
                            reject(err);
                        });

            } else {
                this.ngFireAuth.signOut()
                    .then(() => {
                        this.router.navigate(['home/tabs/map']);
                        resolve();
                    })
                    .catch((e => reject(e)));
            }
        });
    }

    private mobileSocialAuth(type: 'google.com'): Promise<firebase.User> {
        return new Promise((resolve, reject) => {
            this.ngFireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    cfaSignIn(type)
                        .subscribe(
                            (user) => {
                                this.setUserData(user)
                                    .subscribe(
                                        (res) => {
                                            resolve(user);
                                        },
                                        (err => {
                                            reject(err);
                                        }));
                            },
                            (err) => {
                                reject(err);
                            });
                });
        });
    }

    private webSocialAuth(provider): Promise<firebase.User> {
        return new Promise((resolve, reject) => {
            this.ngFireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    this.ngFireAuth.signInWithPopup(provider)
                        .then(userCredentials => {
                            this.setUserData(userCredentials.user)
                                .subscribe(
                                    (res) => {
                                        resolve(userCredentials.user)
                                    },
                                    (err) => {
                                        reject(err);
                                    });
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
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
