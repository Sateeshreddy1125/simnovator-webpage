
import { FormData } from '../types/form';

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Section-specific functions
export const saveCellData = (data: FormData['cells']): void => {
  saveToLocalStorage('cellData', data);
};

export const getCellData = (): FormData['cells'] => {
  return getFromLocalStorage<FormData['cells']>('cellData', []);
};

export const saveSubscriberData = (data: FormData['subscribers']): void => {
  saveToLocalStorage('subscriberData', data);
};

export const getSubscriberData = (): FormData['subscribers'] => {
  return getFromLocalStorage<FormData['subscribers']>('subscriberData', []);
};

export const saveUserPlaneData = (data: FormData['userPlane']): void => {
  saveToLocalStorage('userPlaneData', data);
};

export const getUserPlaneData = (): FormData['userPlane'] => {
  return getFromLocalStorage<FormData['userPlane']>('userPlaneData', []);
};

export const saveTrafficData = (data: FormData['traffic']): void => {
  saveToLocalStorage('trafficData', data);
};

export const getTrafficData = (): FormData['traffic'] => {
  return getFromLocalStorage<FormData['traffic']>('trafficData', []);
};

export const saveMobilityData = (data: FormData['mobility']): void => {
  saveToLocalStorage('mobilityData', data);
};

export const getMobilityData = (): FormData['mobility'] => {
  return getFromLocalStorage<FormData['mobility']>('mobilityData', []);
};

export const saveSettingsData = (data: FormData['settings']): void => {
  saveToLocalStorage('settingsData', data);
};

export const getSettingsData = (): FormData['settings'] => {
  return getFromLocalStorage<FormData['settings']>('settingsData', {} as FormData['settings']);
};

export const getAllFormData = (): FormData => {
  return {
    cells: getCellData(),
    subscribers: getSubscriberData(),
    userPlane: getUserPlaneData(),
    traffic: getTrafficData(),
    mobility: getMobilityData(),
    settings: getSettingsData(),
  };
};

export const clearAllFormData = (): void => {
  localStorage.removeItem('cellData');
  localStorage.removeItem('subscriberData');
  localStorage.removeItem('userPlaneData');
  localStorage.removeItem('trafficData');
  localStorage.removeItem('mobilityData');
  localStorage.removeItem('settingsData');
};
