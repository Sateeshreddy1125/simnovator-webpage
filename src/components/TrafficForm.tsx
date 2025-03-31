import React, { useState, useEffect } from 'react';
import { TrafficData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { getTrafficData, saveTrafficData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface TrafficFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const TrafficForm: React.FC<TrafficFormProps> = ({ onPrevious, onNext }) => {
  const [trafficProfiles, setTrafficProfiles] = useState<TrafficData[]>([
    {
      id: 1,
      profileType: 'Single',
      profileRange: '',
      loopProfile: '',
      attachType: '',
      attachRate: '',
      attachDelay: '',
      powerOnDuration: '',
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getTrafficData();
    if (savedData && savedData.length > 0) {
      setTrafficProfiles(savedData);
    }
  }, []);

  useEffect(() => {
    // Validate form whenever data changes
    validateForm();
  }, [trafficProfiles]);

  const validateForm = () => {
    let valid = true;
    
    trafficProfiles.forEach(profile => {
      if (!profile.profileRange || !profile.attachType || !profile.attachRate ||
          !profile.powerOnDuration) {
        valid = false;
      }
    });
    
    setIsFormValid(valid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, profileId: number, field: keyof TrafficData) => {
    const { value } = e.target;
    const updatedProfiles = trafficProfiles.map(profile => {
      if (profile.id === profileId) {
        return { ...profile, [field]: value };
      }
      return profile;
    });
    setTrafficProfiles(updatedProfiles);
  };

  const handleSelectChange = (value: string, profileId: number, field: keyof TrafficData) => {
    const updatedProfiles = trafficProfiles.map(profile => {
      if (profile.id === profileId) {
        return { ...profile, [field]: value };
      }
      return profile;
    });
    setTrafficProfiles(updatedProfiles);
  };

  const handleProfileTypeChange = (value: string) => {
    // Update the profile type for all profiles, then manage the number of profiles
    let updatedProfiles = trafficProfiles.map(profile => ({
      ...profile,
      profileType: value
    }));
    
    if (value === 'Single' && updatedProfiles.length > 1) {
      // If changing to Single, keep only the first profile
      updatedProfiles = [updatedProfiles[0]];
      toast({
        title: "Profile type changed to Single",
        description: "Only one profile is allowed in Single mode. Other profiles have been removed.",
      });
    }
    
    setTrafficProfiles(updatedProfiles);
  };

  const addTrafficProfile = () => {
    // Check if we're in Single mode
    if (trafficProfiles[0].profileType === 'Single') {
      toast({
        title: "Cannot add profile",
        description: "In Single profile mode, only one profile is allowed. Change to Mixed to add more profiles.",
        variant: "destructive"
      });
      return;
    }
    
    if (trafficProfiles.length < 3) {
      const newId = Math.max(...trafficProfiles.map(profile => profile.id)) + 1;
      setTrafficProfiles([...trafficProfiles, {
        id: newId,
        profileType: trafficProfiles[0].profileType,
        profileRange: '',
        loopProfile: '',
        attachType: '',
        attachRate: '',
        attachDelay: '',
        powerOnDuration: '',
      }]);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can only add up to 3 traffic profiles",
        variant: "destructive"
      });
    }
  };

  const removeTrafficProfile = (profileId: number) => {
    if (trafficProfiles.length > 1) {
      setTrafficProfiles(trafficProfiles.filter(profile => profile.id !== profileId));
    } else {
      toast({
        title: "Cannot remove profile",
        description: "At least one traffic profile is required",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      
      if (!isFormValid) {
        toast({
          title: "Validation failed",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Make API call
      await ApiService.saveTrafficData(trafficProfiles);
      // Save to localStorage
      saveTrafficData(trafficProfiles);
      onNext();
    } catch (error) {
      console.error('Error saving traffic data:', error);
      toast({
        title: "Error",
        description: "Failed to save traffic data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Define available options for dropdowns
  const profileTypeOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Mixed', label: 'Mixed' },
  ];

  const profileRangeOptions = [
    { value: 'Apply To All', label: 'Apply To All' },
    { value: 'Range #1', label: 'Range #1' },
    { value: 'Range #2', label: 'Range #2' },
    { value: 'Range #3', label: 'Range #3' },
  ];

  const loopProfileOptions = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const attachTypeOptions = [
    { value: 'Bursty', label: 'Bursty' },
    { value: 'Continuous', label: 'Continuous' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Traffic Configuration</h2>
      </div>

      {/* Common header for Profile Type */}
      <div className="mb-4 pb-4 border-b">
        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="profileType-header" 
              label="Profile Type" 
              required
              tooltipText="Type of traffic profile" 
            />
            <CustomSelect
              id="profileType-header"
              value={trafficProfiles[0].profileType}
              onChange={handleProfileTypeChange}
              options={profileTypeOptions}
            />
          </FormGroup>
        </FormRow>
      </div>

      {trafficProfiles.map((profile) => (
        <div key={profile.id} className="cell-container mb-8 border p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Profile #{profile.id}</h3>
            {trafficProfiles.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeTrafficProfile(profile.id)}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`profileRange-${profile.id}`} 
                label="Profile Range" 
                required
                tooltipText="Range of profiles" 
              />
              <CustomSelect
                id={`profileRange-${profile.id}`}
                value={profile.profileRange || ''}
                onChange={(value) => handleSelectChange(value, profile.id, 'profileRange')}
                options={profileRangeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`loopProfile-${profile.id}`} 
                label="Loop Profile" 
                required
                tooltipText="Enable or disable profile looping" 
              />
              <CustomSelect
                id={`loopProfile-${profile.id}`}
                value={profile.loopProfile || ''}
                onChange={(value) => handleSelectChange(value, profile.id, 'loopProfile')}
                options={loopProfileOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`attachType-${profile.id}`} 
                label="Attach Type" 
                required
                tooltipText="Type of attachment" 
              />
              <CustomSelect
                id={`attachType-${profile.id}`}
                value={profile.attachType || ''}
                onChange={(value) => handleSelectChange(value, profile.id, 'attachType')}
                options={attachTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`attachRate-${profile.id}`} 
                label="Attach Rate" 
                required
                tooltipText="Rate of attachment" 
              />
              <CustomInput
                id={`attachRate-${profile.id}`}
                value={profile.attachRate || ''}
                onChange={(e) => handleInputChange(e, profile.id, 'attachRate')}
                type="number"
                placeholder="e.g., 1"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`attachDelay-${profile.id}`} 
                label="Attach Delay (sec)" 
                required
                tooltipText="Delay before attachment" 
              />
              <CustomInput
                id={`attachDelay-${profile.id}`}
                value={profile.attachDelay || ''}
                onChange={(e) => handleInputChange(e, profile.id, 'attachDelay')}
                type="number"
                placeholder="e.g., 0"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`powerOnDuration-${profile.id}`} 
                label="Power ON Duration (sec)" 
                required
                tooltipText="Duration of power on state" 
              />
              <CustomInput
                id={`powerOnDuration-${profile.id}`}
                value={profile.powerOnDuration || ''}
                onChange={(e) => handleInputChange(e, profile.id, 'powerOnDuration')}
                type="number"
                placeholder="e.g., 605"
              />
            </FormGroup>
          </FormRow>
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={addTrafficProfile} 
          className="flex items-center gap-1"
          disabled={trafficProfiles[0].profileType === 'Single'}
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
          disabled={loading || !isFormValid}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default TrafficForm;
