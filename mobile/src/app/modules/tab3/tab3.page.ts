import { AuthenticationService } from 'services/authentication/authentication.service';
import { Component } from '@angular/core';
import { TranslateConfigService } from 'services/translate-config.service';
import { LoadingController, NavController } from '@ionic/angular';
import { UserDataService } from 'services/user-data/user-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public selectedLanguage: string;

  public userLogged = false;

  constructor(
    private readonly translateConfigService: TranslateConfigService,
    private readonly authService: AuthenticationService,
    private readonly navCtrl: NavController,
    private readonly loadingCtrl: LoadingController,
    private readonly userDataService: UserDataService
  ) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  ionViewDidEnter() {
    this.userLogged = this.userDataService.isLoggedIn;
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
