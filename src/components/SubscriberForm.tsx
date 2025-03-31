
import React, { useState, useEffect } from 'react';
import { SubscriberData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSubscriberData, saveSubscriberData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface SubscriberFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({ onPrevious, onNext }) => {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([
    {
      id: 1,
      noOfUes: '1',
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedSubscribers = getSubscriberData();
    if (savedSubscribers && savedSubscribers.length > 0) {
      setSubscribers(savedSubscribers);
    }
  }, []);

  const handleNoOfUesChange = (value: string, subscriberId: number) => {
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        return { ...subscriber, noOfUes: value };
      }
      return subscriber;
    });
    setSubscribers(updatedSubscribers);
  };

  const addSubscriber = () => {
    // Calculate total UEs
    const totalUes = subscribers.reduce(
      (sum, subscriber) => sum + parseInt(subscriber.noOfUes || '1', 10),
      0
    );

    // Check if adding a new subscriber would exceed the maximum
    if (totalUes + 1 > 10) {
      toast({
        title: "Maximum UEs limit reached",
        description: "You can only have a maximum of 10 UEs across all subscribers",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...subscribers.map(subscriber => subscriber.id)) + 1;
    setSubscribers([...subscribers, { id: newId, noOfUes: '1' }]);
  };

  const removeSubscriber = (subscriberId: number) => {
    if (subscribers.length > 1) {
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== subscriberId));
    } else {
      toast({
        title: "Cannot remove subscriber",
        description: "At least one subscriber is required",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      // Make API call
      await ApiService.saveSubscriberData(subscribers);
      // Save to localStorage
      saveSubscriberData(subscribers);
      onNext();
    } catch (error) {
      console.error('Error saving subscriber data:', error);
      toast({
        title: "Error",
        description: "Failed to save subscriber data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Define available options for # of UEs
  const noOfUesOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Subscriber Configuration</h2>
      </div>

      {subscribers.map((subscriber, index) => (
        <div key={subscriber.id} className="cell-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Subscriber #{subscriber.id}</h3>
            {subscribers.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSubscriber(subscriber.id)}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`noOfUes-${subscriber.id}`} 
                label="# of UEs" 
                required 
                tooltipText="Number of User Equipment devices" 
              />
              <CustomSelect
                id={`noOfUes-${subscriber.id}`}
                value={subscriber.noOfUes}
                onChange={(value) => handleNoOfUesChange(value, subscriber.id)}
                options={noOfUesOptions}
              />
            </FormGroup>
          </FormRow>
          
          {/* Add more subscriber configuration options here as needed */}
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={addSubscriber} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Subscriber
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

export default SubscriberForm;
