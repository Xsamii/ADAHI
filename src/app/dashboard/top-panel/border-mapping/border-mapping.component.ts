import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../dashboard.service';
import Statistics from '../../statistics.interface';
import { DarkModeService } from '../../../shared/services/dark-mode.service';

@Component({
  selector: 'app-border-mapping',
  standalone: true,
  imports: [CardModule],
  templateUrl: './border-mapping.component.html',
  styleUrl: './border-mapping.component.scss',
})
export class BorderMappingComponent implements OnInit {
  statistics: Statistics;
  isDarkMode = false;
  /**
   *
   */
  constructor(
    private dashboardServcie: DashboardService,
    private darkModeService: DarkModeService
  ) { }
  ngOnInit(): void {
    this.dashboardServcie.getStatistics().subscribe((res) => {
      this.statistics = res;
    });
  }
  ngDoCheck(): void {
    this.isDarkMode = this.darkModeService.currentMode;
  }
}
