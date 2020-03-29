import { AuthenticationService } from 'services/authentication.service';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateConfigService } from 'services/translate-config.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  public selectedLanguage: string;

  public userLogged = false;

  constructor(
    private readonly translateConfigService: TranslateConfigService,
    private readonly authService: AuthenticationService,
    private readonly loadingCtrl: LoadingController,

  ) {
    this.authService.loggedUser.subscribe(u => {
      this.userLogged = !!u;
    })
  }

  public languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  public async logout() {
    const loadingElement = await this.loadingCtrl.create();
    await loadingElement.present();
    await this.authService.logout();
    await loadingElement.dismiss();
  }

  public openPrivacyPage() {
  }

  public deleteButton() {
  }
}
