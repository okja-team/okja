import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  private supportedLanguages = ['en', 'it']

  constructor(
    private translate: TranslateService
  ) { }

  getDefaultLanguage(){
    const browserLanguage = this.translate.getBrowserLang();
    const language = this.supportedLanguages.indexOf(browserLanguage) >= 0 ? browserLanguage : 'en'
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang) {
    this.translate.use(setLang);
  }

  translateInstant(key: string) : string{
    return this.translate.instant(key);
  }
}
