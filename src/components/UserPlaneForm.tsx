
import React, { useState, useEffect } from 'react';
import { UserPlaneData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { getUserPlaneData, saveUserPlaneData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface UserPlaneFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const UserPlaneForm: React.FC<UserPlaneFormProps> = ({ onPrevious, onNext }) => {
  const [userPlanes, setUserPlanes] = useState<UserPlaneData[]>([
    {
      id: 1,
      profileType: 'Single',
      subscriberRange: '',
      dataType: '',
      transportProtocol: '',
      destinationIpAddress: '',
      startingPort: '',
      pdnType: '',
      startDelay: '',
      duration: '',
      dataLoop: '',
      dataDirection: '',
      dlBitrate: '',
      dlBitrateUnit: 'Mbps',
      ulBitrate: '',
      ulBitrateUnit: 'Mbps',
      payloadLength: '',
      mtuSize: '',
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getUserPlaneData();
    if (savedData && savedData.length > 0) {
      setUserPlanes(savedData);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, userPlaneId: number, field: keyof UserPlaneData) => {
    const { value } = e.target;
    const updatedUserPlanes = userPlanes.map(userPlane => {
      if (userPlane.id === userPlaneId) {
        return { ...userPlane, [field]: value };
      }
      return userPlane;
    });
    setUserPlanes(updatedUserPlanes);
  };

  const handleSelectChange = (value: string, userPlaneId: number, field: keyof UserPlaneData) => {
    const updatedUserPlanes = userPlanes.map(userPlane => {
      if (userPlane.id === userPlaneId) {
        return { ...userPlane, [field]: value };
      }
      return userPlane;
    });
    setUserPlanes(updatedUserPlanes);
  };

  const addUserPlane = () => {
    if (userPlanes.length < 3) {
      const newId = Math.max(...userPlanes.map(up => up.id)) + 1;
      setUserPlanes([...userPlanes, {
        id: newId,
        profileType: 'Single',
        subscriberRange: '',
        dataType: '',
        transportProtocol: '',
        destinationIpAddress: '',
        startingPort: '',
        pdnType: '',
        startDelay: '',
        duration: '',
        dataLoop: '',
        dataDirection: '',
        dlBitrate: '',
        dlBitrateUnit: 'Mbps',
        ulBitrate: '',
        ulBitrateUnit: 'Mbps',
        payloadLength: '',
        mtuSize: '',
      }]);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can only add up to 3 user plane profiles",
        variant: "destructive"
      });
    }
  };

  const removeUserPlane = (userPlaneId: number) => {
    if (userPlanes.length > 1) {
      setUserPlanes(userPlanes.filter(up => up.id !== userPlaneId));
    } else {
      toast({
        title: "Cannot remove profile",
        description: "At least one user plane profile is required",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      let isValid = true;
      userPlanes.forEach(userPlane => {
        if (!userPlane.subscriberRange || !userPlane.dataDirection || 
            (!userPlane.dlBitrate && userPlane.dataDirection !== 'UL Only') || 
            (!userPlane.ulBitrate && userPlane.dataDirection !== 'DL Only')) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Make API call
      await ApiService.saveUserPlaneData(userPlanes);
      // Save to localStorage
      saveUserPlaneData(userPlanes);
      onNext();
    } catch (error) {
      console.error('Error saving user plane data:', error);
      toast({
        title: "Error",
        description: "Failed to save user plane data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Define available options for dropdowns
  const profileTypeOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Multiple', label: 'Multiple' },
  ];

  const rangeOptions = [
    { value: 'Range #1', label: 'Range #1' },
    { value: 'Range #2', label: 'Range #2' },
    { value: 'Range #3', label: 'Range #3' },
  ];

  const dataTypeOptions = [
    { value: 'IPERF', label: 'IPERF' },
    { value: 'FTP', label: 'FTP' },
    { value: 'HTTP', label: 'HTTP' },
  ];

  const transportProtocolOptions = [
    { value: 'UDP', label: 'UDP' },
    { value: 'TCP', label: 'TCP' },
  ];

  const pdnTypeOptions = [
    { value: 'v4', label: 'v4' },
    { value: 'v6', label: 'v6' },
    { value: 'v4v6', label: 'v4v6' },
  ];

  const dataLoopOptions = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const dataDirectionOptions = [
    { value: 'Both', label: 'Both' },
    { value: 'DL Only', label: 'DL Only' },
    { value: 'UL Only', label: 'UL Only' },
  ];

  const bitrateUnitOptions = [
    { value: 'Kbps', label: 'Kbps' },
    { value: 'Mbps', label: 'Mbps' },
    { value: 'Gbps', label: 'Gbps' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">User Plane Configuration</h2>
      </div>

      {userPlanes.map((userPlane) => (
        <div key={userPlane.id} className="cell-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">UP #{userPlane.id}</h3>
            {userPlanes.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeUserPlane(userPlane.id)}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`profileType-${userPlane.id}`} 
                label="Profile Type" 
                tooltipText="Type of user plane profile" 
              />
              <CustomSelect
                id={`profileType-${userPlane.id}`}
                value={userPlane.profileType || 'Single'}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'profileType')}
                options={profileTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`subscriberRange-${userPlane.id}`} 
                label="Subscriber Range" 
                required
                tooltipText="Range of subscribers" 
              />
              <CustomSelect
                id={`subscriberRange-${userPlane.id}`}
                value={userPlane.subscriberRange || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'subscriberRange')}
                options={rangeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`dataType-${userPlane.id}`} 
                label="Data Type" 
                tooltipText="Type of data traffic" 
              />
              <CustomSelect
                id={`dataType-${userPlane.id}`}
                value={userPlane.dataType || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'dataType')}
                options={dataTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`transportProtocol-${userPlane.id}`} 
                label="Transport Protocol" 
                tooltipText="Protocol used for transport" 
              />
              <CustomSelect
                id={`transportProtocol-${userPlane.id}`}
                value={userPlane.transportProtocol || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'transportProtocol')}
                options={transportProtocolOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`destinationIpAddress-${userPlane.id}`} 
                label="Destination IP Address" 
                required
                tooltipText="Target IP address for traffic" 
              />
              <CustomInput
                id={`destinationIpAddress-${userPlane.id}`}
                value={userPlane.destinationIpAddress || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'destinationIpAddress')}
                placeholder="e.g., 192.168.1.1"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`startingPort-${userPlane.id}`} 
                label="Starting Port" 
                required
                tooltipText="Starting port for connection" 
              />
              <CustomInput
                id={`startingPort-${userPlane.id}`}
                value={userPlane.startingPort || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'startingPort')}
                type="number"
                placeholder="e.g., 5000"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`pdnType-${userPlane.id}`} 
                label="PDN Type" 
                required
                tooltipText="Packet Data Network Type" 
              />
              <CustomSelect
                id={`pdnType-${userPlane.id}`}
                value={userPlane.pdnType || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'pdnType')}
                options={pdnTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`startDelay-${userPlane.id}`} 
                label="Start Delay (sec)" 
                tooltipText="Initial delay before starting" 
              />
              <CustomInput
                id={`startDelay-${userPlane.id}`}
                value={userPlane.startDelay || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'startDelay')}
                type="number"
                placeholder="e.g., 5"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`duration-${userPlane.id}`} 
                label="Duration (sec)" 
                required
                tooltipText="Duration of the data transfer" 
              />
              <CustomInput
                id={`duration-${userPlane.id}`}
                value={userPlane.duration || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'duration')}
                type="number"
                placeholder="e.g., 600"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`dataLoop-${userPlane.id}`} 
                label="Data Loop" 
                tooltipText="Enable or disable data looping" 
              />
              <CustomSelect
                id={`dataLoop-${userPlane.id}`}
                value={userPlane.dataLoop || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'dataLoop')}
                options={dataLoopOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`dataDirection-${userPlane.id}`} 
                label="Data Direction" 
                required
                tooltipText="Direction of data transfer" 
              />
              <CustomSelect
                id={`dataDirection-${userPlane.id}`}
                value={userPlane.dataDirection || ''}
                onChange={(value) => handleSelectChange(value, userPlane.id, 'dataDirection')}
                options={dataDirectionOptions}
              />
            </FormGroup>
          </FormRow>

          {(userPlane.dataDirection === 'Both' || userPlane.dataDirection === 'DL Only') && (
            <FormRow>
              <FormGroup>
                <FormLabel 
                  htmlFor={`dlBitrate-${userPlane.id}`} 
                  label="DL Bitrate" 
                  required
                  tooltipText="Downlink Bitrate" 
                />
                <div className="flex">
                  <CustomInput
                    id={`dlBitrate-${userPlane.id}`}
                    value={userPlane.dlBitrate || ''}
                    onChange={(e) => handleInputChange(e, userPlane.id, 'dlBitrate')}
                    type="number"
                    placeholder="e.g., 150"
                    className="flex-1 mr-2"
                  />
                  <CustomSelect
                    id={`dlBitrateUnit-${userPlane.id}`}
                    value={userPlane.dlBitrateUnit || 'Mbps'}
                    onChange={(value) => handleSelectChange(value, userPlane.id, 'dlBitrateUnit')}
                    options={bitrateUnitOptions}
                    className="w-24"
                  />
                </div>
              </FormGroup>
            </FormRow>
          )}

          {(userPlane.dataDirection === 'Both' || userPlane.dataDirection === 'UL Only') && (
            <FormRow>
              <FormGroup>
                <FormLabel 
                  htmlFor={`ulBitrate-${userPlane.id}`} 
                  label="UL Bitrate" 
                  required
                  tooltipText="Uplink Bitrate" 
                />
                <div className="flex">
                  <CustomInput
                    id={`ulBitrate-${userPlane.id}`}
                    value={userPlane.ulBitrate || ''}
                    onChange={(e) => handleInputChange(e, userPlane.id, 'ulBitrate')}
                    type="number"
                    placeholder="e.g., 50"
                    className="flex-1 mr-2"
                  />
                  <CustomSelect
                    id={`ulBitrateUnit-${userPlane.id}`}
                    value={userPlane.ulBitrateUnit || 'Mbps'}
                    onChange={(value) => handleSelectChange(value, userPlane.id, 'ulBitrateUnit')}
                    options={bitrateUnitOptions}
                    className="w-24"
                  />
                </div>
              </FormGroup>
            </FormRow>
          )}

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`payloadLength-${userPlane.id}`} 
                label="Payload Length (bytes)" 
                tooltipText="Length of the data payload" 
              />
              <CustomInput
                id={`payloadLength-${userPlane.id}`}
                value={userPlane.payloadLength || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'payloadLength')}
                type="number"
                placeholder="e.g., 1000"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`mtuSize-${userPlane.id}`} 
                label="MTU Size (bytes)" 
                tooltipText="Maximum Transmission Unit size" 
              />
              <CustomInput
                id={`mtuSize-${userPlane.id}`}
                value={userPlane.mtuSize || ''}
                onChange={(e) => handleInputChange(e, userPlane.id, 'mtuSize')}
                type="number"
                placeholder="e.g., 1500"
              />
            </FormGroup>
          </FormRow>
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={addUserPlane} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Profile
        </Button>
      </div>

      <div className="flex justify-between">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="bg-gray-100"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext} 
          className="next-button" 
          disabled={loading}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default UserPlaneForm;
