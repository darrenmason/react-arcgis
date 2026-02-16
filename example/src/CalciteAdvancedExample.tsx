import React, { useState, useEffect } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer,
  useView,
  useSketchViewModel,
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
  CalciteAlert,
  CalciteList,
  CalciteListItem,
  CalciteModal,
  CalciteInput,
  CalciteTab,
  CalciteTabs,
  CalciteTabNav,
  CalciteTabTitle,
  CalciteChip,
  CalciteLoader,
  CalciteIcon
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

// Panel for layer management
const LayersPanel: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { map } = useView();
  const [layers, setLayers] = useState<any[]>([]);

  useEffect(() => {
    if (map) {
      setLayers(map.layers.toArray());
      
      // Watch for layer changes
      const handle = map.layers.on('change', () => {
        setLayers(map.layers.toArray());
      });

      return () => handle.remove();
    }
  }, [map]);

  if (!visible) return null;

  return (
    <CalcitePanel heading="Layers" description={`${layers.length} layer(s)`}>
      <CalciteList>
        {layers.map((layer, index) => (
          <CalciteListItem
            key={index}
            label={layer.title || `Layer ${index + 1}`}
            description={layer.type}
          >
            <CalciteAction
              slot="actions-end"
              icon={layer.visible ? 'view-visible' : 'view-hide'}
              text="Toggle visibility"
              onClick={() => {
                layer.visible = !layer.visible;
                setLayers([...map!.layers.toArray()]);
              }}
            />
          </CalciteListItem>
        ))}
      </CalciteList>
    </CalcitePanel>
  );
};

// Panel for basemap selection
const BasemapPanel: React.FC<{ visible: boolean; onBasemapChange: (basemap: string) => void }> = ({
  visible,
  onBasemapChange
}) => {
  const [selectedBasemap, setSelectedBasemap] = useState('topo-vector');

  const basemaps = [
    { value: 'topo-vector', label: 'Topographic', icon: 'map' },
    { value: 'streets-vector', label: 'Streets', icon: 'highway' },
    { value: 'satellite', label: 'Satellite', icon: 'satellite-3' },
    { value: 'hybrid', label: 'Hybrid', icon: 'layer-mixed' },
    { value: 'dark-gray-vector', label: 'Dark Gray', icon: 'contrast' },
    { value: 'gray-vector', label: 'Gray', icon: 'circle-disallowed' },
    { value: 'streets-night-vector', label: 'Streets Night', icon: 'brightness' },
    { value: 'oceans', label: 'Oceans', icon: 'まwave' }
  ];

  if (!visible) return null;

  return (
    <CalcitePanel heading="Basemaps" description="Choose a basemap">
      <CalciteList selectionMode="single">
        {basemaps.map((basemap) => (
          <CalciteListItem
            key={basemap.value}
            label={basemap.label}
            selected={selectedBasemap === basemap.value}
            onClick={() => {
              setSelectedBasemap(basemap.value);
              onBasemapChange(basemap.value);
            }}
          >
            <CalciteIcon slot="content-start" icon={basemap.icon} scale="s" />
          </CalciteListItem>
        ))}
      </CalciteList>
    </CalcitePanel>
  );
};

// Drawing tools panel
const DrawingPanel: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { view } = useView();
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | null>(null);
  const [drawingActive, setDrawingActive] = useState(false);

  useEffect(() => {
    const initLayer = async () => {
      const GraphicsLayer = (await import('@arcgis/core/layers/GraphicsLayer')).default;
      const layer = new GraphicsLayer({ title: 'Drawings' });
      setGraphicsLayer(layer);
    };
    initLayer();
  }, []);

  const { create, cancel } = useSketchViewModel({
    view,
    layer: graphicsLayer,
    onCreateComplete: (event) => {
      setDrawingActive(false);
      console.log('Graphic created:', event.graphic);
    }
  });

  const startDrawing = (tool: 'point' | 'polyline' | 'polygon' | 'rectangle' | 'circle') => {
    setDrawingActive(true);
    create(tool);
  };

  const stopDrawing = () => {
    setDrawingActive(false);
    cancel();
  };

  if (!visible) return null;

  return (
    <CalcitePanel heading="Drawing Tools" description="Draw on the map">
      <div style={{ padding: '1rem' }}>
        {drawingActive && (
          <CalciteChip
            kind="brand"
            icon="pencil"
            style={{ marginBottom: '1rem', width: '100%' }}
          >
            Drawing Active
          </CalciteChip>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <CalciteButton
            iconStart="pin"
            onClick={() => startDrawing('point')}
            disabled={drawingActive}
          >
            Point
          </CalciteButton>
          
          <CalciteButton
            iconStart="line"
            onClick={() => startDrawing('polyline')}
            disabled={drawingActive}
          >
            Line
          </CalciteButton>
          
          <CalciteButton
            iconStart="polygon"
            onClick={() => startDrawing('polygon')}
            disabled={drawingActive}
          >
            Polygon
          </CalciteButton>
          
          <CalciteButton
            iconStart="rectangle"
            onClick={() => startDrawing('rectangle')}
            disabled={drawingActive}
          >
            Rectangle
          </CalciteButton>
        </div>

        {drawingActive && (
          <CalciteButton
            width="full"
            kind="danger"
            appearance="outline"
            style={{ marginTop: '1rem' }}
            onClick={stopDrawing}
          >
            Cancel Drawing
          </CalciteButton>
        )}

        {graphicsLayer && graphicsLayer.graphics.length > 0 && (
          <CalciteButton
            width="full"
            appearance="outline"
            style={{ marginTop: '0.5rem' }}
            onClick={() => graphicsLayer.removeAll()}
          >
            Clear All ({graphicsLayer.graphics.length})
          </CalciteButton>
        )}
      </div>

      {graphicsLayer && <GraphicsLayer graphics={graphicsLayer.graphics.toArray()} />}
    </CalcitePanel>
  );
};

// Main application component
const CalciteAdvancedExample: React.FC = () => {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<'layers' | 'basemaps' | 'draw'>('layers');
  const [basemap, setBasemap] = useState('topo-vector');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  return (
    <CalciteShell style={{ height: '100vh' }}>
      {/* Loading indicator */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          <CalciteLoader scale="l" text="Loading map..." />
        </div>
      )}

      {/* Alert */}
      <CalciteAlert
        open={alertOpen}
        kind="success"
        icon="check-circle"
        autoClose
        autoCloseDuration="medium"
        onCalciteAlertClose={() => setAlertOpen(false)}
      >
        <div slot="message">{alertMessage}</div>
      </CalciteAlert>

      {/* Modal */}
      <CalciteModal
        open={modalOpen}
        onCalciteModalClose={() => setModalOpen(false)}
      >
        <div slot="header">About This App</div>
        <div slot="content">
          <p>This is an advanced example demonstrating React ArcGIS with Calcite Design System integration.</p>
          <p>Features include:</p>
          <ul>
            <li>Layer management</li>
            <li>Basemap selection</li>
            <li>Drawing tools</li>
            <li>Professional UI with Calcite components</li>
          </ul>
        </div>
        <CalciteButton slot="primary" width="full" onClick={() => setModalOpen(false)}>
          Close
        </CalciteButton>
      </CalciteModal>

      {/* Left Panel */}
      <CalciteShellPanel
        slot="panel-start"
        position="start"
        collapsed={panelCollapsed}
        onCalciteShellPanelToggle={(e: any) => setPanelCollapsed(e.target.collapsed)}
        style={{ width: '320px' }}
      >
        <CalciteActionBar slot="action-bar">
          <CalciteAction
            text="Layers"
            icon="layers"
            active={activePanel === 'layers'}
            onClick={() => setActivePanel('layers')}
          />
          <CalciteAction
            text="Basemaps"
            icon="basemap"
            active={activePanel === 'basemaps'}
            onClick={() => setActivePanel('basemaps')}
          />
          <CalciteAction
            text="Draw"
            icon="pencil-mark"
            active={activePanel === 'draw'}
            onClick={() => setActivePanel('draw')}
          />
          <CalciteAction
            text="Information"
            icon="information"
            slot="actions-end"
            onClick={() => setModalOpen(true)}
          />
        </CalciteActionBar>

        <LayersPanel visible={activePanel === 'layers'} />
        <BasemapPanel
          visible={activePanel === 'basemaps'}
          onBasemapChange={(newBasemap) => {
            setBasemap(newBasemap);
            showAlert(`Basemap changed to ${newBasemap}`);
          }}
        />
        <DrawingPanel visible={activePanel === 'draw'} />
      </CalciteShellPanel>

      {/* Map Content */}
      <div style={{ height: '100%', width: '100%' }}>
        <Map basemap={basemap}>
          <MapView
            center={[-98.5795, 39.8283]}
            zoom={4}
            onViewReady={() => {
              setLoading(false);
              showAlert('Map loaded successfully!');
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
                        label: 'State Name'
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
                          places: 2
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
};

export default CalciteAdvancedExample;
