import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'services/authentication.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

  avatarPlaceHolder = 'assets/images/icon/ico_user_placeholder.svg';
  userLogged = false;
  avatarPhoto = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,

  ) {
    this.avatarPhoto = this.avatarPlaceHolder;
    this.authService.loggedUser.subscribe((user) => {
      if (user) {
        this.userLogged = true;
        this.avatarPhoto = user.photoURL ? user.photoURL : this.avatarPlaceHolder;
      } else {
        this.userLogged = false;
        this.avatarPhoto = this.avatarPlaceHolder;
      }
    });
  }

  ngOnInit() { }

  goToProfile() {
    if (this.userLogged) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
