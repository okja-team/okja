import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  formHelper = [
    { val: 'Cibo', isChecked: false },
    { val: 'Farmacia', isChecked: false },
    { val: 'Compagnia', isChecked: false }
  ];

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private translateConfigService: TranslateConfigService
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() { }

  signUp(email, password) {
    this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail()
        this.router.navigate(['verify-email']);
      }).catch((error) => {
        window.alert(error.message);
      });
  }
}