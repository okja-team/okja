import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private translateConfigService: TranslateConfigService,
    private loadingCtrl: LoadingController,
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() { }

  logIn(email, password) {
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

  async loginWithSocial() {
    const loading = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    loading.present();
    await this.authService.GoogleAuth();
    loading.dismiss();

  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

}