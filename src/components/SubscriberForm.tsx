
import React, { useState, useEffect } from 'react';
import { SubscriberData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow, CustomCheckbox } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSubscriberData, saveSubscriberData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

interface SubscriberFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({ onPrevious, onNext }) => {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([
    {
      id: 1,
      noOfUes: '1',
      servingCell: '',
      externalSim: 'Disabled',
      startingSupi: '',
      mncDigits: '',
      nextSupi: '',
      algorithm: '',
      sharedKey: '',
      integrityAlgorithm: [],
      cipherAlgorithm: [],
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedSubscribers = getSubscriberData();
    if (savedSubscribers && savedSubscribers.length > 0) {
      setSubscribers(savedSubscribers);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, subscriberId: number, field: keyof SubscriberData) => {
    const { value } = e.target;
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        return { ...subscriber, [field]: value };
      }
      return subscriber;
    });
    setSubscribers(updatedSubscribers);
  };

  const handleSelectChange = (value: string, subscriberId: number, field: keyof SubscriberData) => {
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        return { ...subscriber, [field]: value };
      }
      return subscriber;
    });
    setSubscribers(updatedSubscribers);
  };

  const handleCheckboxChange = (checked: boolean, subscriberId: number, field: keyof SubscriberData) => {
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        return { ...subscriber, [field]: checked };
      }
      return subscriber;
    });
    setSubscribers(updatedSubscribers);
  };

  const handleIntegrityAlgorithmChange = (checked: boolean, subscriberId: number, algorithm: string) => {
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        let newAlgorithms = [...(subscriber.integrityAlgorithm || [])];
        if (checked) {
          newAlgorithms.push(algorithm);
        } else {
          newAlgorithms = newAlgorithms.filter(a => a !== algorithm);
        }
        return { ...subscriber, integrityAlgorithm: newAlgorithms };
      }
      return subscriber;
    });
    setSubscribers(updatedSubscribers);
  };

  const handleCipherAlgorithmChange = (checked: boolean, subscriberId: number, algorithm: string) => {
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === subscriberId) {
        let newAlgorithms = [...(subscriber.cipherAlgorithm || [])];
        if (checked) {
          newAlgorithms.push(algorithm);
        } else {
          newAlgorithms = newAlgorithms.filter(a => a !== algorithm);
        }
        return { ...subscriber, cipherAlgorithm: newAlgorithms };
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
    setSubscribers([...subscribers, { 
      id: newId, 
      noOfUes: '1',
      servingCell: '',
      externalSim: 'Disabled',
      startingSupi: '',
      mncDigits: '',
      nextSupi: '',
      algorithm: '',
      sharedKey: '',
      integrityAlgorithm: [],
      cipherAlgorithm: [],
    }]);
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
      
      // Validate required fields
      let isValid = true;
      subscribers.forEach(subscriber => {
        if (!subscriber.noOfUes || !subscriber.servingCell || !subscriber.startingSupi) {
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

  // Define available options for dropdowns
  const noOfUesOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));

  const cellOptions = Array.from({ length: 3 }, (_, i) => ({
    value: `Cell#${i + 1}`,
    label: `Cell#${i + 1}`,
  }));

  const externalSimOptions = [
    { value: 'Disabled', label: 'Disabled' },
    { value: 'Enabled', label: 'Enabled' },
  ];

  const algorithmOptions = [
    { value: 'Milenage', label: 'Milenage' },
    { value: 'XOR', label: 'XOR' },
    { value: 'TUAK', label: 'TUAK' },
  ];

  const asReleaseOptions = [
    { value: '16', label: '16' },
    { value: '15', label: '15' },
    { value: '14', label: '14' },
  ];

  const ueTypeOptions = [
    { value: 'Combined', label: 'Combined' },
    { value: 'Separated', label: 'Separated' },
  ];

  const ueCategoryOptions = [
    { value: 'NR', label: 'NR' },
    { value: 'LTE', label: 'LTE' },
  ];

  const uacClassOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Priority', label: 'Priority' },
  ];

  const autoOptions = [
    { value: 'Auto', label: 'Auto' },
    { value: 'Manual', label: 'Manual' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscriber Configuration</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Advanced Settings</span>
          <Switch 
            checked={isAdvancedSettings} 
            onCheckedChange={setIsAdvancedSettings} 
          />
        </div>
      </div>

      {subscribers.map((subscriber) => (
        <div key={subscriber.id} className="cell-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Range #{subscriber.id}</h3>
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
              <CustomInput
                id={`noOfUes-${subscriber.id}`}
                value={subscriber.noOfUes || ''}
                onChange={(e) => handleInputChange(e, subscriber.id, 'noOfUes')}
                type="number"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel 
                htmlFor={`externalSim-${subscriber.id}`} 
                label="External SIM" 
                tooltipText="External SIM card configuration"
              />
              <CustomSelect
                id={`externalSim-${subscriber.id}`}
                value={subscriber.externalSim || 'Disabled'}
                onChange={(value) => handleSelectChange(value, subscriber.id, 'externalSim')}
                options={externalSimOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`servingCell-${subscriber.id}`} 
                label="Serving Cell" 
                required 
                tooltipText="Cell that serves this subscriber"
              />
              <CustomSelect
                id={`servingCell-${subscriber.id}`}
                value={subscriber.servingCell || ''}
                onChange={(value) => handleSelectChange(value, subscriber.id, 'servingCell')}
                options={cellOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`startingSupi-${subscriber.id}`} 
                label="Starting SUPI" 
                required
                tooltipText="Subscription Permanent Identifier starting value" 
              />
              <CustomInput
                id={`startingSupi-${subscriber.id}`}
                value={subscriber.startingSupi || ''}
                onChange={(e) => handleInputChange(e, subscriber.id, 'startingSupi')}
                placeholder="e.g., 001010123456789"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`mncDigits-${subscriber.id}`} 
                label="MNC Digits" 
                tooltipText="Mobile Network Code Digits"
              />
              <CustomInput
                id={`mncDigits-${subscriber.id}`}
                value={subscriber.mncDigits || ''}
                onChange={(e) => handleInputChange(e, subscriber.id, 'mncDigits')}
                type="number"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <div className="flex items-center space-x-4">
              <FormGroup className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id={`nextSupiFixed-${subscriber.id}`} 
                  name={`nextSupi-${subscriber.id}`} 
                  checked={subscriber.nextSupi === 'Fixed'} 
                  onChange={() => handleSelectChange('Fixed', subscriber.id, 'nextSupi')}
                />
                <label htmlFor={`nextSupiFixed-${subscriber.id}`}>Fixed</label>
              </FormGroup>
              <FormGroup className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id={`nextSupiIncrement-${subscriber.id}`} 
                  name={`nextSupi-${subscriber.id}`} 
                  checked={subscriber.nextSupi !== 'Fixed'} 
                  onChange={() => handleSelectChange('Increment', subscriber.id, 'nextSupi')}
                />
                <input 
                  type="number" 
                  className="w-16 px-2 py-1 border rounded" 
                  value={subscriber.nextSupi !== 'Fixed' ? subscriber.nextSupi || '1' : '1'} 
                  onChange={(e) => handleSelectChange(e.target.value, subscriber.id, 'nextSupi')}
                  disabled={subscriber.nextSupi === 'Fixed'} 
                />
              </FormGroup>
            </div>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`algorithm-${subscriber.id}`} 
                label="Algorithm" 
                required
                tooltipText="Authentication algorithm" 
              />
              <CustomSelect
                id={`algorithm-${subscriber.id}`}
                value={subscriber.algorithm || ''}
                onChange={(value) => handleSelectChange(value, subscriber.id, 'algorithm')}
                options={algorithmOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel 
                htmlFor={`sharedKey-${subscriber.id}`} 
                label="Shared Key (k)" 
                required
                tooltipText="Key used for authentication" 
              />
              <CustomInput
                id={`sharedKey-${subscriber.id}`}
                value={subscriber.sharedKey || ''}
                onChange={(e) => handleInputChange(e, subscriber.id, 'sharedKey')}
                placeholder="e.g., 00112233445566778899AABBCCDDEEFF"
              />
            </FormGroup>
          </FormRow>

          {isAdvancedSettings && (
            <>
              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`asRelease-${subscriber.id}`} 
                    label="AS Release" 
                    tooltipText="Access Stratum Release version"
                  />
                  <CustomSelect
                    id={`asRelease-${subscriber.id}`}
                    value={subscriber.asRelease || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'asRelease')}
                    options={asReleaseOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`ueType-${subscriber.id}`} 
                    label="UE Type" 
                    tooltipText="Type of User Equipment"
                    required
                  />
                  <CustomSelect
                    id={`ueType-${subscriber.id}`}
                    value={subscriber.ueType || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'ueType')}
                    options={ueTypeOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`ueCategory-${subscriber.id}`} 
                    label="UE Category" 
                    tooltipText="Category of User Equipment"
                    required
                  />
                  <CustomSelect
                    id={`ueCategory-${subscriber.id}`}
                    value={subscriber.ueCategory || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'ueCategory')}
                    options={ueCategoryOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <div className="my-2">
                    <CustomCheckbox
                      id={`voiceCapability-${subscriber.id}`}
                      checked={!!subscriber.voiceCapability}
                      onChange={(checked) => handleCheckboxChange(checked, subscriber.id, 'voiceCapability')}
                      label="VoNR Support"
                    />
                  </div>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`uacClass-${subscriber.id}`} 
                    label="UAC Class" 
                    tooltipText="Unified Access Control Class"
                  />
                  <CustomSelect
                    id={`uacClass-${subscriber.id}`}
                    value={subscriber.uacClass || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'uacClass')}
                    options={uacClassOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`blerOverride-${subscriber.id}`} 
                    label="BLER Override" 
                    tooltipText="Block Error Rate Override"
                  />
                  <CustomInput
                    id={`blerOverride-${subscriber.id}`}
                    value={subscriber.blerOverride || ''}
                    onChange={(e) => handleInputChange(e, subscriber.id, 'blerOverride')}
                    type="number"
                  />
                </FormGroup>
              </FormRow>

              <div className="my-4">
                <h4 className="text-md font-semibold mb-2">Integrity Algorithm:</h4>
                <div className="flex flex-wrap gap-4">
                  <CustomCheckbox
                    id={`nia0-${subscriber.id}`}
                    checked={(subscriber.integrityAlgorithm || []).includes('NIA0')}
                    onChange={(checked) => handleIntegrityAlgorithmChange(checked, subscriber.id, 'NIA0')}
                    label="NIA0"
                  />
                  <CustomCheckbox
                    id={`nia1-${subscriber.id}`}
                    checked={(subscriber.integrityAlgorithm || []).includes('NIA1')}
                    onChange={(checked) => handleIntegrityAlgorithmChange(checked, subscriber.id, 'NIA1')}
                    label="NIA1"
                  />
                  <CustomCheckbox
                    id={`nia2-${subscriber.id}`}
                    checked={(subscriber.integrityAlgorithm || []).includes('NIA2')}
                    onChange={(checked) => handleIntegrityAlgorithmChange(checked, subscriber.id, 'NIA2')}
                    label="NIA2"
                  />
                </div>
              </div>

              <div className="my-4">
                <h4 className="text-md font-semibold mb-2">Cipher Algorithm:</h4>
                <div className="flex flex-wrap gap-4">
                  <CustomCheckbox
                    id={`nea0-${subscriber.id}`}
                    checked={(subscriber.cipherAlgorithm || []).includes('NEA0')}
                    onChange={(checked) => handleCipherAlgorithmChange(checked, subscriber.id, 'NEA0')}
                    label="NEA0"
                  />
                  <CustomCheckbox
                    id={`nea1-${subscriber.id}`}
                    checked={(subscriber.cipherAlgorithm || []).includes('NEA1')}
                    onChange={(checked) => handleCipherAlgorithmChange(checked, subscriber.id, 'NEA1')}
                    label="NEA1"
                  />
                  <CustomCheckbox
                    id={`nea2-${subscriber.id}`}
                    checked={(subscriber.cipherAlgorithm || []).includes('NEA2')}
                    onChange={(checked) => handleCipherAlgorithmChange(checked, subscriber.id, 'NEA2')}
                    label="NEA2"
                  />
                </div>
              </div>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`cqi-${subscriber.id}`} 
                    label="CQI" 
                    tooltipText="Channel Quality Indicator"
                  />
                  <CustomSelect
                    id={`cqi-${subscriber.id}`}
                    value={subscriber.cqi || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'cqi')}
                    options={autoOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`ri-${subscriber.id}`} 
                    label="RI" 
                    tooltipText="Rank Indicator"
                  />
                  <CustomSelect
                    id={`ri-${subscriber.id}`}
                    value={subscriber.ri || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'ri')}
                    options={autoOptions}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`pmi-${subscriber.id}`} 
                    label="PMI" 
                    tooltipText="Precoding Matrix Indicator"
                  />
                  <CustomSelect
                    id={`pmi-${subscriber.id}`}
                    value={subscriber.pmi || ''}
                    onChange={(value) => handleSelectChange(value, subscriber.id, 'pmi')}
                    options={autoOptions}
                  />
                </FormGroup>
              </FormRow>
            </>
          )}
        </div>
      ))}

      <div className="flex items-center mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={addSubscriber} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Range
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
