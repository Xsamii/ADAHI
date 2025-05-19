import { Injectable } from '@angular/core';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Extent from '@arcgis/core/geometry/Extent';
import Slider from '@arcgis/core/widgets/Slider';
import Legend from '@arcgis/core/widgets/Legend';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import Graphic from '@arcgis/core/Graphic';
import PopupTemplate from '@arcgis/core/PopupTemplate.js';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle.js';
import Basemap from '@arcgis/core/Basemap.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D.js';
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import Print from '@arcgis/core/widgets/Print';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter.js';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';

import * as reactiveUtuils from '@arcgis/core/core/reactiveUtils';
import {
  getSchemes,
  getSchemeByName,
} from '@arcgis/core/smartMapping/symbology/color';
import { UniqueValueRenderer } from '@arcgis/core/renderers';

import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
type FeatureCounts<T extends string = string> = Record<T, number>;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: Map | undefined;
  private mapView: MapView | undefined;
  public showPopup: boolean = false;
  private layerList: LayerList;
  private popUpTemplate = new PopupTemplate();
  private mainLayer: FeatureLayer;

  private extentArray: __esri.Extent[] = [];
  private currentExtentIndex: number = -1;

  private currentFeatures: BehaviorSubject<__esri.Graphic[]> =
    new BehaviorSubject<__esri.Graphic[]>([]);
  featureCounts$ = new BehaviorSubject<FeatureCounts>({});

  initializeMap(container: string): MapView {
    this.map = new Map({
      basemap: 'satellite',
    });

    this.mapView = new MapView({
      container,
      map: this.map,
      center: [39.910253, 21.420512],
      zoom: 18,
      ui: {
        components: [],
      },
    });
    this.mapView.popupEnabled = true;
    this.mapView.ui.remove('attribution');
    this.mapView.ui.add(
      new Fullscreen({
        view: this.mapView,
        container: 'mapView',
      }),
      'top-left'
    );
    // this.mapView.ui.add(
    //   new Legend({
    //     id: 'legend',
    //     icon: 'templates',
    //     style: 'border-radius:"10px"',
    //     view: this.mapView,
    //     container: 'legendContainer',
    //   }),
    //   'bottom-left'
    // );
    // this.mapView.ui.remove('legend')

    reactiveUtuils.when(
      () => this.mapView.stationary === true,
      () => {
        // console.log('here');
        this.saveExtent(this.mapView.extent);
      }
    );
    let basemapGallery = new BasemapGallery({
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
  getMapView(): MapView | undefined {
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
  ): undefined | FeatureLayer {
    console.log('adding layer ', title);

    if (this.map) {
      // console.log(url);
      let featureLayer: FeatureLayer;
      if (template) {
        featureLayer = new FeatureLayer({
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
        featureLayer = new FeatureLayer({
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
          easing: 'ease-in-out', // Easing function for the animation
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
          easing: 'ease-in-out', // Easing function for the animation
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
          easing: 'ease-in-out', // Easing function for the animation
        }
      );
    }
  }

  getLayers() {
    return this.map;
  }
  filterFeatureLayers(
    featureLayer: FeatureLayer | undefined,
    fieldName: string,
    value: string | number,
    main?: boolean
  ) {
    // console.log(featureLayer);
    if (featureLayer) {
      featureLayer.definitionExpression = `${fieldName} = N'${value}'`;
      const query = new Query({
        where: `${fieldName} = N'${value}'`,
        returnGeometry: true,
        outFields: ['*'],
      });
      //setting only features of main layer
      if (main) {
        featureLayer
          .queryFeatures(query)
          .then((result) => {
            if (result.features.length > 0) {
              let featuresExtent = result.features[0].geometry.extent.clone();
              this.setFeatures(result.features);
              result.features.forEach((feature) => {
                featuresExtent = featuresExtent.union(feature.geometry.extent);
              });

              this.mapView?.goTo(featuresExtent.expand(1));
            } else {
              console.log('No features found.');
            }
          })
          .catch((error) => {
            console.error('Error querying features: ', error);
          });
      }
    }
  }

  filterFeatureLayersWithManyValues(
    featureLayer: FeatureLayer | undefined,
    fieldName: string,
    values: (string | number)[],
    main?: boolean
  ) {
    if (featureLayer) {
      // Convert array of values to a string for SQL 'IN' clause
      const formattedValues = values
        .map((value) => (typeof value === 'string' ? `'${value}'` : value))
        .join(',');

      featureLayer.definitionExpression = `${fieldName} IN (${formattedValues})`;

      const query = new Query({
        where: `${fieldName} IN (${formattedValues})`,
        returnGeometry: true,
        outFields: ['*'],
      });
      // console.log('query', query);

      featureLayer
        .queryFeatures(query)
        .then((result) => {
          // console.log('resulttttt', result);
          if (result.features.length > 0) {
            if (main) {
              // Initialize the extent with the first feature's extent
              let featuresExtent = result.features[0].geometry.extent.clone();
              // console.log('feature layer', featureLayer);
              this.setFeatures(result.features);
              // Iterate over the rest of the features to union their extents
              result.features.forEach((feature) => {
                featuresExtent = featuresExtent.union(feature.geometry.extent);
              });

              this.mapView?.goTo(featuresExtent.expand(1));
            }
          } else {
            // console.log('hereeeeeeeeeeeeeeeee');
            console.log('No features found.');
          }
        })
        .catch((error) => {
          console.error('Error querying features: ', error, featureLayer);
        });
    }
  }
  filterFeatureLayersWithManyFieldsAndValues(
    featureLayer: FeatureLayer | undefined,
    fieldValues: { fieldName: string; values: (string | number)[] }[],
    main?: boolean,
    name?: string
  ) {
    if (featureLayer) {
      // Build the definition expression for each field and its corresponding values
      const queryParts = fieldValues
        .filter(({ values }) => values.length > 0) // Skip fields with empty values array
        .map(({ fieldName, values }) => {
          // Convert array of values to a string for SQL 'IN' clause
          const formattedValues = values
            .map((value) => (typeof value === 'string' ? `N'${value}'` : value))
            .join(',');

          // Return the SQL condition for this field
          return `${fieldName} IN (${formattedValues})`;
        });

      // If no valid queries (all value arrays were empty), exit the function
      if (queryParts.length === 0) {
        this.filterFeatureLayers(featureLayer, '1', '1');
        return;
      }

      // Join all the individual field queries using AND (can be OR if you prefer)
      const newDefinitionExpression = queryParts.join(' AND ');
      console.log('definition', newDefinitionExpression);

      // Set the new query on the feature layer
      featureLayer.definitionExpression = newDefinitionExpression;

      const query = new Query({
        where: newDefinitionExpression, // Use the full combined expression
        returnGeometry: true,
        outFields: ['*'],
      });
      // console.log('query', query);

      featureLayer
        .queryFeatures(query)
        .then((result) => {
          if (result.features.length > 0) {
            if (main) {
              featureLayer.queryFeatureCount(query).then((count) => {
                const currentCounts = this.featureCounts$.value;
                this.featureCounts$.next({
                  ...currentCounts,
                  [name as string]: count,
                });
                console.log('currentCounts', currentCounts);
              });
              // Initialize the extent with the first feature's extent
              // let featuresExtent = result.features[0].geometry.extent.clone();
              this.setFeatures(result.features);
              // // Iterate over the rest of the features to union their extents
              // result.features.forEach((feature) => {
              //   featuresExtent = featuresExtent.union(feature.geometry.extent);
              // });

              // this.mapView?.goTo(featuresExtent.expand(1));
            }
          } else {
            console.log('No features found.');
          }
        })
        .catch((error) => {
          console.error('Error querying features: ', error, featureLayer);
        });
    }
  }

  removeAllFilters(featureLayer: FeatureLayer | undefined, main?: boolean) {
    if (featureLayer) {
      console.log('All filters removed.');
      this.goHome();
      this.filterFeatureLayers(featureLayer, '1', '1', main);
    } else {
      console.log('FeatureLayer is undefined.');
    }
  }
  getAllFieldValues(
    featureLayer: FeatureLayer | undefined,
    fieldName: string,
    whereClause: string = '1=1'
  ): Observable<string[]> {
    return new Observable((observer) => {
      if (!featureLayer) {
        console.error('FeatureLayer is undefined.');
        observer.error('FeatureLayer is undefined.');
        return;
      }

      const query = new Query({
        where: whereClause,
        outFields: [fieldName],
        returnDistinctValues: true,
        returnGeometry: false,
      });

      from(featureLayer.queryFeatures(query)).subscribe({
        next: (result) => {
          const values = result.features.map(
            (feature) => feature.attributes[fieldName]
          );
          observer.next(values);
          observer.complete();
        },
        error: (error) => {
          console.error('Error querying feature layer: ', error);
          observer.error(error);
        },
      });
    });
  }

  setFeatures(newValue: __esri.Graphic[]) {
    // console.log('new values', newValue);
    this.currentFeatures.next(newValue);
  }
  getFeatures() {
    return this.currentFeatures.asObservable();
  }
  ////////////////extent handlers
  private saveExtent(newExtent: __esri.Extent) {
    if (newExtent) {
      // Check if the new extent is already in the array
      const isAlreadySaved = this.extentArray.some((savedExtent) => {
        return savedExtent.equals(newExtent);
      });

      if (!isAlreadySaved) {
        // If the extent is not already saved, push it to the array and update the index
        this.extentArray.push(newExtent.clone());
        this.currentExtentIndex++;
        // console.log('Saved new extent', this.extentArray);
      } else {
        console.log('Extent is already saved');
      }
    }
  }

  goBackExtent(): void {
    if (this.currentExtentIndex > 0) {
      this.currentExtentIndex--;
      const previousExtent = this.extentArray[this.currentExtentIndex];
      this.mapView?.goTo(previousExtent, {
        duration: 300,
        easing: 'ease-in-out',
      });
      console.log('Going back to extent:', previousExtent);
    } else {
      console.log('No previous extent available');
    }
  }

  goForwardExtent(): void {
    if (this.currentExtentIndex < this.extentArray.length - 1) {
      this.currentExtentIndex++;
      const nextExtent = this.extentArray[this.currentExtentIndex];
      this.mapView?.goTo(nextExtent, {
        duration: 300,
        easing: 'ease-in-out',
      });
      console.log('Going forward to extent:', nextExtent);
    } else {
      console.log('No forward extent available');
    }
  }

  getUniqueValues(
    layer: __esri.FeatureLayer,
    field: string
  ): Promise<string[]> {
    // Create a new query object
    const query = layer.createQuery();

    query.where = '1=1';
    query.returnDistinctValues = true;
    query.outFields = [field];
    query.orderByFields = [field];
    query.returnGeometry = false;

    return layer
      .queryFeatures(query)
      .then((result) => {
        const uniqueValues = result.features.map(
          (feature) => feature.attributes[field]
        );
        console.log('unique', uniqueValues);
        return uniqueValues;
      })
      .catch((error) => {
        console.error('Error fetching unique values:', error);
        return [];
      });
  }

  async styleLayerWithUniqueValues(
    layer: __esri.FeatureLayer,
    schemaName: string,
    fieldName: string
  ) {
    try {
      const uniqueValues = await this.getUniqueValues(layer, fieldName);

      const limitedUniqueValues = uniqueValues;

      const scheme = await getSchemeByName({
        basemap: this.mapView.map.basemap,
        geometryType: 'polygon',
        name: 'Basic Random',
        theme: 'high-to-low',
      });

      const schemeColors = scheme.colors.slice(0, limitedUniqueValues.length);

      const uniqueValueInfos = limitedUniqueValues.map((value, index) => ({
        value: value,
        symbol: {
          type: 'simple-fill',
          color: schemeColors[index],
          outline: {
            width: 1,
            color: [0, 0, 0, 0.5],
          },
        },
        label: value,
      }));

      const renderer = new UniqueValueRenderer({
        field: fieldName,
        uniqueValueInfos: uniqueValueInfos,
      });

      layer.renderer = renderer;

      console.log(
        `Layer styled with ${uniqueValues.length} unique values using the ${schemaName} schema.`
      );
    } catch (error) {
      console.error('Error styling the layer:', error);
    }
  }

  updateFeatureLayers(
    layerArray: { url: string; name: string }[],
    layerName: string
  ): void {
    layerArray.forEach((layerInfo) => {
      const layersToRemove = this.map.layers.filter(
        (layer) => layer.title === layerInfo.name
      );
      layersToRemove.forEach((layer) => {
        this.map.remove(layer);
      });
    });

    const layerToAdd = layerArray.find(
      (layerInfo) => layerInfo.name === layerName
    );

    if (layerToAdd) {
      const featureLayer = new FeatureLayer({
        url: layerToAdd.url,
        title: layerToAdd.name,
      });

      this.map.add(featureLayer);
      console.log(`Added layer: ${layerToAdd.name}`);
    } else {
      console.error(`Layer with name "${layerName}" not found in the array.`);
    }
  }
  toggleMultipleLayersVisibility(
    layers: FeatureLayer[],
    visible: boolean
  ): void {
    layers.forEach((layer) => {
      if (layer) {
        layer.visible = visible;
        console.log(`Layer "${layer.title}" visibility set to ${visible}`);
      }
    });
  }
  toggleLayerVisibility(layer: FeatureLayer, visible: boolean): void {
    if (layer) {
      layer.visible = visible;
      // console.log(`Layer "${layer.title}" visibility set to ${visible}`);
    } else {
      console.warn(`Layer is undefined.`);
    }
  }
  async filterLayerByIntersection(
    roomQuery: string,
    roomLayer: FeatureLayer,
    targetLayer: FeatureLayer,
    name?: string
  ): Promise<void> {
    try {
      // Step 1: Get room geometries
      const roomQueryParams = roomLayer.createQuery();
      roomQueryParams.where = roomQuery;
      roomQueryParams.returnGeometry = true;
      roomQueryParams.outFields = ['*'];

      const roomResult = await roomLayer.queryFeatures(roomQueryParams);
      const roomGeometries = roomResult.features.map((f) => f.geometry);

      if (roomGeometries.length === 0) {
        console.warn('No room geometries found for given query.');
        targetLayer.definitionExpression = '1=0';
        return;
      }

      // Step 2: Spatial query on target layer
      // const spatialQuery = targetLayer.createQuery();
      // spatialQuery.geometry = {
      //   type: 'geometry',
      //   // spatialRelationship: 'intersects',
      //   geometries: roomGeometries,
      // } as any;
      // spatialQuery.spatialRelationship = 'intersects';
      // spatialQuery.returnGeometry = true;
      // spatialQuery.outFields = ['*'];
      const combinedGeometry = geometryEngine.union(
        roomGeometries
      ) as __esri.Geometry;
      const filter = new FeatureFilter({
        spatialRelationship: 'intersects',
        geometry: combinedGeometry,
      });
      const layerView = this.mapView?.layerViews.find(
        (layerView) => layerView.layer === targetLayer
      ) as __esri.FeatureLayerView;
      // console.log(filter);
      layerView.filter = filter;
      console.log(
        'spatial query',
        layerView,
        layerView.filter,
        'asdsdsdadsa',
        filter
      );

      let featuresExtent = roomResult.features[0].geometry.extent.clone();
      // console.log('feature layer', featureLayer);
      // Iterate over the rest of the features to union their extents
      roomResult.features.forEach((feature) => {
        featuresExtent = featuresExtent.union(feature.geometry.extent);
      });

      this.mapView?.goTo(featuresExtent.expand(1));

      // const targetResult = await targetLayer.queryFeatures(spatialQuery);

      // const objectIds = targetResult.features.map(
      //   (f) => f.attributes[targetLayer.objectIdField]
      // );
      // // console.log('spatial query result:', objectIds);

      // // Step 3: Apply filtering to target layer
      // if (targetResult.features.length > 0) {
      //   console.log('here queryyy', targetLayer.objectIdField, name);
      //   targetLayer.definitionExpression = `${'objectid_1'} IN (${objectIds.join(
      //     ','
      //   )})`;
      //   // targetLayer.definitionExpression = '1=0';
      // } else {
      //   console.log('not queryyy', name);
      //   targetLayer.definitionExpression = '1=0';
      // }
    } catch (error) {
      console.error('Error during spatial intersection filter:', error);
      targetLayer.definitionExpression = '1=0';
    }
  }
}
