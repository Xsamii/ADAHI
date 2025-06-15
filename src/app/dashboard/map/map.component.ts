import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { MapService } from './map.service';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { featureLayersConfig } from './featureLayersConfig';
import { flush } from '@angular/core/testing';
import { SideWidgetsComponent } from './side-widgets/side-widgets.component';
import { DashboardService } from '../dashboard.service';
import { ThreeDDashboardService } from '../threeDDashboardService';
import { ThreeDMapService } from './3dMapService';
import { CommonModule } from '@angular/common';
import { CardModalComponent } from './components/card-modal/card-modal.component';
import { Observable } from 'rxjs';
// import { LayerListDialogComponent } from './layer-list-dialog/layer-list-dialog.component';

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [SideWidgetsComponent, CommonModule, CardModalComponent],
})
export class MapComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private dashboardService: DashboardService,
    private threeDDashboardService: ThreeDDashboardService,
    private threeDDMapService: ThreeDMapService,
    private eRef: ElementRef
  ) {}
  layerListToggler: Observable<boolean>;
  basemapToggler: Observable<boolean>;
  infoToggler: Observable<boolean>;
  legendVisible: boolean = false;
  layerlistDisplayer;
  ngOnInit() {
    // this.dashboardService.initMap();
    // this.threeDDashboardService.initMap();
    // this.mapService.addLayerList();
    // this.threeDDMapService.addLayerList();
    // this.mapService.addPopupToFeatureLayer();
    // this.layerListToggler = this.dashboardService.displayLayerList;
    this.layerListToggler = this.threeDDashboardService.displayLayerList;
    this.basemapToggler = this.dashboardService.displayBaseMap;
    this.infoToggler = this.dashboardService.displayInfo;


    this.dashboardService.is3DMode$.subscribe((is3D) => {
    if (is3D) {
      this.activate3DView();
    } else {
      this.activate2DView();
    }
  });

  // Default view
  this.activate2DView();
}

activate2DView() {
  this.dashboardService.initMap();
  this.mapService.addLayerList();
}

activate3DView() {
  this.threeDDashboardService.initMap();
  this.threeDDMapService.addLayerList();
}

  showLegend() {
    this.legendVisible = !this.legendVisible;
    if (this.legendVisible) {
      this.mapService.addLegendToElement('legendContainer');
    } else {
      console.log('legendVisible', this.legendVisible);
    }
  }
}
