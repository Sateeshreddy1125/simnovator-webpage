
import React, { useState, useEffect } from 'react';
import { UserPlaneData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { getUserPlaneData, saveUserPlaneData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface UserPlaneFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const UserPlaneForm: React.FC<UserPlaneFormProps> = ({ onPrevious, onNext }) => {
  const [userPlaneData, setUserPlaneData] = useState<UserPlaneData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getUserPlaneData();
    if (savedData) {
      setUserPlaneData(savedData);
    }
  }, []);

  const handleNext = async () => {
    try {
      setLoading(true);
      // Make API call
      await ApiService.saveUserPlaneData(userPlaneData);
      // Save to localStorage
      saveUserPlaneData(userPlaneData);
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

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">User Plane Configuration</h2>
      </div>

      <div className="cell-container mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Configure the user plane settings for your network test setup.
        </p>
        
        {/* Add user plane specific fields here */}
        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="dataTransferMode" 
              label="Data Transfer Mode" 
              tooltipText="Mode of data transfer in the user plane" 
            />
            <CustomSelect
              id="dataTransferMode"
              value=""
              onChange={() => {}}
              options={[
                { value: 'Standard', label: 'Standard' },
                { value: 'Enhanced', label: 'Enhanced' },
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

export default UserPlaneForm;
