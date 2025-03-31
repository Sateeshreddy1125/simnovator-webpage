
import React, { useState, useEffect } from 'react';
import { CellData } from '../types/form';
import { FormLabel, CustomSelect, CustomInput, FormGroup, FormRow } from './FormFields';
import { Button } from '@/components/ui/button';
import { Plus, CircleX, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getCellData, saveCellData } from '../utils/localStorage';
import { ApiService } from '../services/api';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CellFormProps {
  onNext: () => void;
}

const CellForm: React.FC<CellFormProps> = ({ onNext }) => {
  const [cells, setCells] = useState<CellData[]>([
    {
      id: 1,
      ratType: '',
      mobility: 'No',
    }
  ]);
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Load data from localStorage when component mounts
    const savedCells = getCellData();
    if (savedCells && savedCells.length > 0) {
      setCells(savedCells);
    }
  }, []);

  useEffect(() => {
    // Validate form whenever cells change
    validateForm();
  }, [cells]);

  const validateForm = () => {
    let valid = true;
    
    // Check if all required fields are filled for each cell
    cells.forEach(cell => {
      if (!cell.ratType || 
          !cell.cellType || 
          !cell.bsId || 
          !cell.scs || 
          !cell.bandwidth || 
          !cell.dlAntennas || 
          !cell.ulAntennas || 
          !cell.rfCard) {
        valid = false;
      }
      
      // Check conditional fields based on RAT type
      if (cell.ratType === '5G:SA' && (!cell.duplexMode || !cell.band)) {
        valid = false;
      }
    });
    
    setIsFormValid(valid);
  };

  const handleRatTypeChange = (value: string, cellId: number) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        // Set default cell type based on RAT type
        let cellType = '';
        if (value === '4G') {
          cellType = 'LTE';
        } else if (value === '5G:SA' || value === '5G:NSA/DSS') {
          cellType = '5G';
        }
        
        return { ...cell, ratType: value, cellType };
      }
      return cell;
    });
    
    // For 5G:NSA/DSS, ensure we have complementary cell types
    if (value === '5G:NSA/DSS') {
      // Check if we already have both 5G and LTE cells
      const has5G = updatedCells.some(c => c.cellType === '5G' && c.id !== cellId);
      const hasLTE = updatedCells.some(c => c.cellType === 'LTE' && c.id !== cellId);
      
      // If not, update another cell or add a new one
      if (!has5G && !hasLTE) {
        // The current cell is 5G, so add an LTE cell
        if (updatedCells.length === 1) {
          // Add new LTE cell
          updatedCells.push({
            id: 2,
            ratType: '5G:NSA/DSS',
            cellType: 'LTE',
            mobility: 'No',
          });
        } else {
          // Update an existing cell to LTE
          updatedCells[1] = {
            ...updatedCells[1],
            ratType: '5G:NSA/DSS',
            cellType: 'LTE'
          };
        }
      }
    }
    
    setCells(updatedCells);
  };

  const handleMobilityChange = (value: string, cellId: number) => {
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, mobility: value };
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
      const ratType = cells[0].ratType; // Use the same RAT type as the first cell
      
      // Set default cell type based on RAT type and existing cells
      let cellType = '';
      if (ratType === '4G') {
        cellType = 'LTE';
      } else if (ratType === '5G:SA') {
        cellType = '5G';
      } else if (ratType === '5G:NSA/DSS') {
        // For NSA, check if we already have both 5G and LTE
        const has5G = cells.some(c => c.cellType === '5G');
        const hasLTE = cells.some(c => c.cellType === 'LTE');
        
        // Add the one we don't have yet, or 5G if we have both
        cellType = !hasLTE ? 'LTE' : !has5G ? '5G' : '5G';
      }
      
      setCells([...cells, { 
        id: newId, 
        ratType, 
        cellType,
        mobility: 'No',
      }]);
    } else {
      toast({
        title: "For four cells you have to upgrade the license",
        description: "Contact your administrator to upgrade your license.",
        variant: "destructive"
      });
    }
  };

  const removeCell = (cellId: number) => {
    if (cells.length > 1) {
      // Check if we're removing a required cell for NSA mode
      const updatedCells = cells.filter(cell => cell.id !== cellId);
      
      if (cells[0].ratType === '5G:NSA/DSS') {
        // Check if we still have both 5G and LTE after removal
        const has5G = updatedCells.some(c => c.cellType === '5G');
        const hasLTE = updatedCells.some(c => c.cellType === 'LTE');
        
        if (!has5G || !hasLTE) {
          toast({
            title: "Cannot remove this cell",
            description: "NSA mode requires at least one 5G and one LTE cell",
            variant: "destructive"
          });
          return;
        }
      }
      
      setCells(updatedCells);
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
      
      if (!isFormValid) {
        toast({
          title: "Validation failed",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Check if mobility is enabled but not configured
      const mobilityEnabled = cells.some(cell => cell.mobility === 'Yes');
      if (mobilityEnabled) {
        // Check if mobility is configured (this would be more complex in a real app)
        const isMobilityConfigured = true; // This would be a check against actual mobility configuration
        
        if (!isMobilityConfigured) {
          toast({
            title: "Mobility not configured",
            description: "You have enabled mobility but haven't configured it.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }
      
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

  const mobilityOptions = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' },
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

  const cellTypeOptions = (ratType: string) => {
    if (ratType === '4G') {
      return [{ value: 'LTE', label: 'LTE' }];
    } else if (ratType === '5G:SA') {
      return [{ value: '5G', label: '5G' }];
    } else if (ratType === '5G:NSA/DSS') {
      return [
        { value: '5G', label: '5G' },
        { value: 'LTE', label: 'LTE' },
      ];
    }
    return [
      { value: '5G', label: '5G' },
      { value: 'LTE', label: 'LTE' },
    ];
  };

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

  // Only allow setting RAT Type on the first cell, others inherit it
  const canChangeRatType = (cellId: number) => cellId === 1;

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

      {/* Common RAT Type selector for all cells */}
      <FormRow>
        <FormGroup>
          <FormLabel htmlFor="ratType-header" label="RAT Type" required tooltipText="Radio Access Technology Type" />
          <CustomSelect
            id="ratType-header"
            value={cells[0].ratType}
            onChange={(value) => handleRatTypeChange(value, 1)}
            options={ratTypeOptions}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="mobility-header" label="Mobility" required tooltipText="Enable mobility for this configuration" />
          <CustomSelect
            id="mobility-header"
            value={cells[0].mobility || 'No'}
            onChange={(value) => handleMobilityChange(value, 1)}
            options={mobilityOptions}
          />
        </FormGroup>
      </FormRow>

      {cells[0].mobility === 'Yes' && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mobility Configuration Required</AlertTitle>
          <AlertDescription>
            You have enabled mobility. Make sure to configure mobility settings in the Mobility tab.
          </AlertDescription>
        </Alert>
      )}

      {cells.map((cell, index) => (
        <div key={cell.id} className="cell-container mb-8 border p-4 rounded-lg">
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
                options={cellTypeOptions(cell.ratType)}
                className={cells[0].ratType === '4G' || cells[0].ratType === '5G:SA' ? 'bg-gray-100' : ''}
                // Disable for 4G and 5G:SA since they have fixed cell types
                // For NSA, only disable if we already have both types and removing would break the requirement
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
              <FormLabel htmlFor={`ntn-${cell.id}`} label="NTN" required tooltipText="Non-Terrestrial Network" />
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
                  <FormLabel htmlFor={`txGain-${cell.id}`} label="Tx Gain (dB)" required />
                  <CustomInput
                    id={`txGain-${cell.id}`}
                    value={cell.txGain || ''}
                    onChange={(e) => handleInputChange(e, cell.id, 'txGain')}
                    type="number"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor={`rxGain-${cell.id}`} label="Rx Gain (dB)" required />
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
                    required
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
                    required
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
          disabled={loading || !isFormValid}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default CellForm;
