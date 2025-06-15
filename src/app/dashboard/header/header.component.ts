import { PreferenceService } from './../../shared/services/preference.service';
import { Component, inject } from '@angular/core';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  preference = inject(PreferenceService);

  translate = inject(TranslateService);
  dashboardService = inject(DashboardService);
  isDarkMode = false;

  constructor(private darkModeService: DarkModeService, ) {
    this.isDarkMode = this.darkModeService.currentMode;
  }

  toggleDarkMode(): void {
    this.preference.toggleTheme();
    this.isDarkMode = this.darkModeService.currentMode;
  }

logoPath() {
    return this.preference.theme() === 'dark'
      ? '/assets/images/adahi-dark-mode.svg'
      : '/assets/images/adahi-logo.svg';
  }


toggleLang() {
    const current = this.translate.currentLang;
    const next = current === 'ar' ? 'en' : 'ar';
    this.preference.switchLang(next);
  }

  resetFilters(){
    console.log("YOU CLICKEd");

  }

show3D() {
 this.dashboardService.toggle3DMode();
}
}
