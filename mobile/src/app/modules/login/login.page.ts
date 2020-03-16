import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { TranslateConfigService } from 'services/translate-config.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  async ngOnInit() {
    await this.setLoading();
  }

  private async setLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
  }

  public login(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        if (this.authService.isEmailVerified) {
          this.router.navigate(['profile']);
          window.alert('login OK');
        } else {
          window.alert('Email is not verified');
          return false;
        }
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  public async loginWithSocial() {
    
    this.loadingElement.present();
    await this.authService.GoogleAuth();
    this.loadingElement.dismiss();

  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

}