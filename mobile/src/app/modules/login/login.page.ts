import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { TranslateConfigService } from 'services/translate-config.service';
import { LoadingController } from '@ionic/angular';
import { ProfileService } from 'services/profile.service';
import { exhaustMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public isDarkMode = false;

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
    private profileService: ProfileService
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  async ngOnInit() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    await this.setLoading();
  }

  private async setLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
  }

  public async loginWithSocial() {
    this.loadingElement.present();
    this.authService.login('google.com')
      .pipe(
        exhaustMap(() => this.profileService.hasProfile()),
        take(1)
      )
      .subscribe({
        next: hasProfile => this.goToPage(hasProfile),
        error: err => window.alert(`error on login: ${err}`),
        complete: () => console.log('login complete')
      });
  }

  private async goToPage(hasProfile: boolean) {
    if (hasProfile) {
      await this.router.navigate(['home/tabs/tab1']);
    } else {
      await this.router.navigate(['profile']);
    }
    this.loadingElement.dismiss();
  }

}
