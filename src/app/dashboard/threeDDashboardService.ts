import { Injectable } from '@angular/core';
import { MapService } from './map/map.service';
import MapView from '@arcgis/core/views/MapView';
import Scene from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import SceneLayer from '@arcgis/core/layers/SceneLayer';

// import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { featureLayersConfig } from './map/featureLayersConfig';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import Statistics from './statistics.interface';
import { planarArea, geodesicArea } from '@arcgis/core/geometry/geometryEngine';
import Polygon from '@arcgis/core/geometry/Polygon';
import { EngineeringDisciplineType, engineeringDisciplines } from './Descpline';
import { ThreeDMapService } from './map/3dMapService';

@Injectable({ providedIn: 'root' })
export class ThreeDDashboardService {
  private initialized = true;
  private mapView: MapView | undefined;
  private mapScene: SceneView | undefined;
  private featureLayers!: (SceneLayer | undefined)[];
  displayLayerList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  displayBaseMap: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  displayInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  floors: BehaviorSubject<{ name: string; checked: boolean }[]> =
    new BehaviorSubject<{ name: string; checked: boolean }[]>([
      { name: 'Ground Floor', checked: true },
      { name: 'First Floor', checked: false },
      { name: 'Second Floor', checked: false },
      { name: 'Unassigned', checked: false },
    ]);
  floorsValues: { [key: string]: string[] } = {
    'Ground Floor': [
      '02 GF',
      'GROUND FLOOR',
      'GROUND LEVEL',
      '03 GF',
      'Ground',
      '01 Outdoor',
      '02 SE',
      '01 Outdoor  - C',
      'BASEMENT - PART B',
      '00',
      'Ground floor',
      '02 SE',
    ],
    'First Floor': [
      '04 FF',
      'First floor',
      'FIRST FLOOR',
      'LEVEL 1 - A',
      'LEVEL 1 - D',
      'LEVEL 1 - PART A',
      'LEVEL 1 - PART D',
      'LEVEL 1 - PART C',
      'First',
    ],
    'Second Floor': ['Second floor', 'Second floor', '05 SecF'],
    Unassigned: ['__NULL__'],
  };
  components: BehaviorSubject<{ name: string; selected: boolean }[]> =
    new BehaviorSubject<{ name: string; selected: boolean }[]>([
      { name: 'Mechanical', selected: false },
      { name: 'Electrical', selected: false },
    ]);
  buildings: BehaviorSubject<{ name: string; selected: boolean }[]> =
    new BehaviorSubject<{ name: string; selected: boolean }[]>([
      { name: 'ZONE 01', selected: false },
      { name: 'ZONE 02', selected: false },
      { name: 'ZONE 03', selected: false },
      { name: 'ZONE 04', selected: false },
      { name: 'ZONE 05', selected: false },
    ]);
  systems: BehaviorSubject<{ name: string; selected: boolean }[]> =
    new BehaviorSubject<{ name: string; selected: boolean }[]>([
      { name: 'AC SYSTEM', selected: false },
      { name: 'BELTS SYSTEM', selected: false },
      { name: 'BLOOD DRAINAGE', selected: false },
      { name: 'FIREFIGHTING SYSTEM', selected: false },
      { name: 'LPG SYSTEM', selected: false },
      { name: 'REF SYSTEM', selected: false },
      { name: 'REF&AC SYSTEM SYSTEM', selected: false },
      { name: 'VENTILATION SYSTEM', selected: false },
      { name: 'WATER SUPPLY SYSTEM', selected: false },
      { name: 'BELTS SYSTEM', selected: false },
      { name: 'ELECTRICAL SYSTEM', selected: false },
      { name: 'WEIGHT MEASUREMENT', selected: false },
      // { name: 'Domestic Cold Water', selected: false },
      // { name: 'Domestic Hot Water', selected: false },
      // { name: 'Drainage', selected: false },
      // { name: 'Blood Drainage', selected: false },
    ]);
  subComponents: BehaviorSubject<
    { name: string; selected: boolean; type: string }[]
  > = new BehaviorSubject<{ name: string; selected: boolean; type: string }[]>([
    { name: 'Fire Fighting', selected: false, type: 'Mechanical' },
    { name: 'Pipes', selected: false, type: 'Mechanical' },
    { name: 'Ducts', selected: false, type: 'Electrical' },
    { name: 'Conduits', selected: false, type: 'Electrical' },
    // { name: 'Conduits', selected: false, type: 'Electrical' },
    { name: 'Cable Trays', selected: false, type: 'Electrical' },
    { name: 'Lighting', selected: false, type: 'Electrical' },
  ]);
  engineeringDescipline: BehaviorSubject<EngineeringDisciplineType[]> =
    new BehaviorSubject<EngineeringDisciplineType[]>(engineeringDisciplines);
  rooms: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  //   private featuresNames: string[] = [];

  /**
   *
   */
  constructor(private mapService: ThreeDMapService) {}

  initMap() {
    // this.mapView = this.mapService.initializeMap('map');
    this.mapScene = this.mapService.initializeMap('map');

    const generalPOpupTemplate = {
      title: '{Discipline}',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'bldg_name',
              label: 'Building Name',
            },
            {
              fieldName: 'BldgLevel_Desc',
              label: 'Level',
            },
            {
              fieldName: 'docname',
              label: 'Document Name',
            },
            {
              fieldName: 'sub_discipline',
              label: 'Sub Discipline',
            },
            {
              fieldName: 'sub_sub_discipline',
              label: 'Sub Sub Discipline',
            },
            {
              fieldName: 'SYSTEM_NAME',
              label: 'System',
            },
            {
              fieldName: 'Family',
              label: 'Family',
            },
          ],
        },
      ],
    };
    this.featureLayers = featureLayersConfig.map((f) => {
      let popUpTemp = {};
      if (f.popupTemp) {
        const tempTemp = generalPOpupTemplate;
        tempTemp.content[0].fieldInfos.push(...f.popupTemp);
        popUpTemp = tempTemp;
      } else {
        popUpTemp = generalPOpupTemplate;
      }
      return this.mapService.addFeatureLayer(
        f.url,
        f.title,
        f.visible,
        popUpTemp
      );
    });

    this.floors.subscribe((v) => {
      console.log('vvvv', v);
    });
    this.components.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      const selectedComponents = v.filter((c) => c.selected).map((c) => c.name);
    });
    this.subComponents.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      // console.log('sub comp', v);
      const selectedSubComponents = v
        .filter((c) => c.selected)
        .map((c) => c.name);
    });
    this.buildings.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      const selectedBuildings = v.filter((c) => c.selected).map((c) => c.name);
      // console.log('selected buildings', selectedBuildings);
    });
    this.engineeringDescipline.subscribe((v) => {
      if (this.initialized) {
        return;
      }
    });
    this.systems.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      console.log('systemssss', v);
      const compNum = this.components.value.filter((c) => c.selected).length;
      const systemsNum = v.filter((c) => c.selected).length;
      if (compNum === 0 && systemsNum > 0) {
        this.components.next([
          { name: 'Mechanical', selected: true },
          { name: 'Electrical', selected: true },
        ]);
      }
    });

    // this.getuniqueRoomsNames();
    this.initialized = false;

    // this.mapService.filterFeatureLayers(this.featureLayers[2], '1', '1', true);
  }
}
