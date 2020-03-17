import { AuthenticationService } from 'services/authentication/authentication.service';
import { Component } from '@angular/core';
import { TranslateConfigService } from 'services/translate-config.service';
import { LoadingController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public selectedLanguage: string;

  constructor(
    private translateConfigService: TranslateConfigService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
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
        await this.navCtrl.navigateBack(['login']);
        loadingElement.dismiss();
      },
      complete: () => console.log('logout completed')
    });
  }

  private openPrivacyPage() {
  }

  private deleteButton() {
  }
}
