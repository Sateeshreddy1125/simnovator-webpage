
// Base interfaces for form data
export interface CellData {
  id: number;
  ratType: string;
  mobility?: string;
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
  showAdvancedSettings?: boolean;
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

// Validation helpers
export type ValidationErrors = Record<string, string>;

export interface FormValidation<T> {
  validate: (data: T[]) => boolean;
  getErrors: (data: T[]) => ValidationErrors;
  isRequired: (field: keyof T) => boolean;
}

// Define wizard steps
export const STEPS = ["Cell", "Subscriber", "User Plane", "Traffic", "Mobility", "Settings"];

// Field requirement configurations
export const requiredCellFields: Array<keyof CellData> = ['ratType', 'mobility', 'duplexMode', 'band', 'cellType'];
export const requiredSubscriberFields: Array<keyof SubscriberData> = ['noOfUes', 'servingCell', 'startingSupi'];
export const requiredUserPlaneFields: Array<keyof UserPlaneData> = [
  'subscriberRange', 'dataType', 'transportProtocol', 'destinationIpAddress', 
  'startingPort', 'pdnType', 'duration', 'dataDirection', 'payloadLength', 'mtuSize'
];
export const requiredTrafficFields: Array<keyof TrafficData> = [
  'profileRange', 'loopProfile', 'attachType', 'attachRate', 'powerOnDuration'
];
export const requiredMobilityFields: Array<keyof MobilityData> = [
  'ueGroup', 'tripType', 'loopProfile', 'delay', 'duration', 
  'speed', 'direction', 'distance'
];
export const requiredSettingsFields: Array<keyof SettingsData> = [
  'testCaseName', 'logSetting', 'successSettings'
];

// Create validation helper function
export function createValidator<T>(requiredFields: Array<keyof T>): FormValidation<T> {
  return {
    validate: (data: T[]) => {
      if (!data || data.length === 0) return false;
      
      for (const item of data) {
        for (const field of requiredFields) {
          if (item[field] === undefined || item[field] === null || item[field] === '') {
            return false;
          }
        }
      }
      return true;
    },
    getErrors: (data: T[]) => {
      const errors: ValidationErrors = {};
      
      if (!data || data.length === 0) {
        errors['general'] = 'No data provided';
        return errors;
      }
      
      data.forEach((item, index) => {
        requiredFields.forEach(field => {
          if (item[field] === undefined || item[field] === null || item[field] === '') {
            errors[`${index}-${String(field)}`] = `${String(field)} is required`;
          }
        });
      });
      
      return errors;
    },
    isRequired: (field: keyof T) => requiredFields.includes(field)
  };
}

// Export validators for each form type
export const cellValidator = createValidator<CellData>(requiredCellFields);
export const subscriberValidator = createValidator<SubscriberData>(requiredSubscriberFields);
export const userPlaneValidator = createValidator<UserPlaneData>(requiredUserPlaneFields);
export const trafficValidator = createValidator<TrafficData>(requiredTrafficFields);
export const mobilityValidator = createValidator<MobilityData>(requiredMobilityFields);
export const settingsValidator = createValidator<SettingsData>(requiredSettingsFields);
