
import { FormData, CellData, SubscriberData, UserPlaneData, TrafficData, MobilityData, SettingsData } from '../types/form';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API calls
export const ApiService = {
  saveCellData: async (data: CellData[]): Promise<CellData[]> => {
    await delay(500); // Simulate network delay
    console.log('API call: Saving cell data', data);
    return data;
  },

  saveSubscriberData: async (data: SubscriberData[]): Promise<SubscriberData[]> => {
    await delay(500);
    console.log('API call: Saving subscriber data', data);
    return data;
  },

  saveUserPlaneData: async (data: UserPlaneData[]): Promise<UserPlaneData[]> => {
    await delay(500);
    console.log('API call: Saving user plane data', data);
    return data;
  },

  saveTrafficData: async (data: TrafficData[]): Promise<TrafficData[]> => {
    await delay(500);
    console.log('API call: Saving traffic data', data);
    return data;
  },

  saveMobilityData: async (data: MobilityData[]): Promise<MobilityData[]> => {
    await delay(500);
    console.log('API call: Saving mobility data', data);
    return data;
  },

  saveSettingsData: async (data: SettingsData): Promise<SettingsData> => {
    await delay(500);
    console.log('API call: Saving settings data', data);
    return data;
  },

  submitAllData: async (data: FormData): Promise<FormData> => {
    await delay(1000);
    console.log('API call: Submitting all data', data);
    return data;
  }
};
