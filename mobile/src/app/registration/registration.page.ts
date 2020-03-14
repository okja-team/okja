import { AuthenticationService } from '../authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    public router: Router
  ) { }

  ngOnInit() { }

  signUp(email, password) {
    this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        window.alert('success registration');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

}