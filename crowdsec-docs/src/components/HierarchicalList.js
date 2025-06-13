import React, { useState } from 'react';

const HierarchicalList = ({ data = [] }) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (itemId) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">      
      {/* Main list */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleItemClick(item.id)}
            >
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
            {index < data.length - 1 && (
              <div className="text-gray-400 mx-1">—</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Sub-elements */}
      {activeItem && (
        <div className="ml-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center flex-wrap gap-1">
            {data
              .find(item => item.id === activeItem)
              ?.children?.map((child, index, array) => (
                <React.Fragment key={child.id}>
                  <div className="flex items-center">
                    <div 
                      className={`w-1.5 h-1.5 rounded-full ${child.color} mr-1`}
                      style={{ transform: 'scale(0.5)' }}
                    ></div>
                    <span 
                      className="text-gray-600 text-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {child.label}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <div className="text-gray-300 mx-0.5 text-xs">—</div>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <p className="text-blue-700 text-sm">
          Click on any main list item to toggle its sub-elements. The sub-elements will appear below 
          the main list, scaled down by 50% and displayed inline with connecting dashes.
        </p>
      </div>
    </div>
  );
};

export default HierarchicalList;