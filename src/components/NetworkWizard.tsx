
import React, { useState } from 'react';
import { STEPS } from '../types/form';
import CellForm from './CellForm';
import SubscriberForm from './SubscriberForm';
import UserPlaneForm from './UserPlaneForm';
import TrafficForm from './TrafficForm';
import MobilityForm from './MobilityForm';
import SettingsForm from './SettingsForm';
import { cn } from '@/lib/utils';
import { getCellData, getSubscriberData, getUserPlaneData, getTrafficData, getMobilityData } from '../utils/localStorage';
import { toast } from '@/components/ui/use-toast';

const NetworkWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps(prev => [...prev, activeStep]);
    }
    
    // Move to next step
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps([]);
  };

  // Function to handle direct step navigation
  const handleStepClick = (index: number) => {
    // Check if trying to access a future step that's not yet completed
    if (index > activeStep && !completedSteps.includes(index - 1)) {
      toast({
        title: "Cannot skip steps",
        description: "Please complete the current step before proceeding to this step.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if we're going back to a completed step
    if (index < activeStep && completedSteps.includes(index)) {
      setActiveStep(index);
      return;
    }
    
    // If we're going back but the step isn't completed, check if we have data for it
    if (index < activeStep) {
      let canNavigate = false;
      
      switch (index) {
        case 0: // Cell
          canNavigate = !!getCellData()?.length;
          break;
        case 1: // Subscriber
          canNavigate = !!getSubscriberData()?.length;
          break;
        case 2: // User Plane
          canNavigate = !!getUserPlaneData()?.length;
          break;
        case 3: // Traffic
          canNavigate = !!getTrafficData()?.length;
          break;
        case 4: // Mobility
          canNavigate = !!getMobilityData()?.length;
          break;
      }
      
      if (canNavigate) {
        setActiveStep(index);
      } else {
        toast({
          title: "Cannot navigate",
          description: "This step hasn't been configured yet.",
          variant: "destructive"
        });
      }
    }
  };

  // Check if the current step requires mobility configuration
  const isMobilityRequired = () => {
    const cellData = getCellData();
    if (cellData && cellData.length > 0) {
      return cellData.some(cell => cell.mobility === 'Yes');
    }
    return false;
  };

  return (
    <div className="wizard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Case List / Create Test Case</h1>
      </div>
      
      <div className="wizard-steps">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={cn(
              "wizard-step mx-2 cursor-pointer",
              activeStep === index ? "active" : "",
              completedSteps.includes(index) ? "completed" : ""
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
