// dark-mode.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly darkModeClass = 'dark';
  private isDarkMode = false;

  constructor() {
    this.initializeTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
  }

  get currentMode(): boolean {
    return this.isDarkMode;
  }

  private initializeTheme(): void {
    const userPreference = localStorage.getItem('darkMode');
    this.isDarkMode = userPreference === 'enabled' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.updateTheme();
  }

  private updateTheme(): void {
    const htmlElement = document.documentElement;

    if (this.isDarkMode) {
      htmlElement.classList.add(this.darkModeClass);
      localStorage.setItem('darkMode', 'enabled');
    } else {
      htmlElement.classList.remove(this.darkModeClass);
      localStorage.setItem('darkMode', 'disabled');
    }
  }
}
