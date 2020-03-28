import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  exitFromPage = [
    '/home/tabs/map',
    '/home/tabs/info',
    '/home/tabs/list'
  ];

  constructor(
    private readonly platform: Platform,
    private readonly router: Router,
    private readonly toastCtrl: ToastController
  ) { }


  registerBackButton() {

    if (this.platform.is('android')) {
      this.platform.backButton.subscribeWithPriority(0, async () => {
        if (this.exitFromPage.includes(this.router.url)) {
          const tapIn = new Date().getTime() - this.lastTimeBackPress;
          if (tapIn < this.timePeriodToExit) {
            navigator['app'].exitApp()
          } else {
            const toast = await this.toastCtrl.create({
              message: 'Press back again to exit App',
              duration: 3000,
              position: 'bottom'
            });
            await toast.present();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else {
          this.lastTimeBackPress = 0;
        }
      })

    }

  }
}
