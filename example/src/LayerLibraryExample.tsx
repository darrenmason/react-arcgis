import { useState } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  TileLayer,
  VectorTileLayer,
  GraphicsLayer,
  CSVLayer,
  GroupLayer,
  StreamLayer,
  useLayerList,
  useLegend,
  useView,
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteSwitch,
  CalciteLabel,
  CalciteButton
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

/**
 * Comprehensive example demonstrating all major layer types
 */
function LayerLibraryExample() {
  const [basemapType, setBasemapType] = useState<'vector' | 'raster'>('vector');
  const [showFeatures, setShowFeatures] = useState(true);
  const [showCSV, setShowCSV] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [showGraphics, setShowGraphics] = useState(false);

  // Sample graphics data
  const sampleGraphics = [
    {
      geometry: {
        type: 'point',
        x: -118.805,
        y: 34.027,
        spatialReference: { wkid: 4326 }
      },
      symbol: {
        type: 'simple-marker',
        color: [255, 0, 0],
        size: 12,
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      },
      attributes: {
        name: 'Los Angeles',
        population: 4000000
      }
    },
    {
      geometry: {
        type: 'point',
        x: -122.419,
        y: 37.775,
        spatialReference: { wkid: 4326 }
      },
      symbol: {
        type: 'simple-marker',
        color: [0, 0, 255],
        size: 12,
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      },
      attributes: {
        name: 'San Francisco',
        population: 900000
      }
    }
  ];

  return (
    <CalciteShell style={{ height: '100vh' }}>
      {/* Control Panel */}
      <CalciteShellPanel
        slot="panel-start"
        position="start"
        style={{ width: '320px' }}
      >
        <CalcitePanel heading="Layer Library Demo" description="23 layer types available">
          
          {/* Basemap Selection */}
          <CalciteBlock heading="Basemap Type" collapsible>
            <div style={{ padding: '1rem' }}>
              <CalciteSegmentedControl
                width="full"
                onCalciteSegmentedControlChange={(e: any) => {
                  setBasemapType(e.target.selectedItem.value);
                }}
              >
                <CalciteSegmentedControlItem
                  value="vector"
                  checked={basemapType === 'vector'}
                >
                  Vector Tiles
                </CalciteSegmentedControlItem>
                <CalciteSegmentedControlItem
                  value="raster"
                  checked={basemapType === 'raster'}
                >
                  Raster Tiles
                </CalciteSegmentedControlItem>
              </CalciteSegmentedControl>
            </div>
          </CalciteBlock>

          {/* Layer Toggles */}
          <CalciteBlock heading="Data Layers" collapsible>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <CalciteLabel>
                Feature Layer (USA States)
                <CalciteSwitch
                  checked={showFeatures}
                  onCalciteSwitchChange={(e: any) => setShowFeatures(e.target.checked)}
                />
              </CalciteLabel>

              <CalciteLabel>
                Graphics Layer (Sample Points)
                <CalciteSwitch
                  checked={showGraphics}
                  onCalciteSwitchChange={(e: any) => setShowGraphics(e.target.checked)}
                />
              </CalciteLabel>

              <CalciteLabel>
                CSV Layer (Earthquakes)
                <CalciteSwitch
                  checked={showCSV}
                  onCalciteSwitchChange={(e: any) => setShowCSV(e.target.checked)}
                />
              </CalciteLabel>

              <CalciteLabel>
                Stream Layer (Live Data)
                <CalciteSwitch
                  checked={showStream}
                  onCalciteSwitchChange={(e: any) => setShowStream(e.target.checked)}
                />
              </CalciteLabel>
            </div>
          </CalciteBlock>

          {/* Layer Info */}
          <CalciteBlock heading="Available Layers" collapsible>
            <div style={{ padding: '1rem', fontSize: '0.875rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Vector & Features (5)</h4>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem' }}>
                <li>FeatureLayer</li>
                <li>GraphicsLayer</li>
                <li>GeoJSONLayer</li>
                <li>CSVLayer</li>
                <li>StreamLayer</li>
              </ul>

              <h4 style={{ margin: '0 0 0.5rem 0' }}>Tile Services (4)</h4>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem' }}>
                <li>TileLayer</li>
                <li>VectorTileLayer</li>
                <li>WebTileLayer</li>
                <li>ImageryTileLayer</li>
              </ul>

              <h4 style={{ margin: '0 0 0.5rem 0' }}>3D Layers (5)</h4>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem' }}>
                <li>SceneLayer</li>
                <li>BuildingSceneLayer</li>
                <li>IntegratedMeshLayer</li>
                <li>PointCloudLayer</li>
                <li>ElevationLayer</li>
              </ul>

              <h4 style={{ margin: '0 0 0.5rem 0' }}>OGC Standards (5)</h4>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem' }}>
                <li>WMSLayer</li>
                <li>WMTSLayer</li>
                <li>WFSLayer</li>
                <li>OGCFeatureLayer</li>
                <li>KMLLayer</li>
              </ul>

              <p style={{ margin: '1rem 0 0 0', fontWeight: 'bold' }}>
                Total: 23 Layer Components
              </p>
            </div>
          </CalciteBlock>

          {/* Documentation */}
          <CalciteBlock heading="Documentation" collapsible>
            <div style={{ padding: '1rem' }}>
              <CalciteButton
                width="full"
                appearance="outline"
                onClick={() => window.open('/LAYER_LIBRARY.md')}
              >
                Full Documentation
              </CalciteButton>
              <CalciteButton
                width="full"
                appearance="outline"
                style={{ marginTop: '0.5rem' }}
                onClick={() => window.open('/LAYER_GUIDE_QUICK.md')}
              >
                Quick Reference
              </CalciteButton>
            </div>
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>

      {/* Map */}
      <div style={{ height: '100%', width: '100%' }}>
        <Map basemap="gray-vector">
          <MapView center={[-98.5795, 39.8283]} zoom={4}>
            {/* Basemap Layer */}
            <GroupLayer title="Basemap" visibilityMode="exclusive">
              {basemapType === 'vector' && (
                <VectorTileLayer
                  portalItem={{ id: '7dc6cea0b1764a1f9af2e679f642f0f5' }}
                />
              )}
              {basemapType === 'raster' && (
                <TileLayer
                  url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                />
              )}
            </GroupLayer>

            {/* Data Layers */}
            <GroupLayer title="Data Layers" visibilityMode="independent">
              {showFeatures && (
                <FeatureLayer
                  url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
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
                            label: 'State'
                          },
                          {
                            fieldName: 'POP2010',
                            label: 'Population (2010)',
                            format: {
                              digitSeparator: true,
                              places: 0
                            }
                          }
                        ]
                      }
                    ]
                  }}
                />
              )}

              {showGraphics && (
                <GraphicsLayer graphics={sampleGraphics as any} />
              )}

              {showCSV && (
                <CSVLayer
                  url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv"
                  latitudeField="latitude"
                  longitudeField="longitude"
                  renderer={{
                    type: 'simple',
                    symbol: {
                      type: 'simple-marker',
                      color: [255, 100, 0, 0.8],
                      size: 6,
                      outline: {
                        color: [255, 255, 255],
                        width: 1
                      }
                    }
                  }}
                  popupTemplate={{
                    title: 'Magnitude {mag} Earthquake',
                    content: 'Location: {place}<br/>Time: {time}'
                  }}
                />
              )}

              {showStream && (
                <StreamLayer
                  url="https://geoeventsample.esri.com:6443/arcgis/rest/services/SeattleBus/StreamServer"
                  purgeOptions={{
                    displayCount: 10000,
                    age: 5
                  }}
                  updateInterval={500}
                  renderer={{
                    type: 'simple',
                    symbol: {
                      type: 'simple-marker',
                      color: [0, 255, 0],
                      size: 8
                    }
                  }}
                />
              )}
            </GroupLayer>

            <MapWidgets />
          </MapView>
        </Map>
      </div>
    </CalciteShell>
  );
}

function MapWidgets() {
  const { view } = useView();
  
  useLayerList({
    view,
    position: 'top-right'
  });
  
  useLegend({
    view,
    position: 'bottom-right',
    style: 'card'
  });
  
  return null;
}

export default LayerLibraryExample;
