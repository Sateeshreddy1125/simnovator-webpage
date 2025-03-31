
import React, { useState, useEffect } from 'react';
import { MobilityData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { getMobilityData, saveMobilityData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface MobilityFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const MobilityForm: React.FC<MobilityFormProps> = ({ onPrevious, onNext }) => {
  const [mobilityPatterns, setMobilityPatterns] = useState<MobilityData[]>([
    {
      id: 1,
      mpId: 'MP #1',
      ueGroup: '',
      tripType: '',
      loopProfile: '',
      delay: '',
      duration: '',
      waitTime: '',
      uePositionX: '',
      uePositionY: '',
      speed: '',
      direction: '',
      distance: '',
      fadingType: '',
      noiseSpectralDensity: '',
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getMobilityData();
    if (savedData && savedData.length > 0) {
      setMobilityPatterns(savedData);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, patternId: number, field: keyof MobilityData) => {
    const { value } = e.target;
    const updatedPatterns = mobilityPatterns.map(pattern => {
      if (pattern.id === patternId) {
        return { ...pattern, [field]: value };
      }
      return pattern;
    });
    setMobilityPatterns(updatedPatterns);
  };

  const handleSelectChange = (value: string, patternId: number, field: keyof MobilityData) => {
    const updatedPatterns = mobilityPatterns.map(pattern => {
      if (pattern.id === patternId) {
        return { ...pattern, [field]: value };
      }
      return pattern;
    });
    setMobilityPatterns(updatedPatterns);
  };

  const addMobilityPattern = () => {
    if (mobilityPatterns.length < 3) {
      const newId = Math.max(...mobilityPatterns.map(pattern => pattern.id)) + 1;
      setMobilityPatterns([...mobilityPatterns, {
        id: newId,
        mpId: `MP #${newId}`,
        ueGroup: '',
        tripType: '',
        loopProfile: '',
        delay: '',
        duration: '',
        waitTime: '',
        uePositionX: '',
        uePositionY: '',
        speed: '',
        direction: '',
        distance: '',
        fadingType: '',
        noiseSpectralDensity: '',
      }]);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can only add up to 3 mobility patterns",
        variant: "destructive"
      });
    }
  };

  const removeMobilityPattern = (patternId: number) => {
    if (mobilityPatterns.length > 1) {
      setMobilityPatterns(mobilityPatterns.filter(pattern => pattern.id !== patternId));
    } else {
      toast({
        title: "Cannot remove pattern",
        description: "At least one mobility pattern is required",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      let isValid = true;
      mobilityPatterns.forEach(pattern => {
        if (!pattern.ueGroup || !pattern.tripType || !pattern.loopProfile || !pattern.delay || 
            !pattern.duration || !pattern.speed || !pattern.direction || !pattern.distance) {
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
      await ApiService.saveMobilityData(mobilityPatterns);
      // Save to localStorage
      saveMobilityData(mobilityPatterns);
      onNext();
    } catch (error) {
      console.error('Error saving mobility data:', error);
      toast({
        title: "Error",
        description: "Failed to save mobility data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Define available options for dropdowns
  const ueGroupOptions = [
    { value: 'Range #1', label: 'Range #1' },
    { value: 'Range #2', label: 'Range #2' },
    { value: 'Range #3', label: 'Range #3' },
  ];

  const tripTypeOptions = [
    { value: 'Bidirectional', label: 'Bidirectional' },
    { value: 'Unidirectional', label: 'Unidirectional' },
    { value: 'Static', label: 'Static' },
  ];

  const loopProfileOptions = [
    { value: 'Time Based', label: 'Time Based' },
    { value: 'Distance Based', label: 'Distance Based' },
    { value: 'Disable', label: 'Disable' },
  ];

  const fadingTypeOptions = [
    { value: 'AWGN', label: 'AWGN' },
    { value: 'EPA', label: 'EPA' },
    { value: 'EVA', label: 'EVA' },
    { value: 'ETU', label: 'ETU' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mobility Configuration</h2>
      </div>

      {mobilityPatterns.map((pattern) => (
        <div key={pattern.id} className="cell-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{pattern.mpId}</h3>
            {mobilityPatterns.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeMobilityPattern(pattern.id)}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`ueGroup-${pattern.id}`} 
                label="UE Group" 
                required
                tooltipText="Group of UEs affected by this mobility pattern" 
              />
              <CustomSelect
                id={`ueGroup-${pattern.id}`}
                value={pattern.ueGroup || ''}
                onChange={(value) => handleSelectChange(value, pattern.id, 'ueGroup')}
                options={ueGroupOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`tripType-${pattern.id}`} 
                label="Trip Type" 
                required
                tooltipText="Type of trip" 
              />
              <CustomSelect
                id={`tripType-${pattern.id}`}
                value={pattern.tripType || ''}
                onChange={(value) => handleSelectChange(value, pattern.id, 'tripType')}
                options={tripTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`loopProfile-${pattern.id}`} 
                label="Loop Profile" 
                required
                tooltipText="Profile for looping mobility pattern" 
              />
              <CustomSelect
                id={`loopProfile-${pattern.id}`}
                value={pattern.loopProfile || ''}
                onChange={(value) => handleSelectChange(value, pattern.id, 'loopProfile')}
                options={loopProfileOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`delay-${pattern.id}`} 
                label="Delay (sec)" 
                required
                tooltipText="Initial delay before starting" 
              />
              <CustomInput
                id={`delay-${pattern.id}`}
                value={pattern.delay || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'delay')}
                type="number"
                placeholder="e.g., 5"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`duration-${pattern.id}`} 
                label="Duration (sec)" 
                required
                tooltipText="Duration of the mobility pattern" 
              />
              <CustomInput
                id={`duration-${pattern.id}`}
                value={pattern.duration || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'duration')}
                type="number"
                placeholder="e.g., 600"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`waitTime-${pattern.id}`} 
                label="Wait Time(sec)" 
                tooltipText="Wait time between movements" 
              />
              <CustomInput
                id={`waitTime-${pattern.id}`}
                value={pattern.waitTime || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'waitTime')}
                type="number"
                placeholder="e.g., 0"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`uePositionX-${pattern.id}`} 
                label="UE Position (X,Y)" 
                required
                tooltipText="X coordinate of UE position" 
              />
              <div className="flex space-x-2">
                <CustomInput
                  id={`uePositionX-${pattern.id}`}
                  value={pattern.uePositionX || ''}
                  onChange={(e) => handleInputChange(e, pattern.id, 'uePositionX')}
                  type="number"
                  placeholder="X"
                  className="w-1/2"
                />
                <CustomInput
                  id={`uePositionY-${pattern.id}`}
                  value={pattern.uePositionY || ''}
                  onChange={(e) => handleInputChange(e, pattern.id, 'uePositionY')}
                  type="number"
                  placeholder="Y"
                  className="w-1/2"
                />
              </div>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`speed-${pattern.id}`} 
                label="Speed (km/hr)" 
                required
                tooltipText="Speed of movement" 
              />
              <CustomInput
                id={`speed-${pattern.id}`}
                value={pattern.speed || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'speed')}
                type="number"
                placeholder="e.g., 10"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`direction-${pattern.id}`} 
                label="Direction (degrees)" 
                required
                tooltipText="Direction of movement in degrees" 
              />
              <CustomInput
                id={`direction-${pattern.id}`}
                value={pattern.direction || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'direction')}
                type="number"
                placeholder="e.g., 30"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`distance-${pattern.id}`} 
                label="Distance (mtrs)" 
                required
                tooltipText="Distance of movement" 
              />
              <CustomInput
                id={`distance-${pattern.id}`}
                value={pattern.distance || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'distance')}
                type="number"
                placeholder="e.g., 50"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`fadingType-${pattern.id}`} 
                label="Fading Type" 
                tooltipText="Type of fading model" 
              />
              <CustomSelect
                id={`fadingType-${pattern.id}`}
                value={pattern.fadingType || ''}
                onChange={(value) => handleSelectChange(value, pattern.id, 'fadingType')}
                options={fadingTypeOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`noiseSpectralDensity-${pattern.id}`} 
                label="Noise Spectral Density (dBm/Hz)" 
                tooltipText="Noise spectral density" 
              />
              <CustomInput
                id={`noiseSpectralDensity-${pattern.id}`}
                value={pattern.noiseSpectralDensity || ''}
                onChange={(e) => handleInputChange(e, pattern.id, 'noiseSpectralDensity')}
                placeholder="e.g., -174"
              />
            </FormGroup>
          </FormRow>
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={addMobilityPattern} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Pattern
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

export default MobilityForm;
