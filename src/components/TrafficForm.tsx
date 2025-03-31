
import React, { useState, useEffect } from 'react';
import { TrafficData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { getTrafficData, saveTrafficData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface TrafficFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const TrafficForm: React.FC<TrafficFormProps> = ({ onPrevious, onNext }) => {
  const [trafficData, setTrafficData] = useState<TrafficData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getTrafficData();
    if (savedData) {
      setTrafficData(savedData);
    }
  }, []);

  const handleNext = async () => {
    try {
      setLoading(true);
      // Make API call
      await ApiService.saveTrafficData(trafficData);
      // Save to localStorage
      saveTrafficData(trafficData);
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

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Traffic Configuration</h2>
      </div>

      <div className="cell-container mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Configure the traffic patterns and load for your network test.
        </p>
        
        {/* Add traffic specific fields here */}
        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="trafficPattern" 
              label="Traffic Pattern" 
              tooltipText="Pattern of network traffic generation" 
            />
            <CustomSelect
              id="trafficPattern"
              value=""
              onChange={() => {}}
              options={[
                { value: 'Constant', label: 'Constant' },
                { value: 'Burst', label: 'Burst' },
                { value: 'Random', label: 'Random' },
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

export default TrafficForm;
