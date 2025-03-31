
import React from 'react';

// This is a simple component to test React experimental features
const ExperimentalTest: React.FC = () => {
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-medium mb-2">React Experimental Setup</h3>
      <p className="text-gray-700">
        This component is running on the experimental version of React.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Version: {React.version}
      </p>
    </div>
  );
};

export default ExperimentalTest;
