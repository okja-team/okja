import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserDataService } from '../../services/user-data/user-data.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  profile: Profile;
  hasProfile = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userDataService: UserDataService,
    private profileService: ProfileService,
    private translateConfigService: TranslateConfigService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.translateConfigService.getDefaultLanguage();
  }


  // --------------- HOOK METHODS ---------------//
  // --------------------------------------------//

  ngOnInit() {
    this.subscriptions();
  }

  ngOnDestroy(): void { }

  // -------------- PUBLIC METHODS --------------//
  // --------------------------------------------//

  public async saveProfile() {
    const loading = await this.loadingCtrl.create({
      message: this.translateConfigService.translateInstant('PROFILE_PAGE.LOADER_MESSAGE'),
      spinner: 'crescent',
    });
    loading.present();

    this.profileService.addProfile(this.profile);
    if (this.profile.published) {
      this.profileService.publishProfile(this.profile);
    } else {
      this.profileService.unpublishProfile(this.profile);
    }

    loading.dismiss();
  }

  public goToHome() {
    this.navCtrl.navigateRoot('home/tabs/tab1');
  }

  public setPosition() {
    this.router.navigate(['position-piker']);
  }

  // ------------- PRIVATE METHODS --------------//
  // --------------------------------------------//

  private subscriptions() {
    this.profileService.getProfile()
      .pipe(
        switchMap(profile => this.getProfileSwitchMap(profile)),
        untilDestroyed(this)
      )
      .subscribe({
        next: profile => this.profile = profile
      });
  }

  private getProfileSwitchMap(profile: Profile) {
    if (profile) {
      this.hasProfile = true;
      return of(profile);
    } else {
      return this.userDataService.getUser().pipe(map(user => {
        this.hasProfile = false;
        profile = new Profile();
        profile.setProfileByUser(user);
        return profile;
      }));
    }
  }

}


