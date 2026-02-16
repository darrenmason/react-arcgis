import { useState } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer,
  // Navigation & View
  Zoom,
  Home,
  Compass,
  Locate,
  Track,
  Fullscreen,
  // Information
  LayerList,
  Legend,
  ScaleBar,
  // Search
  Search,
  // Basemap
  BasemapGallery,
  BasemapToggle,
  // Editing
  Sketch,
  // Data & Analysis
  TimeSlider,
  Measurement,
  // Advanced
  Swipe,
  // Utility
  Expand
} from '../../src';
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteLabel,
  CalciteSwitch,
  CalciteButton,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem
} from '@esri/calcite-components-react';

interface WidgetCategory {
  name: string;
  widgets: string[];
}

const WIDGET_CATEGORIES: WidgetCategory[] = [
  {
    name: 'Navigation',
    widgets: ['zoom', 'home', 'compass', 'locate', 'track', 'fullscreen']
  },
  {
    name: 'Information',
    widgets: ['layerList', 'legend', 'scaleBar']
  },
  {
    name: 'Search & Basemap',
    widgets: ['search', 'basemapGallery', 'basemapToggle']
  },
  {
    name: 'Editing',
    widgets: ['sketch']
  },
  {
    name: 'Analysis',
    widgets: ['measurement', 'swipe']
  }
];

export function WidgetLibraryExample() {
  const [graphicsLayer, setGraphicsLayer] = useState<any>(null);
  const [featureLayer1, setFeatureLayer1] = useState<any>(null);
  const [featureLayer2, setFeatureLayer2] = useState<any>(null);
  
  // Widget visibility state
  const [widgets, setWidgets] = useState({
    // Navigation
    zoom: true,
    home: true,
    compass: true,
    locate: false,
    track: false,
    fullscreen: true,
    // Information
    layerList: true,
    legend: true,
    scaleBar: true,
    // Search & Basemap
    search: true,
    basemapGallery: false,
    basemapToggle: true,
    // Editing
    sketch: false,
    // Analysis
    measurement: false,
    swipe: false
  });

  const [swipeMode, setSwipeMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [measurementTool, setMeasurementTool] = useState<'distance' | 'area' | null>('distance');

  const toggleWidget = (name: string) => {
    setWidgets(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const getWidgetCount = () => {
    return Object.values(widgets).filter(Boolean).length;
  };

  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start" width-scale="m">
        <CalcitePanel heading="Widget Library Demo">
          <CalciteBlock heading="Overview" open>
            <div style={{ padding: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                <strong>{getWidgetCount()}</strong> widgets active
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--calcite-color-text-3)' }}>
                Toggle widgets below to see them in action
              </p>
            </div>
          </CalciteBlock>

          {WIDGET_CATEGORIES.map(category => (
            <CalciteBlock
              key={category.name}
              heading={category.name}
              collapsible
            >
              {category.widgets.map(widgetName => (
                <CalciteLabel key={widgetName} layout="inline">
                  {widgetName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  <CalciteSwitch
                    checked={widgets[widgetName as keyof typeof widgets]}
                    onCalciteSwitchChange={() => toggleWidget(widgetName)}
                  />
                </CalciteLabel>
              ))}
            </CalciteBlock>
          ))}

          <CalciteBlock heading="Widget Options" collapsible>
            {widgets.swipe && (
              <div style={{ padding: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                  Swipe Direction
                </label>
                <CalciteSegmentedControl width="full">
                  <CalciteSegmentedControlItem
                    value="horizontal"
                    checked={swipeMode === 'horizontal'}
                    onClick={() => setSwipeMode('horizontal')}
                  >
                    Horizontal
                  </CalciteSegmentedControlItem>
                  <CalciteSegmentedControlItem
                    value="vertical"
                    checked={swipeMode === 'vertical'}
                    onClick={() => setSwipeMode('vertical')}
                  >
                    Vertical
                  </CalciteSegmentedControlItem>
                </CalciteSegmentedControl>
              </div>
            )}

            {widgets.measurement && (
              <div style={{ padding: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                  Measurement Tool
                </label>
                <CalciteSegmentedControl width="full">
                  <CalciteSegmentedControlItem
                    value="distance"
                    checked={measurementTool === 'distance'}
                    onClick={() => setMeasurementTool('distance')}
                  >
                    Distance
                  </CalciteSegmentedControlItem>
                  <CalciteSegmentedControlItem
                    value="area"
                    checked={measurementTool === 'area'}
                    onClick={() => setMeasurementTool('area')}
                  >
                    Area
                  </CalciteSegmentedControlItem>
                </CalciteSegmentedControl>
              </div>
            )}
          </CalciteBlock>

          <CalciteBlock heading="Actions" open>
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <CalciteButton
                width="full"
                onClick={() => setWidgets({
                  zoom: true,
                  home: true,
                  compass: true,
                  locate: true,
                  track: false,
                  fullscreen: true,
                  layerList: true,
                  legend: true,
                  scaleBar: true,
                  search: true,
                  basemapGallery: true,
                  basemapToggle: true,
                  sketch: true,
                  measurement: true,
                  swipe: false
                })}
              >
                Enable All Widgets
              </CalciteButton>
              
              <CalciteButton
                width="full"
                appearance="outline"
                onClick={() => setWidgets({
                  zoom: true,
                  home: true,
                  compass: false,
                  locate: false,
                  track: false,
                  fullscreen: false,
                  layerList: false,
                  legend: false,
                  scaleBar: true,
                  search: false,
                  basemapGallery: false,
                  basemapToggle: false,
                  sketch: false,
                  measurement: false,
                  swipe: false
                })}
              >
                Minimal Setup
              </CalciteButton>

              <CalciteButton
                width="full"
                kind="danger"
                appearance="outline"
                onClick={() => setWidgets({
                  zoom: false,
                  home: false,
                  compass: false,
                  locate: false,
                  track: false,
                  fullscreen: false,
                  layerList: false,
                  legend: false,
                  scaleBar: false,
                  search: false,
                  basemapGallery: false,
                  basemapToggle: false,
                  sketch: false,
                  measurement: false,
                  swipe: false
                })}
              >
                Disable All
              </CalciteButton>
            </div>
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>

      <Map basemap="topo-vector">
        <MapView center={[-98.5795, 39.8283]} zoom={4}>
          {/* Layers */}
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
            outFields={['*']}
            onLoad={setFeatureLayer1}
          />
          
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
            outFields={['*']}
            onLoad={setFeatureLayer2}
          />

          <GraphicsLayer onLoad={setGraphicsLayer} />

          {/* Navigation & View Control */}
          {widgets.zoom && <Zoom position="top-left" layout="vertical" />}
          {widgets.home && <Home position="top-left" />}
          {widgets.compass && <Compass position="top-left" />}
          {widgets.locate && <Locate position="top-left" useHeadingEnabled={true} />}
          {widgets.track && <Track position="top-left" useHeadingEnabled={true} />}
          {widgets.fullscreen && <Fullscreen position="top-right" />}

          {/* Information & Display */}
          {widgets.layerList && (
            <Expand
              position="top-right"
              expandIcon="layers"
              expandTooltip="Layer List"
            >
              <LayerList selectionEnabled={true} />
            </Expand>
          )}
          
          {widgets.legend && (
            <Expand
              position="top-right"
              expandIcon="legend"
              expandTooltip="Legend"
            >
              <Legend style="card" />
            </Expand>
          )}
          
          {widgets.scaleBar && <ScaleBar position="bottom-left" unit="dual" style="ruler" />}

          {/* Search & Location */}
          {widgets.search && (
            <Search
              position="top-right"
              includeDefaultSources={true}
              onSearchComplete={(event) => {
                console.log('Search results:', event.results);
              }}
            />
          )}

          {/* Basemap Control */}
          {widgets.basemapGallery && (
            <BasemapGallery position="top-right" expanded={false} />
          )}
          
          {widgets.basemapToggle && (
            <BasemapToggle position="bottom-left" nextBasemap="satellite" />
          )}

          {/* Editing & Drawing */}
          {widgets.sketch && graphicsLayer && (
            <Expand
              position="top-right"
              expandIcon="pencil"
              expandTooltip="Sketch Tools"
            >
              <Sketch
                layer={graphicsLayer}
                availableCreateTools={['point', 'polyline', 'polygon', 'rectangle', 'circle']}
                creationMode="update"
                onCreate={(event) => {
                  if (event.state === 'complete') {
                    console.log('Created graphic:', event.graphic);
                  }
                }}
              />
            </Expand>
          )}

          {/* Data & Analysis */}
          {widgets.measurement && (
            <Expand
              position="top-right"
              expandIcon="measure"
              expandTooltip="Measurement"
            >
              <Measurement
                activeTool={measurementTool}
                linearUnit="miles"
                areaUnit="square-miles"
              />
            </Expand>
          )}

          {/* Advanced Tools */}
          {widgets.swipe && featureLayer1 && featureLayer2 && (
            <Swipe
              leadingLayers={[featureLayer1]}
              trailingLayers={[featureLayer2]}
              direction={swipeMode}
              position={50}
              onPositionChange={(pos) => {
                console.log('Swipe position:', pos);
              }}
            />
          )}
        </MapView>
      </Map>
    </CalciteShell>
  );
}

export default WidgetLibraryExample;
