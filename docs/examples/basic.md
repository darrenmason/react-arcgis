# Basic Examples

Simple examples to get started with React ArcGIS.

## Hello World Map

The simplest possible map:

```tsx
import { Map, MapView } from 'react-arcgis';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </div>
  );
}
```

## Map with Feature Layer

Add data to your map:

```tsx
import { Map, MapView, FeatureLayer } from 'react-arcgis';

function DataMap() {
  return (
    <Map basemap="streets-vector">
      <MapView center={[-98, 39]} zoom={4}>
        <FeatureLayer
          url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
          popupTemplate={{
            title: '{NAME}',
            content: 'Population: {POP2020}'
          }}
        />
      </MapView>
    </Map>
  );
}
```

## Map with Widgets

Add UI controls:

```tsx
import { 
  Map, MapView, FeatureLayer,
  Zoom, Home, Search, LayerList 
} from 'react-arcgis';

function InteractiveMap() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-122.4, 37.8]} zoom={12}>
        <FeatureLayer url="..." />
        
        {/* Navigation widgets */}
        <Zoom position="top-left" />
        <Home position="top-left" />
        
        {/* Search widget */}
        <Search position="top-right" />
        
        {/* Layer list */}
        <LayerList position="top-right" />
      </MapView>
    </Map>
  );
}
```

## 3D Scene

Create a 3D map:

```tsx
import { Map, SceneView, SceneLayer } from 'react-arcgis';

function Scene3D() {
  return (
    <Map ground="world-elevation">
      <SceneView
        camera={{
          position: {
            x: -118.805,
            y: 34.027,
            z: 5000
          },
          heading: 45,
          tilt: 75
        }}
      >
        <SceneLayer
          url="https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer"
        />
      </SceneView>
    </Map>
  );
}
```

## Multiple Layers

Layer stack example:

```tsx
import { 
  Map, MapView,
  TileLayer, FeatureLayer, GraphicsLayer 
} from 'react-arcgis';

function LayeredMap() {
  return (
    <Map>
      <MapView center={[-118, 34]} zoom={10}>
        {/* Base layer */}
        <TileLayer url="..." />
        
        {/* Data layers */}
        <FeatureLayer url="..." opacity={0.75} />
        <FeatureLayer url="..." />
        
        {/* Graphics layer for user drawings */}
        <GraphicsLayer />
      </MapView>
    </Map>
  );
}
```

## Using Hooks

Access view and query features:

```tsx
import { Map, MapView, FeatureLayer, useView, useQueryFeatures } from 'react-arcgis';
import { useState } from 'react';

function QueryMap() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118, 34]} zoom={8}>
        <MapContent />
      </MapView>
    </Map>
  );
}

function MapContent() {
  const { view } = useView();
  const [layer, setLayer] = useState(null);
  const { query, loading, results } = useQueryFeatures(layer);
  
  const handleQuery = async () => {
    const features = await query({
      where: "POP2020 > 1000000",
      outFields: ['NAME', 'POP2020']
    });
    
    console.log('Found', features.length, 'cities');
  };
  
  return (
    <>
      <FeatureLayer url="..." onLoad={setLayer} />
      
      {view && layer && (
        <button onClick={handleQuery} disabled={loading}>
          Query Large Cities
        </button>
      )}
      
      {results && (
        <div>
          <h3>Results ({results.length})</h3>
          <ul>
            {results.map((f, i) => (
              <li key={i}>
                {f.attributes.NAME}: {f.attributes.POP2020.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
```

## Click Handler

Handle map clicks:

```tsx
import { Map, MapView } from 'react-arcgis';

function ClickableMap() {
  const handleClick = (event) => {
    console.log('Clicked at:', event.mapPoint);
    alert(`Lat: ${event.mapPoint.latitude.toFixed(4)}, Lon: ${event.mapPoint.longitude.toFixed(4)}`);
  };
  
  return (
    <Map basemap="streets-vector">
      <MapView
        center={[-118, 34]}
        zoom={10}
        onClick={handleClick}
      />
    </Map>
  );
}
```

## Theme Switcher

Light/dark theme toggle:

```tsx
import { Map, MapView, useTheme } from 'react-arcgis';
import { useState } from 'react';

function ThemedMap() {
  const [theme, setTheme] = useState('light');
  useTheme(theme);
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      
      <Map basemap="gray-vector">
        <MapView center={[-118, 34]} zoom={10} />
      </Map>
    </div>
  );
}
```

## Graphics Drawing

Add graphics to the map:

```tsx
import { Map, MapView, GraphicsLayer, useGraphic } from 'react-arcgis';
import { useState, useEffect } from 'react';

function DrawingMap() {
  const [layer, setLayer] = useState(null);
  
  const point = useGraphic({
    geometry: {
      type: 'point',
      longitude: -118.805,
      latitude: 34.027
    },
    symbol: {
      type: 'simple-marker',
      color: 'red',
      size: 10,
      outline: { color: 'white', width: 2 }
    },
    attributes: { name: 'My Point' }
  });
  
  useEffect(() => {
    if (layer && point) {
      layer.add(point);
    }
  }, [layer, point]);
  
  return (
    <Map basemap="streets-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <GraphicsLayer onLoad={setLayer} />
      </MapView>
    </Map>
  );
}
```

## WebMap from Portal

Load a web map:

```tsx
import { WebMap } from 'react-arcgis';

function PortalMap() {
  return (
    <WebMap
      portalItem={{
        id: 'e691172598f04ea8881cd2a4adaa45ba'
      }}
    />
  );
}
```

## Calcite UI Integration

Use Calcite components:

```tsx
import { Map, MapView, FeatureLayer } from 'react-arcgis';
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteButton
} from '@esri/calcite-components-react';

function CalciteMap() {
  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Controls">
          <CalciteButton width="full">
            Query Data
          </CalciteButton>
        </CalcitePanel>
      </CalciteShellPanel>
      
      <Map basemap="topo-vector">
        <MapView center={[-118, 34]} zoom={10}>
          <FeatureLayer url="..." />
        </MapView>
      </Map>
    </CalciteShell>
  );
}
```

## Next Steps

- [Advanced Examples](./advanced.md) - Complex applications
- [Portal Examples](./portal.md) - Portal integration
- [Analysis Examples](./analysis.md) - GIS analysis
- [API Reference](../api/) - Complete API documentation
