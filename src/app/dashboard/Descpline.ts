export type SubSubDiscipline = {
  name: string;
  selected: boolean;
};

export type SystemNames = {
  [system: string]: SubSubDiscipline[];
};

export type EngineeringDisciplineType = {
  name: string;
  type: 'Mechanical' | 'Electrical';
  selected: boolean;
  subSubDisciplines: SubSubDiscipline[];
  systemNames?: SystemNames;
};

export const engineeringDisciplines: EngineeringDisciplineType[] = [
  {
    name: 'MACHINERY',
    subSubDisciplines: [],
    selected: false,
    type: 'Mechanical',
  },
  {
    name: 'HVAC',
    type: 'Mechanical',
    subSubDisciplines: [
      { name: 'AC', selected: false },
      { name: 'REF', selected: false },
      { name: 'VENTILATION', selected: false },
    ],
    selected: false,
  },
  {
    name: 'FIREFIGHTING',
    type: 'Mechanical',

    subSubDisciplines: [],
    selected: false,
  },
  {
    name: 'PLUMBING',
    type: 'Mechanical',

    subSubDisciplines: [
      { name: 'DRAINAGE', selected: false },
      { name: 'WATER SUPPLY', selected: false },
    ],
    selected: false,
  },

  {
    name: 'LV',
    type: 'Electrical',
    subSubDisciplines: [
      { name: 'DISTRIBUTION PANEL', selected: false },
      { name: 'LIGHTING', selected: false },
      { name: 'CONDUITS', selected: false },
      { name: 'CABLE TRAY', selected: false },
      { name: 'FIRE ALARM', selected: false },
      { name: 'CONTROL PANEL', selected: false },
      { name: 'SMOKE DETECTOR', selected: false },
      { name: 'SOCKET', selected: false },
      { name: 'SWITCH', selected: false },
      { name: 'CAMERA', selected: false },
    ],
    systemNames: {
      'DISTRIBUTION PANEL': [{ name: 'REF', selected: false }],
      LIGHTING: [{ name: 'REF', selected: false }],
      CONDUITS: [
        { name: 'REF', selected: false },
        { name: 'MACHINERY', selected: false },
      ],
    },
    selected: false,
  },
  {
    name: 'MV',
    type: 'Electrical',

    subSubDisciplines: [
      { name: 'CABLE TRAY', selected: false },
      { name: 'SWITCHGEAR', selected: false },
    ],
    systemNames: {
      'CABLE TRAY': [{ name: 'MACHINERY', selected: false }],
      'FIRE ALARM': [{ name: 'REF', selected: false }],
      'CONTROL PANEL': [
        { name: 'MACHINERY', selected: false },
        { name: 'WATER SUPPLY', selected: false },
      ],
      'SMOKE DETECTOR': [{ name: 'WEIGHT MEASUREMENT', selected: false }],
    },
    selected: false,
  },
  {
    name: 'POWER',
    type: 'Electrical',

    subSubDisciplines: [{ name: 'TRANSFORMER', selected: false }],
    systemNames: {},
    selected: false,
  },
  // {
  //   name: 'OTHERS',
  //   systemNames: {
  //     SOCKET: [],
  //     SWITCH: [{ name: 'LIGHTING', selected: false }],
  //     CAMERA: [],
  //   },
  //   selected: false,
  // },
];
