import { Injectable, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class PreferenceService {
  private readonly THEME_KEY = 'preferred-theme';
  private readonly DIR_KEY = 'dir';
  private readonly LANG_KEY = 'lang';

  theme = signal<'light' | 'dark'>(this.getInitialTheme());
  dir = signal<'rtl' | 'ltr'>(this.getInitialDir());

  constructor(private translate: TranslateService, private router: Router) {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
      document.documentElement.setAttribute('dir', this.dir());
    });

    const savedLang = localStorage.getItem(this.LANG_KEY);
    const defaultLang = savedLang || 'en';
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use(defaultLang);
  }

  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    localStorage.setItem(this.THEME_KEY, next);
  }

  switchLang(lang: 'en' | 'ar') {
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.dir.set(newDir);
    localStorage.setItem(this.DIR_KEY, newDir);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  private getInitialTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') ?? 'light';
  }

  private getInitialDir(): 'rtl' | 'ltr' {
    return (localStorage.getItem(this.DIR_KEY) as 'rtl' | 'ltr') ?? 'ltr';
  }

  logout() {
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
