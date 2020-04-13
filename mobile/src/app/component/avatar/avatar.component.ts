import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'services/authentication.service';
import { TranslateConfigService } from 'services/translate-config.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

  @Input()
  showWelcomeToast: boolean;
  avatarPlaceHolder = 'assets/images/icon/ico_user_placeholder.svg';
  userLogged = false;
  avatarPhoto = '';
  welcomeToast: HTMLIonToastElement;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly translactionServise: TranslateConfigService,
    private readonly toastController: ToastController
  ) {
    this.avatarPhoto = this.avatarPlaceHolder;
    this.authService.loggedUser.subscribe(async (user) => {
      if (user) {
        this.userLogged = true;
        this.avatarPhoto = user.photoURL ? user.photoURL : this.avatarPlaceHolder;
      } else {
        this.userLogged = false;
        this.avatarPhoto = this.avatarPlaceHolder;
      }
      await this.manageWelcomeMessage(!this.userLogged);
    });
  }

  ngOnInit() { }

  async goToProfile() {
    if (this.userLogged) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
      await this.manageWelcomeMessage(false);
    }
  }

  private async createToast() {
    this.welcomeToast = await this.toastController.create({
      cssClass: 'toast-welcome',
      duration: 5000,
      header: this.translactionServise.translateInstant('WELCOME.TITLE'),
      message: this.translactionServise.translateInstant('WELCOME.MESSAGE'),
      buttons: [
        {
          side: 'end',
          text: this.translactionServise.translateInstant('WELCOME.CTA'),
          handler: () => {
            this.goToProfile();
          }
        }
      ]
    });
  }

  private async manageWelcomeMessage(show: boolean) {
    if (!this.welcomeToast && this.showWelcomeToast) {
      await this.createToast();
      if (show) {
        await this.welcomeToast.present();
      } else {
        await this.welcomeToast.dismiss();
        this.welcomeToast = undefined;
      }
    }
  }
}
