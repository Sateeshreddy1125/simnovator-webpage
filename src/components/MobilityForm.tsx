
import React, { useState, useEffect } from 'react';
import { MobilityData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { getMobilityData, saveMobilityData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface MobilityFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const MobilityForm: React.FC<MobilityFormProps> = ({ onPrevious, onNext }) => {
  const [mobilityData, setMobilityData] = useState<MobilityData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getMobilityData();
    if (savedData) {
      setMobilityData(savedData);
    }
  }, []);

  const handleNext = async () => {
    try {
      setLoading(true);
      // Make API call
      await ApiService.saveMobilityData(mobilityData);
      // Save to localStorage
      saveMobilityData(mobilityData);
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

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mobility Configuration</h2>
      </div>

      <div className="cell-container mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Configure the mobility options for user equipment in your test setup.
        </p>
        
        {/* Add mobility specific fields here */}
        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="mobilityStatus" 
              label="Mobility Status" 
              tooltipText="Status of mobility for the test" 
            />
            <CustomSelect
              id="mobilityStatus"
              value=""
              onChange={() => {}}
              options={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes' },
              ]}
            />
          </FormGroup>
        </FormRow>
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
