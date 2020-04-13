import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { TranslateConfigService } from '../../services/translate-config.service';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { Profile } from 'models/class/profile';
import { LoaderService } from 'services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy {
  public isDarkMode = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private loaderService: LoaderService,
    private profileService: ProfileService,
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  async ngOnInit() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // await this.setLoading();
  }

  ngOnDestroy(): void { }

  public async loginWithSocial() {
    try {
      await this.loaderService.showLoader();
      const user = await this.authService.login('google.com')
      if (user) {
        console.log('login complete')
        this.onUserLogged();
      }
    } catch (err) {
      await this.loaderService.hideLoader();
      window.alert(`error on login: ${err}`);
      console.log('login error');
    }
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
    await this.loaderService.hideLoader();
  }

}
