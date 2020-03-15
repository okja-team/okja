import { Component } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  selectedLanguage: string;

  constructor(private translateConfigService: TranslateConfigService){
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  private openPrivacyPage() {
  }

  private deleteButton() {
  }
}
