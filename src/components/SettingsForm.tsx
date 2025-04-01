
import React, { useState, useEffect } from 'react';
import { SettingsData, settingsValidator } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { getSettingsData, saveSettingsData, getAllFormData, clearAllFormData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';
import { logSettingOptions, successSettingsOptions } from '../config/formOptions';
import { FieldRenderer } from './FormFieldRenderer';

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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedData = getSettingsData();
    if (savedData) {
      setSettings(savedData);
    }
  }, []);

  useEffect(() => {
    // Validate form whenever data changes
    setIsValid(settingsValidator.validate([settings]));
  }, [settings]);

  const handleInputChange = (value: string, field: keyof SettingsData) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    if (!isValid) {
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

  // Field definitions for cleaner rendering
  const fields = {
    testCaseName: {
      label: 'Test Case Name',
      tooltipText: 'Name of the test case',
      required: true
    },
    logSetting: {
      label: 'Log Setting',
      tooltipText: 'Logging level for the test case',
      required: true
    },
    successSettings: {
      label: 'Success Settings',
      tooltipText: 'Criteria for test success',
      required: true
    }
  };

  return (
    <div className="wizard-content">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Test Settings</h2>
      </div>

      <div className="cell-container mb-8">
        <FieldRenderer
          id="testCaseName"
          type="input"
          field={fields.testCaseName}
          value={settings.testCaseName}
          onChange={(value) => handleInputChange(value, 'testCaseName')}
          placeholder="Enter test case name"
        />

        <FieldRenderer
          id="logSetting"
          type="select"
          field={fields.logSetting}
          value={settings.logSetting}
          onChange={(value) => handleInputChange(value, 'logSetting')}
          options={logSettingOptions}
        />

        <FieldRenderer
          id="successSettings"
          type="select"
          field={fields.successSettings}
          value={settings.successSettings}
          onChange={(value) => handleInputChange(value, 'successSettings')}
          options={successSettingsOptions}
        />
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
          disabled={loading || !isValid}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsForm;
