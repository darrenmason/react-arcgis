import React, { useState } from 'react';
import { Map, MapView, FeatureLayer, useTheme } from 'react-arcgis';
import { WidgetLibraryExample } from './WidgetLibraryExample';
import { LayerLibraryExample } from './LayerLibraryExample';
import { WebMapWebSceneExample } from './WebMapWebSceneExample';

type ExampleTab = 'basic' | 'widgets' | 'layers' | 'webmap';

function App() {
  const [activeTab, setActiveTab] = useState<ExampleTab>('basic');
  const [basemap, setBasemap] = useState('topo-vector');
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<[number, number]>([-98.5795, 39.8283]);
  
  // Initialize theme (defaults to light mode)
  useTheme('light');

  const renderExample = () => {
    switch (activeTab) {
      case 'widgets':
        return <WidgetLibraryExample />;
      case 'layers':
        return <LayerLibraryExample />;
      case 'webmap':
        return <WebMapWebSceneExample />;
      case 'basic':
      default:
        return (
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
        );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>React ArcGIS Examples</h1>
        <p>A React-friendly wrapper for the ArcGIS SDK for JavaScript</p>
        
        <nav className="tabs">
          <button
            className={activeTab === 'basic' ? 'active' : ''}
            onClick={() => setActiveTab('basic')}
          >
            Basic Map
          </button>
          <button
            className={activeTab === 'widgets' ? 'active' : ''}
            onClick={() => setActiveTab('widgets')}
          >
            Widget Library (18 Widgets)
          </button>
          <button
            className={activeTab === 'layers' ? 'active' : ''}
            onClick={() => setActiveTab('layers')}
          >
            Layer Library (23 Layers)
          </button>
          <button
            className={activeTab === 'webmap' ? 'active' : ''}
            onClick={() => setActiveTab('webmap')}
          >
            WebMap/WebScene
          </button>
        </nav>
      </header>

      {renderExample()}
    </div>
  );
}

export default App;
