
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InfoCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormLabelProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  tooltipText?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, label, required, tooltipText }) => {
  return (
    <div className="form-label">
      <Label htmlFor={htmlFor}>{label}</Label>
      {required && <span className="required-asterisk">*</span>}
      {tooltipText && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="info-icon w-4 h-4 ml-1 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
  id, 
  value, 
  onChange, 
  options, 
  placeholder = "Select..." 
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface CustomInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "", 
  type = "text" 
}) => {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full"
    />
  );
};

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  id, 
  checked, 
  onChange, 
  label 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onChange} 
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className = "" }) => {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
};

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({ children, className = "" }) => {
  return (
    <div className={`form-row ${className}`}>
      {children}
    </div>
  );
};
