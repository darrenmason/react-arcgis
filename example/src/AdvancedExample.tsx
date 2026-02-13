import React, { useState, useEffect } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer,
  useView,
  useSearch,
  useBasemapGallery
} from 'react-arcgis';

// Example of using hooks within a view context
const MapWidgets: React.FC = () => {
  const { view } = useView();

  // Add search widget
  useSearch({
    view,
    position: 'top-left'
  });

  // Add basemap gallery
  useBasemapGallery({
    view,
    position: 'bottom-right'
  });

  return null;
};

const AdvancedExample: React.FC = () => {
  const [zoom, setZoom] = useState(4);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filterPopulation, setFilterPopulation] = useState<number>(0);

  // Build definition expression based on filter
  const definitionExpression = filterPopulation > 0
    ? `POP2010 > ${filterPopulation}`
    : '1=1';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{
        background: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Advanced Example</h2>
        
        <label>
          Population Filter:
          <select
            value={filterPopulation}
            onChange={(e) => setFilterPopulation(Number(e.target.value))}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            <option value={0}>All States</option>
            <option value={1000000}>{'> 1 Million'}</option>
            <option value={5000000}>{'> 5 Million'}</option>
            <option value={10000000}>{'> 10 Million'}</option>
          </select>
        </label>

        {selectedState && (
          <div style={{ marginLeft: 'auto' }}>
            Selected: <strong>{selectedState}</strong>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <Map basemap="gray-vector">
          <MapView
            center={[-98.5795, 39.8283]}
            zoom={zoom}
            onClick={(event) => {
              console.log('Clicked at:', event.mapPoint);
            }}
            onViewReady={(view) => {
              console.log('View is ready!', view);
              
              // Update zoom when view changes
              view.watch('zoom', (newZoom) => {
                setZoom(Math.round(newZoom));
              });
            }}
          >
            {/* Add search and basemap gallery widgets */}
            <MapWidgets />

            {/* States Layer */}
            <FeatureLayer
              url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
              definitionExpression={definitionExpression}
              renderer={{
                type: 'simple',
                symbol: {
                  type: 'simple-fill',
                  color: [51, 51, 204, 0.3],
                  outline: {
                    color: [255, 255, 255, 0.8],
                    width: 2
                  }
                }
              }}
              popupTemplate={{
                title: '{STATE_NAME}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'STATE_NAME',
                        label: 'State Name'
                      },
                      {
                        fieldName: 'STATE_ABBR',
                        label: 'Abbreviation'
                      },
                      {
                        fieldName: 'POP2010',
                        label: 'Population (2010)',
                        format: {
                          digitSeparator: true,
                          places: 0
                        }
                      },
                      {
                        fieldName: 'SQMI',
                        label: 'Area (sq mi)',
                        format: {
                          digitSeparator: true,
                          places: 0
                        }
                      }
                    ]
                  }
                ]
              }}
              onLoad={(layer) => {
                console.log('Feature layer loaded:', layer);
              }}
            />
          </MapView>
        </Map>
      </div>

      {/* Status Bar */}
      <div style={{
        background: '#34495e',
        color: 'white',
        padding: '0.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Zoom Level: {zoom}</span>
        <span>Filter: {filterPopulation === 0 ? 'None' : `> ${filterPopulation.toLocaleString()} population`}</span>
      </div>
    </div>
  );
};

export default AdvancedExample;
