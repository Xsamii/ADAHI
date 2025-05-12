import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidePanelComponentComponent } from './side-panel-component/side-panel.component';
import { MapComponent } from './map/map.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { CardModule } from 'primeng/card'
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    SidePanelComponentComponent,
    MapComponent,
    TopPanelComponent,
    CardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { }
