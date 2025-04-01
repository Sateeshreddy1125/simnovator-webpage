
// Common form options used across different forms
export const profileTypeOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Mixed', label: 'Mixed' },
];

export const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const ratTypeOptions = [
  { value: '4G', label: '4G' },
  { value: '5G SA', label: '5G SA' },
  { value: '5G NSA', label: '5G NSA' },
];

export const duplexModeOptions = [
  { value: 'FDD', label: 'FDD' },
  { value: 'TDD', label: 'TDD' },
];

export const cellTypeOptions = [
  { value: '4G', label: '4G' },
  { value: '5G', label: '5G' },
];

export const subscriberRangeOptions = [
  { value: 'Range #1', label: 'Range #1' },
  { value: 'Range #2', label: 'Range #2' },
  { value: 'Range #3', label: 'Range #3' },
];

export const dataTypeOptions = [
  { value: 'IPERF', label: 'IPERF' },
  { value: 'FTP', label: 'FTP' },
  { value: 'HTTP', label: 'HTTP' },
];

export const transportProtocolOptions = [
  { value: 'UDP', label: 'UDP' },
  { value: 'TCP', label: 'TCP' },
];

export const pdnTypeOptions = [
  { value: 'v4', label: 'v4' },
  { value: 'v6', label: 'v6' },
  { value: 'v4v6', label: 'v4v6' },
];

export const dataLoopOptions = [
  { value: 'Disable', label: 'Disable' },
  { value: 'Enable', label: 'Enable' },
];

export const dataDirectionOptions = [
  { value: 'Both', label: 'Both' },
  { value: 'DL Only', label: 'DL Only' },
  { value: 'UL Only', label: 'UL Only' },
];

export const bitrateUnitOptions = [
  { value: 'Kbps', label: 'Kbps' },
  { value: 'Mbps', label: 'Mbps' },
  { value: 'Gbps', label: 'Gbps' },
];

export const logSettingOptions = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Verbose', label: 'Verbose' },
  { value: 'Debug', label: 'Debug' },
];

export const successSettingsOptions = [
  { value: 'Default', label: 'Default' },
  { value: 'Custom', label: 'Custom' },
];

export const attachTypeOptions = [
  { value: 'Bursty', label: 'Bursty' },
  { value: 'Continuous', label: 'Continuous' },
];

export const loopProfileOptions = [
  { value: 'Disable', label: 'Disable' },
  { value: 'Enable', label: 'Enable' },
  { value: 'Time Based', label: 'Time Based' },
  { value: 'Distance Based', label: 'Distance Based' },
];

export const tripTypeOptions = [
  { value: 'Bidirectional', label: 'Bidirectional' },
  { value: 'Unidirectional', label: 'Unidirectional' },
  { value: 'Static', label: 'Static' },
];

export const fadingTypeOptions = [
  { value: 'AWGN', label: 'AWGN' },
  { value: 'EPA', label: 'EPA' },
  { value: 'EVA', label: 'EVA' },
  { value: 'ETU', label: 'ETU' },
];

// Create configuration for field definitions to make forms more declarative
export const createFieldConfig = (label: string, tooltipText: string, required = true) => ({
  label,
  tooltipText,
  required
});

// Map form types to field configurations
export const userPlaneFields = {
  subscriberRange: createFieldConfig('Subscriber Range', 'Range of subscribers'),
  dataType: createFieldConfig('Data Type', 'Type of data traffic'),
  transportProtocol: createFieldConfig('Transport Protocol', 'Protocol used for transport'),
  destinationIpAddress: createFieldConfig('Destination IP Address', 'Target IP address for traffic'),
  startingPort: createFieldConfig('Starting Port', 'Starting port for connection'),
  pdnType: createFieldConfig('PDN Type', 'Packet Data Network Type'),
  startDelay: createFieldConfig('Start Delay (sec)', 'Initial delay before starting'),
  duration: createFieldConfig('Duration (sec)', 'Duration of the data transfer'),
  dataLoop: createFieldConfig('Data Loop', 'Enable or disable data looping'),
  dataDirection: createFieldConfig('Data Direction', 'Direction of data transfer'),
  dlBitrate: createFieldConfig('DL Bitrate', 'Downlink Bitrate'),
  ulBitrate: createFieldConfig('UL Bitrate', 'Uplink Bitrate'),
  payloadLength: createFieldConfig('Payload Length (bytes)', 'Length of the data payload'),
  mtuSize: createFieldConfig('MTU Size (bytes)', 'Maximum Transmission Unit size'),
};

export const trafficFields = {
  profileRange: createFieldConfig('Profile Range', 'Range of profiles'),
  loopProfile: createFieldConfig('Loop Profile', 'Enable or disable profile looping'),
  attachType: createFieldConfig('Attach Type', 'Type of attachment'),
  attachRate: createFieldConfig('Attach Rate', 'Rate of attachment'),
  attachDelay: createFieldConfig('Attach Delay (sec)', 'Delay before attachment'),
  powerOnDuration: createFieldConfig('Power ON Duration (sec)', 'Duration of power on state'),
};

export const mobilityFields = {
  ueGroup: createFieldConfig('UE Group', 'Group of UEs affected by this mobility pattern'),
  tripType: createFieldConfig('Trip Type', 'Type of trip'),
  loopProfile: createFieldConfig('Loop Profile', 'Profile for looping mobility pattern'),
  delay: createFieldConfig('Delay (sec)', 'Initial delay before starting'),
  duration: createFieldConfig('Duration (sec)', 'Duration of the mobility pattern'),
  waitTime: createFieldConfig('Wait Time(sec)', 'Wait time between movements', false),
  uePositionX: createFieldConfig('UE Position (X,Y)', 'X coordinate of UE position'),
  speed: createFieldConfig('Speed (km/hr)', 'Speed of movement'),
  direction: createFieldConfig('Direction (degrees)', 'Direction of movement in degrees'),
  distance: createFieldConfig('Distance (mtrs)', 'Distance of movement'),
  fadingType: createFieldConfig('Fading Type', 'Type of fading model', false),
  noiseSpectralDensity: createFieldConfig('Noise Spectral Density (dBm/Hz)', 'Noise spectral density', false),
};
