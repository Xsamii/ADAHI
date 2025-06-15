import { Injectable } from '@angular/core';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import MapView from '@arcgis/core/views/MapView';
// import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Extent from '@arcgis/core/geometry/Extent';
import Slider from '@arcgis/core/widgets/Slider';
import Legend from '@arcgis/core/widgets/Legend';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import Graphic from '@arcgis/core/Graphic';
import PopupTemplate from '@arcgis/core/PopupTemplate.js';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle.js';
import Basemap from '@arcgis/core/Basemap.js';

import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import Print from '@arcgis/core/widgets/Print';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';

import * as reactiveUtuils from '@arcgis/core/core/reactiveUtils';
import {
  getSchemes,
  getSchemeByName,
} from '@arcgis/core/smartMapping/symbology/color';
import ScenceLayer from '@arcgis/core/layers/SceneLayer';
import Scene from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';

import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
type FeatureCounts<T extends string = string> = Record<T, number>;

@Injectable({
  providedIn: 'root',
})
export class ThreeDMapService {
  private map: Scene | undefined;
  private mapView: SceneView | undefined;
  public showPopup: boolean = false;
  private layerList: LayerList;
  private popUpTemplate = new PopupTemplate();
  private mainLayer: ScenceLayer;
  roomsLayerView: __esri.FeatureLayerView | undefined;

  private extentArray: __esri.Extent[] = [];
  private currentExtentIndex: number = -1;

  private currentFeatures: BehaviorSubject<__esri.Graphic[]> =
    new BehaviorSubject<__esri.Graphic[]>([]);
  featureCounts$ = new BehaviorSubject<FeatureCounts>({});

  initializeMap(container: string): SceneView {
    this.map = new Scene({
      basemap: 'satellite',
      ground: 'world-elevation',
    });

    this.mapView = new SceneView({
      container,
      map: this.map,
      viewingMode: 'local',
      camera: {
        position: {
          x: 39.910253,
          y: 21.420512,
          z: 500,
          spatialReference: { wkid: 4326 },
        },
        tilt: 65,
      },
      ui: { components: [] },
    });

    this.mapView.ui.remove('attribution');
    this.mapView.ui.add(
      new Fullscreen({
        view: this.mapView,
        container: 'mapView',
      }),
      'top-left'
    );

    reactiveUtuils.when(
      () => this.mapView?.stationary === true,
      () => {
        // this.saveExtent(this.mapView!.extent);
      }
    );

    new BasemapGallery({
      view: this.mapView,
      container: 'baseMapDiv',
      source: [
        Basemap.fromId('topo-vector'),
        Basemap.fromId('hybrid'),
        Basemap.fromId('satellite'),
      ],
    });

    return this.mapView;
  }
  getRoomsLayerView(): __esri.FeatureLayerView | undefined {
    if (this.mapView) {
      const layerViews = this.mapView.layerViews;
      // console.log('layerViews', layerViews);
      this.roomsLayerView = layerViews.find(
        (layerView) => layerView.layer.title === 'Rooms'
      ) as __esri.FeatureLayerView;
      // console.log('roomsLayerView', this.roomsLayerView);
      return this.roomsLayerView;
    }
    return undefined;
  }
  // addLegendToElement(id: string) {
  //   this.mapView.ui.add(
  //     new Legend({
  //       id: 'legend',
  //       icon: 'templates',
  //       style: 'border-radius:"10px"',
  //       view: this.mapView,
  //       container: id,
  //     })
  //   );
  // }

  addLegendToElement(id: string) {
    const legendDiv = document.getElementById(id);
    if (!legendDiv) return;

    legendDiv.innerHTML = '';

    const legend = new Legend({
      view: this.mapView,
      container: legendDiv,
    });

    this.mapView.ui.add(legend, 'manual');
  }
  removeLegend() {
    this.mapView.ui.remove('legend');
  }

  getMapCanvas(): HTMLCanvasElement | undefined {
    return this.mapView?.container.querySelector('canvas') as HTMLCanvasElement;
  }
  getMapView(): SceneView | undefined {
    return this.mapView;
  }
  addLayerList() {
    this.layerList = new LayerList({
      id: 'layerList',
      container: 'layerListDiv',
      view: this.mapView,
      listItemCreatedFunction: async (event) => {
        const item = event.item;
        await item.layer.when();

        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [1],
          visibleElements: {
            labels: true,
            rangeLabels: true,
          },
          icon: 'sliders-horizontal',
        });

        item.panel = {
          content: [slider],
          className: 'esri-icon-sliders-horizontal',
          title: 'Change layer opacity',
        };

        slider.on('thumb-drag', (event) => {
          const { value } = event;
          item.layer.opacity = value;
        });
        // }
      },
    });

    this.layerList.on('trigger-action', (event) => {
      const id = event.action.id;
      const layr = event.item.layer;
      // const visibleLayer =layr.visible;

      if (id === 'increase-opacity') {
        if (layr.opacity < 1) {
          layr.opacity += 0.25;
        }
      } else if (id === 'decrease-opacity') {
        if (layr.opacity > 0) {
          layr.opacity -= 0.25;
        }
      }
    });
  }

  gotToHomeExtent() {}

  clickOnMapHandler(event: any) {
    if (this.showPopup) {
      console.log('event', event);
    }
  }

  addFeatureLayer(
    url: string,
    title: string,
    layerVisible: boolean,
    template?: any
  ): undefined | ScenceLayer {
    console.log('adding layer 3d ', title);

    if (this.map) {
      // console.log(url);
      let featureLayer: ScenceLayer;
      if (template) {
        featureLayer = new ScenceLayer({
          url: url,
          title: title,
          visible: layerVisible,
          popupTemplate: template,
        });
        this.mainLayer = featureLayer;
        featureLayer.when(() => {
          console.log('fields', featureLayer.fields);
        });
      } else {
        featureLayer = new ScenceLayer({
          url: url,
          title: title,
          visible: layerVisible,
        });
      }
      this.map.add(featureLayer);

      return featureLayer;
    }
    return undefined;
  }

  setCenter(longitude: number, latitude: number): void {
    if (this.mapView) {
      // this.mapView.center = [longitude, latitude];
    }
  }

  setZoom(zoomLevel: number): void {
    if (this.mapView) {
      this.mapView.zoom = zoomLevel;
    }
  }
  zoomIn() {
    if (this.mapView) {
      this.mapView.goTo(
        {
          target: this.mapView.extent,
          zoom: this.mapView.zoom + 1,
        },
        {
          duration: 1000, // Animation duration in milliseconds
          //   easing: 'ease-in-out', // Easing function for the animation
        }
      );
      // ++this.mapView.zoom;
    }
  }
  zoomOut() {
    if (this.mapView) {
      this.mapView.goTo(
        {
          target: this.mapView.extent,
          zoom: this.mapView.zoom - 1,
        },
        {
          duration: 1000, // Animation duration in milliseconds
          //   easing: 'ease-in-out', // Easing function for the animation
        }
      );
      // ++this.mapView.zoom;
    }
  }
  goHome() {
    if (this.mapView) {
      this.mapView.goTo(
        {
          center: [39.8579, 21.3891],
          zoom: 10,
        },
        {
          duration: 1000, // Animation duration in milliseconds
          //   easing: 'ease-in-out', // Easing function for the animation
        }
      );
    }
  }

  getLayers() {
    return this.map;
  }
}
