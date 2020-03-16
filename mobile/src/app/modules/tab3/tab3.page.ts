import { AuthenticationService } from 'services/authentication/authentication.service';
import { Component } from '@angular/core';
import { TranslateConfigService } from 'services/translate-config.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  selectedLanguage: string;

  constructor(private translateConfigService: TranslateConfigService, private authService: AuthenticationService){
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  logout() {
    this.authService.signOut();
  }

  private openPrivacyPage() {
  }

  private deleteButton() {
  }
}
