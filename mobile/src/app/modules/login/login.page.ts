import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TranslateConfigService } from '../../services/translate-config.service';
import { LoadingController } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { Profile } from 'models/class/profile';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy {
  public isDarkMode = false;

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
    private profileService: ProfileService,
  ) {
    this.translateConfigService.getDefaultLanguage();
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
        next: () => this.onUserLogged(),
        error: err => window.alert(`error on login: ${err}`),
        complete: () => console.log('login complete')
      });
  }

  onUserLogged() {
    this.profileService.getProfile()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(profile => {
        this.goToPage(profile);
      });
  }

  private async goToPage(profile: Profile) {
    if (profile) {
      await this.router.navigate(['home/tabs/map']);
    } else {
      await this.router.navigate(['profile']);
    }
    this.loadingElement.dismiss();
  }

}
