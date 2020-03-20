import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TranslateConfigService } from '../../services/translate-config.service';
import { LoadingController } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile';
import { UserDataService } from '../../services/user-data/user-data.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy  {
  public isDarkMode = false;

  public profile: Profile;
  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
    private userDataService: UserDataService,
    private profileService: ProfileService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.userDataService.getUser()
      .pipe(untilDestroyed(this))
      .subscribe(user => {
        this.profileService.getProfile()
          .pipe(untilDestroyed(this))
          .subscribe(profile => {
            this.profile = profile;
          });
      });

  }

  async ngOnInit() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    await this.setLoading();
  }

  ngOnDestroy(): void { }

  private async setLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
  }

  public async loginWithSocial() {
    this.loadingElement.present();
    this.authService.login('google.com')
      .subscribe({
        next: profile => this.goToPage(this.profile),
        error: err => window.alert(`error on login: ${err}`),
        complete: () => console.log('login complete')
      });
  }

  private async goToPage(profile: Profile) {
    if (profile) {
      await this.router.navigate(['home/tabs/tab1']);
    } else {
      await this.router.navigate(['profile']);
    }
    this.loadingElement.dismiss();
  }

}