
import React, { useState } from 'react';
import { STEPS } from '../types/form';
import CellForm from './CellForm';
import SubscriberForm from './SubscriberForm';
import UserPlaneForm from './UserPlaneForm';
import TrafficForm from './TrafficForm';
import MobilityForm from './MobilityForm';
import SettingsForm from './SettingsForm';
import { cn } from '@/lib/utils';

const NetworkWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Function to handle direct step navigation
  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-steps">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={cn(
              "wizard-step mx-2",
              activeStep === index ? "active" : "",
              index < activeStep ? "completed" : ""
            )}
            onClick={() => handleStepClick(index)}
          >
            {step}
          </div>
        ))}
      </div>

      {activeStep === 0 && (
        <CellForm onNext={handleNext} />
      )}

      {activeStep === 1 && (
        <SubscriberForm
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {activeStep === 2 && (
        <UserPlaneForm
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {activeStep === 3 && (
        <TrafficForm
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {activeStep === 4 && (
        <MobilityForm
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {activeStep === 5 && (
        <SettingsForm
          onPrevious={handlePrevious}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default NetworkWizard;
