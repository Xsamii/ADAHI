import { environment } from '../../../environments/environment';
export enum ComponentType {
  Mechanical = 'Mechanical',
  Electrical = 'Electrical',
}
// export const featureLayersConfig: {
//   url: string;
//   title: string;
//   main?: boolean;
//   visible: boolean;
//   component?: ComponentType;
//   subComponent?: string;
//   popupTemp?: any;
// }[] = [
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/31`,
//     title: 'Layout',
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/13`,
//     title: 'Rooms',
//     visible: false,
//   },
//   ////////////////mechanical
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/61`,
//     title: 'Air Terminals',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/53`,
//     title: 'Conduits',
//     subComponent: 'Conduits',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/52`,
//     title: 'Conduits Fittings',
//     subComponent: 'Conduits',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/45`,
//     title: 'Ducts',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/46`,
//     title: 'Duct Fittings',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/47`,
//     title: 'Duct Accessories',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/35`,
//     title: 'Flex Ducts',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/36`,
//     title: 'Fire Alarm Devices',
//     subComponent: 'Fire Fighting',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/9`,
//     title: 'Sprinklers',
//     subComponent: 'Fire Fighting',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/20`,
//     title: 'Pipe Fitting',
//     subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/19`,
//     title: 'Pipes',
//     subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/17`,
//     title: 'Plumbing Fixtures',
//     // subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/24`,
//     title: 'Mechanical Equipments',
//     component: ComponentType.Mechanical,
//     visible: false,
//     main: true,
//     popupTemp: {
//       title: '{family}',
//       content: [
//         {
//           type: 'fields',
//           fieldInfos: [
//             {
//               fieldName: 'bldg_name',
//               label: 'Building Name',
//             },
//             {
//               fieldName: 'docname',
//               label: 'Document Name',
//             },
//             {
//               fieldName: 'docname',
//               label: 'Document Name',
//             },
//             {
//               fieldName: 'sub_discipline',
//               label: 'Sub Discipline',
//             },
//             {
//               fieldName: 'sub_sub_discipline',
//               label: 'Sub Sub Discipline',
//             },
//           ],
//         },
//       ],
//     },
//   },
//   /////////////electrical
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/59`,
//     title: 'Cable Trays',
//     subComponent: 'Cable Trays',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/58`,
//     title: 'Cable Tray Fittings',
//     subComponent: 'Cable Trays',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/43`,
//     title: 'Electrical Fixtures',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/27`,
//     title: 'Lighting Devices',
//     subComponent: 'Lighting',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/26`,
//     title: 'Lighting Fixtures',
//     component: ComponentType.Electrical,
//     subComponent: 'Lighting',
//     visible: false,
//   },
//   {
//     url: `${environment.arcgisServer}Map2804sde/MapServer/44`,
//     title: 'Electrical Equipments',
//     component: ComponentType.Electrical,
//     visible: false,
//     main: true,
//   },
// ];
//https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/71
export const featureLayersConfig: {
  url: string;
  title: string;
  main?: boolean;
  visible: boolean;
  component?: ComponentType;
  subComponent?: string;
  popupTemp?: any;
}[] = [
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/28`,
    title: 'Layout',
    visible: true,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/46`,
    title: 'Rooms',
    visible: true,
    popupTemp: [
      {
        fieldName: 'RoomName',
        label: 'Name',
      },
    ],
  },
  ////////////////mechanical
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/0`,
    title: 'Air Terminals',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/8`,
    title: 'Conduits',
    subComponent: 'Conduits',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/9`,
    title: 'Conduits Fittings',
    subComponent: 'Conduits',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/16`,
    title: 'Ducts',
    subComponent: 'Ducts',
    component: ComponentType.Mechanical,
    visible: false,
    popupTemp: [
      {
        fieldName: 'SourceLength',
        label: 'Length',
      },
      {
        fieldName: 'Duct_Size',
        label: 'Size',
      },
    ],
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/15`,
    title: 'Duct Fittings',
    subComponent: 'Ducts',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/14`,
    title: 'Duct Accessories',
    subComponent: 'Ducts',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/26`,
    title: 'Flex Ducts', //////////
    subComponent: 'Ducts',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/25`,
    title: 'Fire Alarm Devices',
    subComponent: 'Fire Fighting',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/50`,
    title: 'Sprinklers',
    subComponent: 'Fire Fighting',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/39`,
    title: 'Pipe Fitting',
    subComponent: 'Pipes',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/40`,
    title: 'Pipes',
    subComponent: 'Pipes',
    component: ComponentType.Mechanical,
    visible: false,
    popupTemp: [
      {
        fieldName: 'SourceLength',
        label: 'Length',
      },
      {
        fieldName: 'Pipe_Size',
        label: 'Size',
      },
    ],
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/42`,
    title: 'Plumbing Fixtures',
    // subComponent: 'Pipes',
    component: ComponentType.Mechanical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/35`,
    title: 'Mechanical Equipments',
    component: ComponentType.Mechanical,
    visible: false,
    main: true,
  },
  /////////////electrical
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/2`,
    title: 'Cable Trays',
    subComponent: 'Cable Trays',
    component: ComponentType.Electrical,
    visible: false,
    popupTemp: [
      {
        fieldName: 'SourceLength',
        label: 'Length',
      },
      {
        fieldName: 'Size',
        label: 'Size',
      },
    ],
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/3`,
    title: 'Cable Tray Fittings',
    subComponent: 'Cable Trays',
    component: ComponentType.Electrical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/18`,
    title: 'Electrical Fixtures',
    component: ComponentType.Electrical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/32`,
    title: 'Lighting Devices',
    subComponent: 'Lighting',
    component: ComponentType.Electrical,
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/33`,
    title: 'Lighting Fixtures',
    component: ComponentType.Electrical,
    subComponent: 'Lighting',
    visible: false,
  },
  {
    url: `https://localhost:6443/arcgis/rest/services/MAPTHREED/MapServer/17`,
    title: 'Electrical Equipments',
    component: ComponentType.Electrical,
    visible: false,
    main: true,
  },
];
// export const featureLayersConfig: {
//   url: string;
//   title: string;
//   main?: boolean;
//   visible: boolean;
//   component?: ComponentType;
//   subComponent?: string;
//   popupTemp?: any;
// }[] = [
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/28`,
//     title: 'Layout',
//     visible: true,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/46`,
//     title: 'Rooms',
//     visible: true,
//     popupTemp: [
//       {
//         fieldName: 'RoomName',
//         label: 'Name',
//       },
//     ],
//   },
//   ////////////////mechanical
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/0`,
//     title: 'Air Terminals',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/8`,
//     title: 'Conduits',
//     subComponent: 'Conduits',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/9`,
//     title: 'Conduits Fittings',
//     subComponent: 'Conduits',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/16`,
//     title: 'Ducts',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//     popupTemp: [
//       {
//         fieldName: 'SourceLength',
//         label: 'Length',
//       },
//       {
//         fieldName: 'Duct_Size',
//         label: 'Size',
//       },
//     ],
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/15`,
//     title: 'Duct Fittings',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/14`,
//     title: 'Duct Accessories',
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/26`,
//     title: 'Flex Ducts', //////////
//     subComponent: 'Ducts',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/25`,
//     title: 'Fire Alarm Devices',
//     subComponent: 'Fire Fighting',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/50`,
//     title: 'Sprinklers',
//     subComponent: 'Fire Fighting',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/39`,
//     title: 'Pipe Fitting',
//     subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/40`,
//     title: 'Pipes',
//     subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//     popupTemp: [
//       {
//         fieldName: 'SourceLength',
//         label: 'Length',
//       },
//       {
//         fieldName: 'Pipe_Size',
//         label: 'Size',
//       },
//     ],
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/42`,
//     title: 'Plumbing Fixtures',
//     // subComponent: 'Pipes',
//     component: ComponentType.Mechanical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/35`,
//     title: 'Mechanical Equipments',
//     component: ComponentType.Mechanical,
//     visible: false,
//     main: true,
//   },
//   /////////////electrical
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/2`,
//     title: 'Cable Trays',
//     subComponent: 'Cable Trays',
//     component: ComponentType.Electrical,
//     visible: false,
//     popupTemp: [
//       {
//         fieldName: 'SourceLength',
//         label: 'Length',
//       },
//       {
//         fieldName: 'Size',
//         label: 'Size',
//       },
//     ],
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/3`,
//     title: 'Cable Tray Fittings',
//     subComponent: 'Cable Trays',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/18`,
//     title: 'Electrical Fixtures',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/32`,
//     title: 'Lighting Devices',
//     subComponent: 'Lighting',
//     component: ComponentType.Electrical,
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/33`,
//     title: 'Lighting Fixtures',
//     component: ComponentType.Electrical,
//     subComponent: 'Lighting',
//     visible: false,
//   },
//   {
//     url: `https://144.76.146.59:6443/arcgis/rest/services/BIM/Map2505/MapServer/17`,
//     title: 'Electrical Equipments',
//     component: ComponentType.Electrical,
//     visible: false,
//     main: true,
//   },
// ];
