import React, { useState } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  useView,
  // Calcite Components
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteActionBar,
  CalciteAction,
  CalciteBlock,
  CalciteButton,
  CalciteSwitch,
  CalciteLabel,
  CalciteSlider,
  CalciteSelect,
  CalciteOption,
  CalciteAlert
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

// Component to display map controls using Calcite
function MapControls() {
  const { view, map } = useView();
  const [layerVisible, setLayerVisible] = useState(true);
  const [layerOpacity, setLayerOpacity] = useState(0.8);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleZoomIn = () => {
    if (view) {
      view.zoom = view.zoom + 1;
    }
  };

  const handleZoomOut = () => {
    if (view) {
      view.zoom = view.zoom - 1;
    }
  };

  const handleHome = () => {
    if (view) {
      view.goTo({
        center: [-98.5795, 39.8283],
        zoom: 4
      });
    }
  };

  return (
    <>
      <CalciteBlock heading="Map Controls" collapsible>
        <div style={{ padding: '1rem' }}>
          <CalciteLabel>
            Layer Visibility
            <CalciteSwitch
              checked={layerVisible}
              onCalciteSwitchChange={(e: any) => setLayerVisible(e.target.checked)}
            />
          </CalciteLabel>

          <CalciteLabel style={{ marginTop: '1rem' }}>
            Layer Opacity: {Math.round(layerOpacity * 100)}%
            <CalciteSlider
              min={0}
              max={1}
              step={0.1}
              value={layerOpacity}
              onCalciteSliderChange={(e: any) => setLayerOpacity(e.target.value)}
            />
          </CalciteLabel>

          <CalciteLabel style={{ marginTop: '1rem' }}>
            Current Zoom: {view ? Math.round(view.zoom) : 0}
          </CalciteLabel>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <CalciteButton width="full" onClick={handleZoomIn}>
              Zoom In
            </CalciteButton>
            <CalciteButton width="full" onClick={handleZoomOut}>
              Zoom Out
            </CalciteButton>
          </div>

          <CalciteButton
            width="full"
            appearance="outline"
            style={{ marginTop: '0.5rem' }}
            onClick={handleHome}
          >
            Home
          </CalciteButton>

          <CalciteButton
            width="full"
            kind="brand"
            style={{ marginTop: '1rem' }}
            onClick={() => setAlertOpen(true)}
          >
            Show Alert
          </CalciteButton>
        </div>
      </CalciteBlock>

      <CalciteAlert
        open={alertOpen}
        kind="success"
        icon="check-circle"
        label="Success"
        autoClose
        autoCloseDuration="fast"
        onCalciteAlertClose={() => setAlertOpen(false)}
      >
        <div slot="title">Action Successful</div>
        <div slot="message">Your map action was completed successfully!</div>
      </CalciteAlert>
    </>
  );
}

function CalciteExample() {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [basemap, setBasemap] = useState('topo-vector');

  return (
    <CalciteShell style={{ height: '100vh' }}>
      {/* Left Panel */}
      <CalciteShellPanel
        slot="panel-start"
        position="start"
        collapsed={panelCollapsed}
        onCalciteShellPanelToggle={(e: any) => setPanelCollapsed(e.target.collapsed)}
      >
        <CalciteActionBar slot="action-bar">
          <CalciteAction text="Layers" icon="layers" />
          <CalciteAction text="Basemap" icon="basemap" />
          <CalciteAction text="Bookmarks" icon="bookmark" />
          <CalciteAction text="Legend" icon="legend" />
          <CalciteAction text="Print" icon="print" />
          <CalciteAction text="Information" icon="information" slot="actions-end" />
        </CalciteActionBar>

        <CalcitePanel heading="Map Settings" description="Configure your map view">
          <CalciteBlock heading="Basemap" collapsible>
            <div style={{ padding: '1rem' }}>
              <CalciteLabel>
                Select Basemap
                <CalciteSelect
                  value={basemap}
                  onCalciteSelectChange={(e: any) => setBasemap(e.target.value)}
                >
                  <CalciteOption value="topo-vector">Topographic</CalciteOption>
                  <CalciteOption value="streets-vector">Streets</CalciteOption>
                  <CalciteOption value="satellite">Satellite</CalciteOption>
                  <CalciteOption value="hybrid">Hybrid</CalciteOption>
                  <CalciteOption value="dark-gray-vector">Dark Gray</CalciteOption>
                  <CalciteOption value="gray-vector">Gray</CalciteOption>
                  <CalciteOption value="streets-night-vector">Streets Night</CalciteOption>
                  <CalciteOption value="oceans">Oceans</CalciteOption>
                </CalciteSelect>
              </CalciteLabel>
            </div>
          </CalciteBlock>

          <MapControls />
        </CalcitePanel>
      </CalciteShellPanel>

      {/* Map Content */}
      <div style={{ height: '100%', width: '100%' }}>
        <Map basemap={basemap}>
          <MapView center={[-98.5795, 39.8283]} zoom={4}>
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
                        label: 'State Name'
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
          </MapView>
        </Map>
      </div>
    </CalciteShell>
  );
}

export default CalciteExample;
