
import React from 'react';
import NetworkWizard from '@/components/NetworkWizard';
import ExperimentalTest from '@/components/ExperimentalTest';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <ExperimentalTest />
      </div>
      <NetworkWizard />
    </div>
  );
};

export default Index;
