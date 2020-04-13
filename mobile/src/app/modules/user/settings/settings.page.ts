import { AuthenticationService } from 'services/authentication.service';
import { Component } from '@angular/core';
import { TranslateConfigService } from 'services/translate-config.service';
import { LoaderService } from 'services/loader.service';

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
    private readonly loaderService: LoaderService,

  ) {
    this.authService.loggedUser.subscribe(u => {
      this.userLogged = !!u;
    })
  }

  public languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  public async logout() {
    try {
    await this.loaderService.showLoader();
    await this.authService.logout();
    await this.loaderService.hideLoader();
    }
    catch(error) {
      window.alert(`error on logout: ${error}`);
      console.log('logout error');
    }
  }

  public openPrivacyPage() {
  }

  public deleteButton() {
  }
}
