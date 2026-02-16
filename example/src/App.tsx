import React, { useState } from 'react';
import { Map, MapView, FeatureLayer, useSearch } from 'react-arcgis';
import '@arcgis/core/assets/esri/themes/light/main.css';

function App() {
  const [basemap, setBasemap] = useState('topo-vector');
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<[number, number]>([-98.5795, 39.8283]);

  return (
    <div className="app">
      <header className="header">
        <h1>React ArcGIS Example</h1>
        <p>A React-friendly wrapper for the ArcGIS SDK for JavaScript</p>
      </header>

      <div className="map-container">
        <Map basemap={basemap}>
          <MapView
            center={center}
            zoom={zoom}
            onClick={(event) => {
              console.log('Map clicked at:', event.mapPoint);
            }}
          >
            <FeatureLayer
              url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
              popupTemplate={{
                title: '{STATE_NAME}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'STATE_NAME',
                        label: 'State'
                      },
                      {
                        fieldName: 'POP2010',
                        label: 'Population (2010)',
                        format: {
                          digitSeparator: true
                        }
                      }
                    ]
                  }
                ]
              }}
            />
          </MapView>
        </Map>

        <div className="controls">
          <h3>Map Controls</h3>
          
          <label>
            Basemap:
            <select 
              value={basemap} 
              onChange={(e) => setBasemap(e.target.value)}
            >
              <option value="topo-vector">Topographic</option>
              <option value="streets-vector">Streets</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="dark-gray-vector">Dark Gray</option>
              <option value="gray-vector">Gray</option>
              <option value="streets-night-vector">Streets Night</option>
              <option value="oceans">Oceans</option>
            </select>
          </label>

          <label>
            Zoom: {zoom}
            <input
              type="range"
              min="1"
              max="20"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
