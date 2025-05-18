import { Injectable } from '@angular/core';
import { MapService } from './map/map.service';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { featureLayersConfig } from './map/featureLayersConfig';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import Statistics from './statistics.interface';
import { planarArea, geodesicArea } from '@arcgis/core/geometry/geometryEngine';
import Polygon from '@arcgis/core/geometry/Polygon';
import { EngineeringDisciplineType, engineeringDisciplines } from './Descpline';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private initialized = true;
  private mapView: MapView | undefined;
  private featureLayers!: (FeatureLayer | undefined)[];
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
    ]);
  floorsValues: { [key: string]: string[] } = {
    'Ground Floor': ['02 GF', 'GROUND FLOOR', 'GROUND LEVEL', '03 GF'],
    'First Floor': [
      '04 FF',
      'FIRST FLOOR',
      'LEVEL 1 - A',
      'LEVEL 1 - D',
      'LEVEL 1 - PART C',
    ],
    'Second Floor': ['Second floor', 'Second floor', '05 SecF'],
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
  constructor(private mapService: MapService) {}

  initMap() {
    this.mapView = this.mapService.initializeMap('map');

    const generalPOpupTemplate = {
      title: '{family}',
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
      this.applyAllFilters();
      this.getuniqueRoomsNames();
    });
    this.components.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      const selectedComponents = v.filter((c) => c.selected).map((c) => c.name);
      this.handleComponentChange(selectedComponents);
    });
    this.subComponents.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      // console.log('sub comp', v);
      const selectedSubComponents = v
        .filter((c) => c.selected)
        .map((c) => c.name);
      this.handleSubComponentChange(selectedSubComponents);
    });
    this.buildings.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      const selectedBuildings = v.filter((c) => c.selected).map((c) => c.name);
      // console.log('selected buildings', selectedBuildings);
      this.handleBuildingChange(selectedBuildings);
    });
    this.engineeringDescipline.subscribe((v) => {
      if (this.initialized) {
        return;
      }
      // console.log('engineering descipline', v);
      this.applyAllFilters();
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
      this.applyAllFilters();
    });
    this.applyAllFilters();
    // this.getuniqueRoomsNames();
    this.initialized = false;

    // this.mapService.filterFeatureLayers(this.featureLayers[2], '1', '1', true);
  }

  filterOnFloor(values: string[]) {
    console.log('floor values', values);
    this.featureLayers.forEach((layer, idx) => {
      console.log('layer', idx);
      this.mapService.filterFeatureLayersWithManyValues(
        this.featureLayers[idx],
        'BldgLevel_Desc',
        values
      );
    });
  }
  handleComponentChange(valeus: string[]) {
    // console.log('event', featureLayersConfig);
    const layers = featureLayersConfig.map((layer) => {
      if (valeus.includes(layer.component as string)) {
        layer.visible = true;
      } else if (!layer.component) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
      return layer;
    });
    layers.forEach((layer, idx) => {
      this.mapService.toggleLayerVisibility(
        this.featureLayers[idx],
        layer.visible
      );
    });
  }
  handleSubComponentChange(valeus: string[]) {
    // console.log('event', featureLayersConfig);
    const layers = featureLayersConfig.map((layer) => {
      if (valeus.includes(layer.subComponent as string)) {
        layer.visible = true;
      } else if (!layer.subComponent && !layer.component) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
      return layer;
    });
    console.log('layers', layers);
    layers.forEach((layer, idx) => {
      this.mapService.toggleLayerVisibility(
        this.featureLayers[idx],
        layer.visible
      );
    });
  }

  getNamesOfLayer() {
    console.log('this feature ', this.featureLayers[3]);
  }

  getFeaturesFieldValues(fieldName: string): Observable<string[]> {
    return this.mapService.getAllFieldValues(this.featureLayers[2], fieldName);
  }

  getStatistics(): Observable<Statistics> {
    return this.mapService.getFeatures().pipe(
      map((features) => {
        console.log('ffffffffff', features.length);
        // Transform the array of Esri Graphics to a Statistics object
        let mechEquip = features.length;
        // let mechEquip = features.reduce((sum, feature) => {
        //   return sum + feature.attributes['join_count_1'];
        // }, 0);
        let elecEquip = features.reduce((sum, feature) => {
          return sum + feature.attributes['join_count_1'];
        }, 0);

        return {
          mechEquip: mechEquip,
          elecEquip: 20,
        } as Statistics;
      })
    );
  }
  toggleLayerList() {
    this.displayLayerList.next(!this.displayLayerList.value);
  }
  toggleBaseMap() {
    this.displayBaseMap.next(!this.displayBaseMap.value);
  }
  toggleInfo() {
    this.displayInfo.next(!this.displayInfo.value);
  }
  closeCards() {
    this.displayLayerList.next(false);
    this.displayBaseMap.next(false);
    this.displayInfo.next(false);
  }
  clearUIFiltersLocations() {
    //to do
  }
  clearUIFiltersMethods() {
    //to do
  }
  //filter on criteria handler

  handleStandardsSearch(layerName: string, layers) {
    console.log('kkkkk');
    this.mapService.updateFeatureLayers(layers, layerName);
  }
  handleBuildingChange(values: string[]) {
    this.featureLayers.forEach((layer, idx) => {
      this.mapService.filterFeatureLayersWithManyFieldsAndValues(layer, [
        { fieldName: 'Bldg_Name', values: values },
      ]);
    });
  }
  applyAllFilters(): void {
    console.log('apply all filters');
    const selectedFloor = this.floors.value.find((f) => f.checked)?.name;
    const floorValues = selectedFloor ? this.floorsValues[selectedFloor] : [];

    const buildingValues = this.buildings.value
      .filter((b) => b.selected)
      .map((b) => b.name);

    const subDisciplineValues = this.engineeringDescipline.value
      .filter((d) => d.selected)
      .map((d) => d.name);

    const subSubDisciplineValues: string[] = [];
    const systemValues: string[] = this.systems.value
      .filter((s) => s.selected)
      .map((s) => s.name);

    this.engineeringDescipline.value
      .filter((d) => d.selected)
      .forEach((d) => {
        if (d.subSubDisciplines) {
          subSubDisciplineValues.push(
            ...d.subSubDisciplines.filter((s) => s.selected).map((s) => s.name)
          );
        }
        if (d.systemNames) {
          Object.values(d.systemNames).forEach((subs) =>
            subSubDisciplineValues.push(
              ...subs.filter((s) => s.selected).map((s) => s.name)
            )
          );
        }
      });

    // const filterFields = [
    //   { fieldName: 'BldgLevel_Desc', values: floorValues },
    //   { fieldName: 'Bldg_Name', values: buildingValues },
    //   { fieldName: 'SUB_DISCIPLINE', values: subDisciplineValues },
    //   { fieldName: 'SUB_SUB_DISCIPLINE', values: subSubDisciplineValues },
    // ];
    // console.log('filtering sub sub ', subSubDisciplineValues);
    // Apply filters to each layer
    featureLayersConfig.forEach((layerConfig, idx) => {
      let filterFields;
      if (layerConfig.component) {
        filterFields = [
          { fieldName: 'BldgLevel_Desc', values: floorValues },
          { fieldName: 'Bldg_Name', values: buildingValues },
          { fieldName: 'SUB_DISCIPLINE', values: subDisciplineValues },
          { fieldName: 'SUB_SUB_DISCIPLINE', values: subSubDisciplineValues },
          { fieldName: 'SYSTEM_NAME', values: systemValues },
        ];
      } else {
        filterFields = [
          { fieldName: 'BldgLevel_Desc', values: floorValues },
          { fieldName: 'Bldg_Name', values: buildingValues },
          // { fieldName: 'SUB_DISCIPLINE', values: subDisciplineValues },
          // { fieldName: 'SUB_SUB_DISCIPLINE', values: subSubDisciplineValues },
        ];
      }

      this.mapService.filterFeatureLayersWithManyFieldsAndValues(
        this.featureLayers[idx],
        filterFields,
        layerConfig.main,
        layerConfig.title
      );
    });
    // this.featureLayers.forEach((layer) => {
    //   if (!layer) return; // Skip if layer is undefined
    //   this.mapService.filterFeatureLayersWithManyFieldsAndValues(
    //     layer,
    //     filterFields
    //   );
    // });
  }
  getSubSubDisciplinesFromSelectedSubDisciplines(): string[] {
    const selectedDisciplines = this.engineeringDescipline.value.filter(
      (d) => d.selected
    );
    const subSubDisciplineValues: string[] = [];

    selectedDisciplines.forEach((d) => {
      if (d.subSubDisciplines) {
        subSubDisciplineValues.push(...d.subSubDisciplines.map((s) => s.name));
      }
      // if (d.systemNames) {
      //   Object.values(d.systemNames).forEach((subs) => {
      //     subSubDisciplineValues.push(...subs.map((s) => s.name));
      //   });
      // }
    });

    // Remove duplicates
    return Array.from(new Set(subSubDisciplineValues));
  }
  getuniqueRoomsNames() {
    const selectedFloor = this.floors.value.find((f) => f.checked)?.name;
    console.log('get unique rooms', selectedFloor);
    const floorValues = selectedFloor ? this.floorsValues[selectedFloor] : [];

    // if (floorValues.length === 0) {
    //   return new Observable((observer) => {
    //     observer.next([]);
    //     observer.complete();
    //   });
    // }

    const floorClause = `BldgLevel_Desc IN (${floorValues
      .map((f) => `'${f}'`)
      .join(', ')})`;
    this.mapService
      .getAllFieldValues(this.featureLayers[1], 'RoomName', floorClause)
      .subscribe((rooms) => {
        // console.log('rooms', rooms);
        const uniqueRooms = Array.from(new Set(rooms));
        console.log('unique rooms', uniqueRooms);
        this.rooms.next(uniqueRooms);
      });
  }
  filterOnRooms(values: string[]) {
    if (!values || values.length === 0) {
      // Optionally reset the layer if no rooms are selected
      this.featureLayers[0].definitionExpression = '1=1';
      return;
    }
    const selectedFloor = this.floors.value.find((f) => f.checked)?.name;
    const floorValues = selectedFloor ? this.floorsValues[selectedFloor] : [];

    // if (floorValues.length === 0) {
    //   return new Observable((observer) => {
    //     observer.next([]);
    //     observer.complete();
    //   });
    // }

    const floorClause = `BldgLevel_Desc IN (${floorValues
      .map((f) => `'${f}'`)
      .join(', ')})`;

    const formattedValues = values.map((val) => `'${val}'`).join(', ');
    const roomQuery = `RoomName IN (${formattedValues})`;
    const fullQuery = `${roomQuery} AND ${floorClause}`;
    featureLayersConfig.forEach((layerConfig, idx) => {
      if (layerConfig.component) {
        // console.log('component layer', layerConfig.title);
        this.mapService.filterLayerByIntersection(
          roomQuery,
          this.featureLayers[1],
          this.featureLayers[idx],
          layerConfig.title
        );
      }
    });
  }
}
