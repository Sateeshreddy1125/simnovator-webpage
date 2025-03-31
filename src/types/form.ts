
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
  servingCell?: string;
  externalSim?: string;
  startingSupi?: string;
  mncDigits?: string;
  nextSupi?: string;
  algorithm?: string;
  sharedKey?: string;
  asRelease?: string;
  ueType?: string;
  ueCategory?: string;
  voiceCapability?: boolean;
  uacClass?: string;
  blerOverride?: string;
  integrityAlgorithm?: string[];
  cipherAlgorithm?: string[];
  cqi?: string;
  ri?: string;
  pmi?: string;
}

export interface UserPlaneData {
  id: number;
  profileType?: string;
  subscriberRange?: string;
  dataType?: string;
  transportProtocol?: string;
  destinationIpAddress?: string;
  startingPort?: string;
  pdnType?: string;
  startDelay?: string;
  duration?: string;
  dataLoop?: string;
  dataDirection?: string;
  dlBitrate?: string;
  dlBitrateUnit?: string;
  ulBitrate?: string;
  ulBitrateUnit?: string;
  payloadLength?: string;
  mtuSize?: string;
}

export interface TrafficData {
  id: number;
  profileType?: string;
  profileRange?: string;
  loopProfile?: string;
  attachType?: string;
  attachRate?: string;
  attachDelay?: string;
  powerOnDuration?: string;
}

export interface MobilityData {
  id: number;
  mpId?: string;
  ueGroup?: string;
  tripType?: string;
  loopProfile?: string;
  delay?: string;
  duration?: string;
  waitTime?: string;
  uePositionX?: string;
  uePositionY?: string;
  speed?: string;
  direction?: string;
  distance?: string;
  fadingType?: string;
  noiseSpectralDensity?: string;
}

export interface SettingsData {
  testCaseName: string;
  logSetting: string;
  successSettings: string;
}

export interface FormData {
  cells: CellData[];
  subscribers: SubscriberData[];
  userPlane: UserPlaneData[];
  traffic: TrafficData[];
  mobility: MobilityData[];
  settings: SettingsData;
}

export const STEPS = ["Cell", "Subscriber", "User Plane", "Traffic", "Mobility", "Settings"];
