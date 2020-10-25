import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  private supportedLanguages = ['en', 'it', 'ru']

  constructor(
    private translate: TranslateService
  ) { }

  async getDefaultLanguage() {
    let language  = await this.getStoredLanguage()
    if (!language) {
      const browserLanguage = this.translate.getBrowserLang();
      language = this.supportedLanguages.indexOf(browserLanguage) >= 0 ? browserLanguage : 'en'
    }
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang: string) {
    this.translate.use(setLang);
    // noinspection JSIgnoredPromiseFromCall
    this.storeLanguage(setLang)
  }

  translateInstant(key: string) : string{
    return this.translate.instant(key);
  }

  async getStoredLanguage() {
    return (await Storage.get({ key: 'TranslateConfigService.language' }))?.value
  }

  async storeLanguage(language: string) {
    await Storage.set({
      key: 'TranslateConfigService.language',
      value: language
    });
  }
}
