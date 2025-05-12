import { environment } from '../../../environments/environment';

export const maiLayerFields = [
  {
    name: 'تغطية الخدمات الصحية',
    url: `${environment.arcgisServer}${environment.mapName}/MapServer/59`,
  },
  {
    name: 'تغطية الخدمات الامنية',
    url: `${environment.arcgisServer}${environment.mapName}/MapServer/58`,
  },
  {
    name: 'تغطية الخدمات التعليمية',
    url: `${environment.arcgisServer}${environment.mapName}/MapServer/60`,
  },
  {
    name: 'تغطية الخدمات الترفيهية',
    url: `${environment.arcgisServer}${environment.mapName}/MapServer/61`,
  },
  {
    name: 'تغطية الخدمات الدينية',
    url: `${environment.arcgisServer}${environment.mapName}/MapServer/57`,
  },
];
