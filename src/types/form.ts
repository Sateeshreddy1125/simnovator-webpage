
export interface CellData {
  id: number;
  ratType: string;
  duplexMode?: string;
  band?: string;
  cellType?: string;
  bsId?: string;
  scs?: string;
  bandwidth?: string;
  ntn?: string;
  dlAntennas?: string;
  ulAntennas?: string;
  rfCard?: string;
  txGain?: string;
  rxGain?: string;
  dlNrArfcn?: string;
  ssbNrArfcn?: string;
}

export interface SubscriberData {
  id: number;
  noOfUes: string;
  // Additional subscriber properties as needed
}

export interface UserPlaneData {
  // User plane specific properties
}

export interface TrafficData {
  // Traffic specific properties
}

export interface MobilityData {
  // Mobility specific properties
}

export interface SettingsData {
  testCaseName: string;
  logSetting: string;
  successSettings: string;
}

export interface FormData {
  cells: CellData[];
  subscribers: SubscriberData[];
  userPlane: UserPlaneData;
  traffic: TrafficData;
  mobility: MobilityData;
  settings: SettingsData;
}

export const STEPS = ["Cell", "Subscriber", "User Plane", "Traffic", "Mobility", "Settings"];
