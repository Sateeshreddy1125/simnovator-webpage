
import React from 'react';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';

interface FieldRendererProps {
  id: string;
  type: 'select' | 'input' | 'checkbox';
  field: {
    label: string;
    tooltipText: string;
    required: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  inputType?: string;
  placeholder?: string;
  className?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  id,
  type,
  field,
  value,
  onChange,
  options = [],
  inputType = 'text',
  placeholder = '',
  className = ''
}) => {
  return (
    <FormRow>
      <FormGroup>
        <FormLabel 
          htmlFor={id} 
          label={field.label} 
          required={field.required}
          tooltipText={field.tooltipText} 
        />
        {type === 'select' ? (
          <CustomSelect
            id={id}
            value={value || ''}
            onChange={onChange}
            options={options}
            className={className}
          />
        ) : (
          <CustomInput
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            type={inputType}
            placeholder={placeholder}
            className={className}
          />
        )}
      </FormGroup>
    </FormRow>
  );
};

interface PairedInputProps {
  id: string;
  field: {
    label: string;
    tooltipText: string;
    required: boolean;
  };
  valueX: string;
  valueY: string;
  onChangeX: (value: string) => void;
  onChangeY: (value: string) => void;
  placeholderX?: string;
  placeholderY?: string;
}

export const PairedInputField: React.FC<PairedInputProps> = ({
  id,
  field,
  valueX,
  valueY,
  onChangeX,
  onChangeY,
  placeholderX = 'X',
  placeholderY = 'Y'
}) => {
  return (
    <FormRow>
      <FormGroup>
        <FormLabel 
          htmlFor={id} 
          label={field.label} 
          required={field.required}
          tooltipText={field.tooltipText} 
        />
        <div className="flex space-x-2">
          <CustomInput
            id={`${id}-x`}
            value={valueX || ''}
            onChange={(e) => onChangeX(e.target.value)}
            type="number"
            placeholder={placeholderX}
            className="w-1/2"
          />
          <CustomInput
            id={`${id}-y`}
            value={valueY || ''}
            onChange={(e) => onChangeY(e.target.value)}
            type="number"
            placeholder={placeholderY}
            className="w-1/2"
          />
        </div>
      </FormGroup>
    </FormRow>
  );
};

interface BitrateFieldProps {
  id: string;
  field: {
    label: string;
    tooltipText: string;
    required: boolean;
  };
  value: string;
  unitValue: string;
  onChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  unitOptions: { value: string; label: string }[];
  placeholder?: string;
}

export const BitrateField: React.FC<BitrateFieldProps> = ({
  id,
  field,
  value,
  unitValue,
  onChange,
  onUnitChange,
  unitOptions,
  placeholder = ''
}) => {
  return (
    <FormRow>
      <FormGroup>
        <FormLabel 
          htmlFor={id} 
          label={field.label} 
          required={field.required}
          tooltipText={field.tooltipText} 
        />
        <div className="flex">
          <CustomInput
            id={id}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            type="number"
            placeholder={placeholder}
            className="flex-1 mr-2"
          />
          <CustomSelect
            id={`${id}-unit`}
            value={unitValue || ''}
            onChange={onUnitChange}
            options={unitOptions}
            className="w-24"
          />
        </div>
      </FormGroup>
    </FormRow>
  );
};
