import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  public isDarkMode = false;

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private translateConfigService: TranslateConfigService
  ) {
    this.translateConfigService.getDefaultLanguage();
   }

  ngOnInit() { 
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

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

  goToRegistration(){
    this.router.navigate(['/registration']);
  }

}