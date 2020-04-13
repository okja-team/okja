import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from './translate-config.service';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  exitFromPage = [
    '/home/tabs/map',
    '/home/tabs/setting',
    '/home/tabs/list',
    '/login'
  ];

  constructor(
    private readonly platform: Platform,
    private readonly router: Router,
    private readonly toastCtrl: ToastController,
    private readonly translactionServise: TranslateConfigService,
  ) { }


  registerBackButton() {

    if (this.platform.is('android')) {
      this.platform.backButton.subscribeWithPriority(0, async () => {
        if (this.exitFromPage.includes(this.router.url)) {
          const tapIn = new Date().getTime() - this.lastTimeBackPress;
          if (tapIn < this.timePeriodToExit) {
            navigator['app'].exitApp()
          } else {
            await this.showExitMessage();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else {
          this.lastTimeBackPress = 0;
        }
      })

    }
  }

  private async showExitMessage() {
    const toast = await this.toastCtrl.create({
      cssClass: 'toast-welcome',
      duration: 3000,
      position: 'bottom',
      message: this.translactionServise.translateInstant('EXIT.BACK_BUTTON'),
    });
    toast.present();
  }
}
