
import React, { useState, useEffect } from 'react';
import { SettingsData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { getSettingsData, saveSettingsData, getAllFormData, clearAllFormData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface SettingsFormProps {
  onPrevious: () => void;
  onReset: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onPrevious, onReset }) => {
  const [settings, setSettings] = useState<SettingsData>({
    testCaseName: '',
    logSetting: '',
    successSettings: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getSettingsData();
    if (savedData) {
      setSettings(savedData);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SettingsData) => {
    const { value } = e.target;
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (value: string, field: keyof SettingsData) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    // Validate required fields
    if (!settings.testCaseName || !settings.logSetting || !settings.successSettings) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Save settings data first
      await ApiService.saveSettingsData(settings);
      saveSettingsData(settings);
      
      // Get all form data and submit
      const allFormData = getAllFormData();
      await ApiService.submitAllData({
        ...allFormData,
        settings
      });
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your test configuration has been created successfully.",
      });
      
      // Clear form data and reset
      clearAllFormData();
      onReset();
      
    } catch (error) {
      console.error('Error creating test case:', error);
      toast({
        title: "Error",
        description: "Failed to create test case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logSettingOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Verbose', label: 'Verbose' },
    { value: 'Debug', label: 'Debug' },
  ];

  const successSettingsOptions = [
    { value: 'Default', label: 'Default' },
    { value: 'Custom', label: 'Custom' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Test Settings</h2>
      </div>

      <div className="cell-container mb-8">
        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="testCaseName" 
              label="Test Case Name" 
              required 
              tooltipText="Name of the test case" 
            />
            <CustomInput
              id="testCaseName"
              value={settings.testCaseName}
              onChange={(e) => handleInputChange(e, 'testCaseName')}
              placeholder="Enter test case name"
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="logSetting" 
              label="Log Setting" 
              required 
              tooltipText="Logging level for the test case" 
            />
            <CustomSelect
              id="logSetting"
              value={settings.logSetting}
              onChange={(value) => handleSelectChange(value, 'logSetting')}
              options={logSettingOptions}
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <FormLabel 
              htmlFor="successSettings" 
              label="Success Settings" 
              required 
              tooltipText="Criteria for test success" 
            />
            <CustomSelect
              id="successSettings"
              value={settings.successSettings}
              onChange={(value) => handleSelectChange(value, 'successSettings')}
              options={successSettingsOptions}
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
          onClick={handleCreate} 
          className="next-button" 
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsForm;
