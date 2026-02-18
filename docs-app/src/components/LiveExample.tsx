import React, { Suspense, useState, useEffect } from 'react';
import { ComponentDoc } from '../utils/componentDocs';
import {
  Map,
  MapView,
  SceneView,
  FeatureLayer,
  TileLayer,
  GraphicsLayer,
  Zoom,
  Home,
  Search,
  LayerList,
  Legend,
  WebMap,
  WebScene,
  useView,
  useGraphic,
  useQueryFeatures
} from 'react-arcgis';
import './LiveExample.css';

interface LiveExampleProps {
  doc: ComponentDoc;
}

export default function LiveExample({ doc }: LiveExampleProps) {
  // Dynamically import and render the example component
  const ExampleComponent = getExampleComponent(doc.name);

  return (
    <section className="live-example-section">
      <h2>Live Example</h2>
      <p className="section-description">
        See the component in action. Interact with the example below.
      </p>
      <div className="example-wrapper">
        <div className="example-container">
          <Suspense fallback={<div className="loading">Loading example...</div>}>
            {ExampleComponent ? (
              <ExampleComponent />
            ) : (
              <div className="no-example">
                <p>Live example coming soon!</p>
                <p className="hint">Check the code example below for usage.</p>
              </div>
            )}
          </Suspense>
        </div>
        <AttributionFooter />
      </div>
    </section>
  );
}

function AttributionFooter() {
  const [attribution, setAttribution] = useState<string>('');

  useEffect(() => {
    // Find attribution element in the example container
    const checkAttribution = () => {
      const container = document.querySelector('.example-container');
      if (!container) return;

      const attributionEl = container.querySelector('.esri-attribution');
      if (attributionEl) {
        const text = attributionEl.textContent || '';
        if (text && text !== attribution) {
          setAttribution(text.trim());
        }
      }
    };

    // Check immediately and on interval (attribution loads asynchronously)
    checkAttribution();
    const interval = setInterval(checkAttribution, 500);

    return () => clearInterval(interval);
  }, [attribution]);

  if (!attribution) return null;

  return (
    <div className="attribution-footer">
      {attribution}
    </div>
  );
}

function getExampleComponent(name: string): React.ComponentType | null {
  // Map component names to their example implementations
  const examples: Record<string, React.ComponentType> = {
    Map: MapExample,
    MapView: MapViewExample,
    FeatureLayer: FeatureLayerExample,
    Zoom: ZoomExample,
    Home: HomeExample,
    Search: SearchExample,
    LayerList: LayerListExample,
    Legend: LegendExample,
    TileLayer: TileLayerExample,
    GraphicsLayer: GraphicsLayerExample,
    GeoJSONLayer: GeoJSONLayerExample,
    SceneView: SceneViewExample,
    WebMap: WebMapExample,
    WebScene: WebSceneExample,
    useView: UseViewExample,
    useGraphic: UseGraphicExample,
    useQueryFeatures: UseQueryFeaturesExample
  };

  return examples[name] || null;
}

// Example implementations
function MapExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} style={{ height: '100%', width: '100%' }} />
      </Map>
    </div>
  );
}

function MapViewExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="streets-vector">
        <MapView 
          center={[-118.805, 34.027]} 
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          onClick={(event: any) => {
            console.log('Clicked:', event.mapPoint);
          }}
        />
      </Map>
    </div>
  );
}

function FeatureLayerExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="streets-vector">
        <MapView center={[-98, 39]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
            popupTemplate={{
              title: '{NAME}',
              content: 'Population: {POP2020}'
            }}
          />
        </MapView>
      </Map>
    </div>
  );
}

function ZoomExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'visible', position: 'relative' }}>
      <Map basemap="gray-vector">
        <MapView 
          center={[-118, 34]} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          onViewReady={(view) => {
            // Disable default zoom widget - we're using our custom Zoom component
            view.ui.components = ['attribution'];
          }}
        >
          <Zoom position="top-left" />
        </MapView>
      </Map>
    </div>
  );
}

function HomeExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'visible', position: 'relative' }}>
      <Map basemap="gray-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <Home position="top-left" />
        </MapView>
      </Map>
    </div>
  );
}

function SearchExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'visible', position: 'relative' }}>
      <Map basemap="streets-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <Search position="top-right" />
        </MapView>
      </Map>
    </div>
  );
}

function LayerListExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'visible', position: 'relative' }}>
      <Map basemap="gray-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
          />
          <LayerList position="top-right" />
        </MapView>
      </Map>
    </div>
  );
}

function LegendExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'visible', position: 'relative' }}>
      <Map basemap="gray-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
          />
          <Legend position="bottom-left" />
        </MapView>
      </Map>
    </div>
  );
}

function TileLayerExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map>
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" />
        </MapView>
      </Map>
    </div>
  );
}

function GraphicsLayerExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="streets-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <GraphicsLayer />
        </MapView>
      </Map>
    </div>
  );
}

function GeoJSONLayerExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="gray-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          {/* Note: Would need actual GeoJSON URL or data */}
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            GeoJSON layer example - provide url or data prop
          </div>
        </MapView>
      </Map>
    </div>
  );
}

function SceneViewExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map ground="world-elevation">
        <SceneView
          style={{ height: '100%', width: '100%' }}
          camera={{
            position: {
              x: -118.805,
              y: 34.027,
              z: 5000
            },
            heading: 45,
            tilt: 75
          }}
        />
      </Map>
    </div>
  );
}

function WebMapExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <WebMap
        portalItem={{
          id: 'e691172598f04ea8881cd2a4adaa45ba'
        }}
      />
    </div>
  );
}

function WebSceneExample() {
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <WebScene
        portalItem={{
          id: '3a9976baef924aaabf1b20a4d89e2a77'
        }}
      />
    </div>
  );
}

function UseViewExample() {
  function MapContent() {
    const { view } = useView();
    const [message, setMessage] = useState('');
    
    const goToLocation = () => {
      if (view) {
        view.goTo({
          center: [-122.4, 37.8],
          zoom: 12
        });
        setMessage('Navigated to San Francisco!');
      }
    };
    
    return (
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '4px' }}>
        <button onClick={goToLocation} style={{ marginBottom: '8px' }}>Go to San Francisco</button>
        {message && <div style={{ fontSize: '12px', color: '#666' }}>{message}</div>}
      </div>
    );
  }
  
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <Map basemap="topo-vector">
        <MapView center={[-118, 34]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <MapContent />
        </MapView>
      </Map>
    </div>
  );
}

function UseGraphicExample() {
  function MapWithGraphic() {
    const [layer, setLayer] = useState<any>(null);
    
    const point = useGraphic({
      geometry: {
        type: 'point',
        longitude: -118.805,
        latitude: 34.027
      },
      symbol: {
        type: 'simple-marker',
        color: 'red',
        size: 10
      }
    });
    
    useEffect(() => {
      if (layer && point) {
        layer.add(point);
      }
    }, [layer, point]);
    
    return (
      <Map basemap="streets-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <GraphicsLayer onLoad={setLayer} />
        </MapView>
      </Map>
    );
  }
  
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <MapWithGraphic />
    </div>
  );
}

function UseQueryFeaturesExample() {
  function QueryMap() {
    const [layer, setLayer] = useState<any>(null);
    const { query, loading } = useQueryFeatures(layer);
    const [message, setMessage] = useState('');
    
    const handleQuery = async () => {
      if (layer) {
        const features = await query({
          where: "POP2020 > 1000000",
          outFields: ['NAME', 'POP2020']
        });
        setMessage(`Found ${features.length} cities with population > 1M`);
      }
    };
    
    return (
      <>
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '4px' }}>
          <button onClick={handleQuery} disabled={loading || !layer}>
            Query Large Cities
          </button>
          {message && <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>{message}</div>}
        </div>
        <Map basemap="topo-vector">
          <MapView center={[-98, 39]} zoom={4} style={{ height: '100%', width: '100%' }}>
            <FeatureLayer
              url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
              onLoad={setLayer}
            />
          </MapView>
        </Map>
      </>
    );
  }
  
  return (
    <div style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <QueryMap />
    </div>
  );
}
