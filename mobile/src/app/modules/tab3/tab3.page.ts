import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateConfigService } from 'services/translate-config.service';
import { User } from 'services/user-data/user.interface';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public selectedLanguage: string;

  public userLogged = false;
  user: User;

  constructor(
    private readonly translateConfigService: TranslateConfigService,
    private readonly authService: AuthenticationService,
    private readonly navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly ngFireAuth: AngularFireAuth,

  ) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    this.ngFireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userLogged = true;
      } else {
        this.userLogged = false;
      }
    });
  }

  public languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  public async logout() {
    const loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    loadingElement.present();
    this.authService.logout().subscribe({
      next: async () => {
        await this.navCtrl.navigateBack(['home/tabs/map']);
        loadingElement.dismiss();
      },
      complete: () => console.log('logout completed')
    });
  }

  public openPrivacyPage() {
  }

  public deleteButton() {
  }
}
