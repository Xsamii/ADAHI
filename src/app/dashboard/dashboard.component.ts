import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidePanelComponentComponent } from './side-panel-component/side-panel.component';
import { MapComponent } from './map/map.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { CardModule } from 'primeng/card'
import { CommonModule } from '@angular/common';
import { PreferenceService } from '../shared/services/preference.service';
import { ThreeDMapComponent } from "./map3D/threeDMap.component";
import { DashboardService } from './dashboard.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    SidePanelComponentComponent,
    MapComponent,
    TopPanelComponent,
    CardModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  preference = inject(PreferenceService);
}
