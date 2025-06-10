import React, { useState, useEffect, createContext, useContext } from 'react';

// Global context to manage checkbox states across all instances
const CheckboxContext = createContext();

// Provider component to wrap your MDX content
export const CheckboxProvider = ({ children }) => {
  const [checkboxStates, setCheckboxStates] = useState({});
  const [manualChecks, setManualChecks] = useState({});

  const updateCheckbox = (id, isManuallyChecked) => {
    setManualChecks(prev => ({
      ...prev,
      [id]: isManuallyChecked
    }));
  };

  const isCheckboxChecked = (id, references = []) => {
    // Manual check has priority
    if (manualChecks[id]) {
      return { checked: true, type: 'manual' };
    }
    
    // Check if all references are checked (either manually or through their references)
    if (references.length > 0) {
      const allReferencesChecked = references.every(refId => {
        if (manualChecks[refId]) return true;
        // Recursively check if reference has its own references
        return checkboxStates[refId]?.checked;
      });
      
      if (allReferencesChecked) {
        return { checked: true, type: 'reference' };
      }
    }
    
    return { checked: false, type: 'none' };
  };

  useEffect(() => {
    // Update all checkbox states when manual checks change
    const newStates = {};
    Object.keys(checkboxStates).forEach(id => {
      const checkbox = checkboxStates[id];
      newStates[id] = {
        ...checkbox,
        ...isCheckboxChecked(id, checkbox.references)
      };
    });
    setCheckboxStates(newStates);
  }, [manualChecks]);

  const registerCheckbox = (id, references = []) => {
    setCheckboxStates(prev => ({
      ...prev,
      [id]: {
        references,
        ...isCheckboxChecked(id, references)
      }
    }));
  };

  return (
    <CheckboxContext.Provider value={{
      checkboxStates,
      manualChecks,
      updateCheckbox,
      registerCheckbox,
      isCheckboxChecked
    }}>
      {children}
    </CheckboxContext.Provider>
  );
};

// The main checkbox component
export const InteractiveCheckbox = ({ 
  id, 
  references = [], 
  label = '', 
  className = '' 
}) => {
  const { 
    checkboxStates, 
    manualChecks, 
    updateCheckbox, 
    registerCheckbox, 
    isCheckboxChecked 
  } = useContext(CheckboxContext);

  useEffect(() => {
    registerCheckbox(id, references);
  }, [id, references]);

  const handleClick = () => {
    updateCheckbox(id, !manualChecks[id]);
  };

  const checkboxState = isCheckboxChecked(id, references);
  const isChecked = checkboxState.checked;
  const checkType = checkboxState.type;

  // Determine the color based on check type
  const getCheckmarkColor = () => {
    if (checkType === 'manual') return '#22c55e'; // green
    if (checkType === 'reference') return '#3b82f6'; // blue
    return '#d1d5db'; // gray (unchecked)
  };

  const getBackgroundColor = () => {
    if (isChecked) return getCheckmarkColor();
    return 'transparent';
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        onClick={handleClick}
        style={{
          width: '20px',
          height: '20px',
          border: `2px solid ${isChecked ? getCheckmarkColor() : '#d1d5db'}`,
          borderRadius: '3px',
          backgroundColor: getBackgroundColor(),
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {isChecked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6l2.5 2.5L10 3" />
          </svg>
        )}
      </div>
      {label && (
        <label
          onClick={handleClick}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Export both components as default for easier importing
export default InteractiveCheckbox;