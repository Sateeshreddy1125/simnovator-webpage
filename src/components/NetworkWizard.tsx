
import React, { useState, useEffect } from 'react';
import { STEPS } from '../types/form';
import CellForm from './CellForm';
import SubscriberForm from './SubscriberForm';
import UserPlaneForm from './UserPlaneForm';
import TrafficForm from './TrafficForm';
import MobilityForm from './MobilityForm';
import SettingsForm from './SettingsForm';
import { cn } from '@/lib/utils';
import { 
  getCellData, 
  getSubscriberData, 
  getUserPlaneData, 
  getTrafficData, 
  getMobilityData 
} from '../utils/localStorage';
import { toast } from '@/components/ui/use-toast';

const NetworkWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isMobilityRequired, setIsMobilityRequired] = useState(false);

  useEffect(() => {
    // Check if mobility is required based on Cell data
    const cellData = getCellData();
    if (cellData && cellData.length > 0) {
      const mobilityRequired = cellData.some(cell => cell.mobility === 'Yes');
      setIsMobilityRequired(mobilityRequired);
    }
  }, [activeStep]);

  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Cell
        return !!getCellData()?.length;
      case 1: // Subscriber
        return !!getSubscriberData()?.length;
      case 2: // User Plane
        return !!getUserPlaneData()?.length;
      case 3: // Traffic
        return !!getTrafficData()?.length;
      case 4: // Mobility
        // If mobility is not required, we can skip this step
        return !isMobilityRequired || !!getMobilityData()?.length;
      default:
        return false;
    }
  };

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps(prev => [...prev, activeStep]);
    }
    
    // Skip mobility step if not required
    if (activeStep === 3 && !isMobilityRequired) {
      setActiveStep(5); // Skip to Settings
    } else {
      // Move to next step
      setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    // Skip mobility step if not required when going backwards
    if (activeStep === 5 && !isMobilityRequired) {
      setActiveStep(3); // Go back to Traffic
    } else {
      setActiveStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps([]);
  };

  const handleStepClick = (index: number) => {
    // If trying to go to mobility but it's not required, prevent navigation
    if (index === 4 && !isMobilityRequired) {
      toast({
        title: "Mobility not required",
        description: "Mobility configuration is not required based on your cell configuration.",
        variant: "destructive"
      });
      return;
    }

    // Check if trying to access a future step that's not yet valid
    if (index > activeStep) {
      // Validate that all previous steps are complete
      for (let i = 0; i < index; i++) {
        if (!isStepComplete(i)) {
          toast({
            title: "Cannot skip steps",
            description: `Please complete the ${STEPS[i]} step before proceeding.`,
            variant: "destructive"
          });
          return;
        }
      }
      
      setActiveStep(index);
      return;
    }
    
    // Going backwards is always allowed if the step has data
    if (isStepComplete(index)) {
      setActiveStep(index);
    } else {
      toast({
        title: "Cannot navigate",
        description: "This step hasn't been configured yet.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="wizard-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Case List / Create Test Case</h1>
      </div>
      
      <div className="wizard-steps">
        {STEPS.map((step, index) => {
          // Skip rendering the Mobility step if it's not required
          if (index === 4 && !isMobilityRequired) {
            return null;
          }

          return (
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
          );
        })}
      </div>

      {activeStep === 0 && (
        <CellForm 
          onNext={handleNext} 
          onMobilityChange={setIsMobilityRequired}
        />
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

      {activeStep === 4 && isMobilityRequired && (
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
