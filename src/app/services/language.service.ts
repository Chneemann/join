import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLang);
  }

  /**
   * Switches the language for the application.
   *
   * @param lang A string denoting the language to switch to, either 'en' or 'de'.
   */
  switchLanguage(lang: string) {
    if (lang === 'en') {
      this.currentLang = 'en';
    } else if (lang == 'de') {
      this.currentLang = 'de';
    }
    this.translate.use(this.currentLang);
  }
}
