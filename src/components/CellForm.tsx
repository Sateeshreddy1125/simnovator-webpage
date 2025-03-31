
import React, { useState, useEffect } from 'react';
import { CellData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { getCellData, saveCellData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

interface CellFormProps {
  onNext: () => void;
}

const CellForm: React.FC<CellFormProps> = ({ onNext }) => {
  const [cells, setCells] = useState<CellData[]>([
    {
      id: 1,
      ratType: '',
    }
  ]);
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedCells = getCellData();
    if (savedCells && savedCells.length > 0) {
      setCells(savedCells);
    }
  }, []);

  const handleRatTypeChange = (value: string, cellId: number) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, ratType: value };
      }
      return cell;
    });
    setCells(updatedCells);
  };

  const handleDuplexModeChange = (value: string, cellId: number) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        const updatedCell = { ...cell, duplexMode: value };
        // Reset band when duplex mode changes
        if ('band' in updatedCell) {
          updatedCell.band = '';
        }
        return updatedCell;
      }
      return cell;
    });
    setCells(updatedCells);
  };

  const handleBandChange = (value: string, cellId: number) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, band: value };
      }
      return cell;
    });
    setCells(updatedCells);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, cellId: number, field: keyof CellData) => {
    const { value } = e.target;
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, [field]: value };
      }
      return cell;
    });
    setCells(updatedCells);
  };

  const handleSelectChange = (value: string, cellId: number, field: keyof CellData) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, [field]: value };
      }
      return cell;
    });
    setCells(updatedCells);
  };

  const addCell = () => {
    if (cells.length < 3) {
      const newId = Math.max(...cells.map(cell => cell.id)) + 1;
      setCells([...cells, { id: newId, ratType: '' }]);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can only add up to 3 cells",
        variant: "destructive"
      });
    }
  };

  const removeCell = (cellId: number) => {
    if (cells.length > 1) {
      setCells(cells.filter(cell => cell.id !== cellId));
    } else {
      toast({
        title: "Cannot remove cell",
        description: "At least one cell is required",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      // Make API call
      await ApiService.saveCellData(cells);
      // Save to localStorage
      saveCellData(cells);
      onNext();
    } catch (error) {
      console.error('Error saving cell data:', error);
      toast({
        title: "Error",
        description: "Failed to save cell data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Define available options based on selections
  const ratTypeOptions = [
    { value: '4G', label: '4G' },
    { value: '5G:SA', label: '5G:SA' },
    { value: '5G:NSA/DSS', label: '5G:NSA/DSS' },
  ];

  const duplexModeOptions = [
    { value: 'FDD', label: 'FDD' },
    { value: 'TDD', label: 'TDD' },
  ];

  const getBandOptions = (duplexMode: string) => {
    if (duplexMode === 'FDD') {
      return Array.from({ length: 21 }, (_, i) => ({
        value: `n${i + 1}`,
        label: `n${i + 1}`,
      }));
    } else if (duplexMode === 'TDD') {
      return Array.from({ length: 11 }, (_, i) => ({
        value: `n${i + 22}`,
        label: `n${i + 22}`,
      }));
    }
    return [];
  };

  const cellTypeOptions = [
    { value: '5G', label: '5G' },
    { value: 'LTE', label: 'LTE' },
  ];

  const bsIdOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));

  const scsOptions = [
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '60', label: '60' },
    { value: '120', label: '120' },
  ];

  const bandwidthOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
    { value: '60', label: '60' },
    { value: '80', label: '80' },
    { value: '90', label: '90' },
    { value: '100', label: '100' },
  ];

  const ntnOptions = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const antennaOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '8', label: '8' },
  ];

  const rfCardOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '4', label: '4' },
  ];

  return (
    <div className="wizard-content">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cell Configuration</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Advanced Settings</span>
          <Switch 
            checked={isAdvancedSettings} 
            onCheckedChange={setIsAdvancedSettings} 
          />
        </div>
      </div>

      {cells.map((cell, index) => (
        <div key={cell.id} className="cell-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cell #{cell.id}</h3>
            {cells.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeCell(cell.id)}
                className="h-8 w-8 rounded-full p-0"
              >
                <CircleX className="h-5 w-5" />
              </Button>
            )}
          </div>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`ratType-${cell.id}`} label="RAT Type" required tooltipText="Radio Access Technology Type" />
              <CustomSelect
                id={`ratType-${cell.id}`}
                value={cell.ratType}
                onChange={(value) => handleRatTypeChange(value, cell.id)}
                options={ratTypeOptions}
              />
            </FormGroup>
          </FormRow>

          {cell.ratType === '5G:SA' && (
            <>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor={`duplexMode-${cell.id}`} label="Duplex Mode" required tooltipText="Frequency Division Duplex or Time Division Duplex" />
                  <CustomSelect
                    id={`duplexMode-${cell.id}`}
                    value={cell.duplexMode || ''}
                    onChange={(value) => handleDuplexModeChange(value, cell.id)}
                    options={duplexModeOptions}
                  />
                </FormGroup>
              </FormRow>

              {cell.duplexMode && (
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor={`band-${cell.id}`} label="Band" required tooltipText="Frequency band" />
                    <CustomSelect
                      id={`band-${cell.id}`}
                      value={cell.band || ''}
                      onChange={(value) => handleBandChange(value, cell.id)}
                      options={getBandOptions(cell.duplexMode)}
                    />
                  </FormGroup>
                </FormRow>
              )}
            </>
          )}

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`cellType-${cell.id}`} label="Cell Type" required />
              <CustomSelect
                id={`cellType-${cell.id}`}
                value={cell.cellType || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'cellType')}
                options={cellTypeOptions}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor={`bsId-${cell.id}`} label="BS ID" required />
              <CustomSelect
                id={`bsId-${cell.id}`}
                value={cell.bsId || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'bsId')}
                options={bsIdOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`scs-${cell.id}`} label="SCS (KHz)" required tooltipText="Subcarrier Spacing" />
              <CustomSelect
                id={`scs-${cell.id}`}
                value={cell.scs || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'scs')}
                options={scsOptions}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor={`bandwidth-${cell.id}`} label="Bandwidth (MHz)" required />
              <CustomSelect
                id={`bandwidth-${cell.id}`}
                value={cell.bandwidth || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'bandwidth')}
                options={bandwidthOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`ntn-${cell.id}`} label="NTN" tooltipText="Non-Terrestrial Network" />
              <CustomSelect
                id={`ntn-${cell.id}`}
                value={cell.ntn || 'Disable'}
                onChange={(value) => handleSelectChange(value, cell.id, 'ntn')}
                options={ntnOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`dlAntennas-${cell.id}`} label="DL Antennas" required />
              <CustomSelect
                id={`dlAntennas-${cell.id}`}
                value={cell.dlAntennas || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'dlAntennas')}
                options={antennaOptions}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor={`ulAntennas-${cell.id}`} label="UL Antennas" required />
              <CustomSelect
                id={`ulAntennas-${cell.id}`}
                value={cell.ulAntennas || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'ulAntennas')}
                options={antennaOptions}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor={`rfCard-${cell.id}`} label="RF Card" required />
              <CustomSelect
                id={`rfCard-${cell.id}`}
                value={cell.rfCard || ''}
                onChange={(value) => handleSelectChange(value, cell.id, 'rfCard')}
                options={rfCardOptions}
              />
            </FormGroup>
          </FormRow>

          {isAdvancedSettings && (
            <>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor={`txGain-${cell.id}`} label="Tx Gain (dB)" />
                  <CustomInput
                    id={`txGain-${cell.id}`}
                    value={cell.txGain || ''}
                    onChange={(e) => handleInputChange(e, cell.id, 'txGain')}
                    type="number"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor={`rxGain-${cell.id}`} label="Rx Gain (dB)" />
                  <CustomInput
                    id={`rxGain-${cell.id}`}
                    value={cell.rxGain || ''}
                    onChange={(e) => handleInputChange(e, cell.id, 'rxGain')}
                    type="number"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`dlNrArfcn-${cell.id}`} 
                    label="DL-NR-ARFCN" 
                    tooltipText="Downlink New Radio Absolute Radio Frequency Channel Number" 
                  />
                  <CustomInput
                    id={`dlNrArfcn-${cell.id}`}
                    value={cell.dlNrArfcn || ''}
                    onChange={(e) => handleInputChange(e, cell.id, 'dlNrArfcn')}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel 
                    htmlFor={`ssbNrArfcn-${cell.id}`} 
                    label="SSB NR-ARFCN" 
                    tooltipText="Synchronization Signal Block New Radio Absolute Radio Frequency Channel Number" 
                  />
                  <CustomInput
                    id={`ssbNrArfcn-${cell.id}`}
                    value={cell.ssbNrArfcn || ''}
                    onChange={(e) => handleInputChange(e, cell.id, 'ssbNrArfcn')}
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
          onClick={addCell} 
          className="flex items-center gap-1"
          disabled={cells.length >= 3}
        >
          <Plus className="h-4 w-4" /> Add Cell
        </Button>
      </div>

      <div className="flex justify-end">
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

export default CellForm;
