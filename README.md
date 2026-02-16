# React ArcGIS

A React-friendly wrapper library for the ArcGIS SDK for JavaScript, providing declarative components with proper lifecycle management, JSX rendering, and props-based configuration.

## Features

- 🎯 **React-First Design**: Components follow React patterns with proper lifecycle management
- 🔄 **Declarative API**: Configure maps and layers using JSX and props
- 🎣 **Custom Hooks**: Reusable hooks for common ArcGIS operations
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🌍 **Comprehensive Components**: Map, MapView, SceneView, and various layer types
- 🔌 **Context API Integration**: Share view and map instances across components
- 🎨 **Calcite Design System**: Full integration with Esri's Calcite web components

## Installation

```bash
npm install react-arcgis @arcgis/core
```

Don't forget to include the required CSS in your application:

```tsx
// ArcGIS CSS (required)
import '@arcgis/core/assets/esri/themes/light/main.css';

// Calcite CSS (optional, for Calcite components)
import '@esri/calcite-components/dist/calcite/calcite.css';
```

## Quick Start

```tsx
import React from 'react';
import { Map, MapView, FeatureLayer } from 'react-arcgis';
import '@arcgis/core/assets/esri/themes/light/main.css';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Map basemap="topo-vector">
        <MapView
          center={[-118.805, 34.027]}
          zoom={13}
          onClick={(event) => console.log('Clicked:', event.mapPoint)}
        >
          <FeatureLayer
            url="https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
            visible={true}
            opacity={0.8}
          />
        </MapView>
      </Map>
    </div>
  );
}
```

## Core Components

### Map

The `Map` component creates an ArcGIS Map instance and manages its lifecycle.

```tsx
<Map
  basemap="streets-vector"
  layers={[layer1, layer2]}
  onLoad={(map) => console.log('Map loaded:', map)}
>
  {/* Child components */}
</Map>
```

**Props:**
- `basemap`: string | Basemap - Map basemap
- `ground`: Ground - Ground surface configuration
- `layers`: Layer[] - Initial layers
- `onLoad`: (map: Map) => void - Callback when map loads

### MapView

The `MapView` component creates a 2D map view.

```tsx
<MapView
  center={[-118.805, 34.027]}
  zoom={13}
  rotation={45}
  onClick={(event) => console.log(event)}
  onViewReady={(view) => console.log('View ready:', view)}
>
  {/* Layer components */}
</MapView>
```

**Props:**
- `center`: [number, number] | Point - View center
- `zoom`: number - Zoom level (0-23)
- `scale`: number - Map scale
- `extent`: Extent - View extent
- `rotation`: number - View rotation in degrees
- `constraints`: MapViewConstraints - View constraints
- `onClick`: (event) => void - Click event handler
- `onPointerMove`: (event) => void - Pointer move handler
- `onLoad`: (view: MapView) => void - Load callback
- `onViewReady`: (view: MapView) => void - Ready callback

### SceneView

The `SceneView` component creates a 3D scene view.

```tsx
<SceneView
  center={[-118.805, 34.027]}
  zoom={13}
  camera={{
    position: { x: -118.805, y: 34.027, z: 1000 },
    tilt: 65
  }}
  viewingMode="global"
>
  {/* Layer components */}
</SceneView>
```

**Props:**
- `center`: [number, number] | Point - View center
- `zoom`: number - Zoom level
- `camera`: Camera - Camera configuration
- `viewingMode`: 'global' | 'local' - Viewing mode
- `onClick`: (event) => void - Click event handler
- `onLoad`: (view: SceneView) => void - Load callback
- `onViewReady`: (view: SceneView) => void - Ready callback

## Layer Components

### FeatureLayer

```tsx
<FeatureLayer
  url="https://services.arcgis.com/.../FeatureServer/0"
  visible={true}
  opacity={0.8}
  definitionExpression="STATE_NAME = 'California'"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [51, 51, 204, 0.9]
    }
  }}
  popupTemplate={{
    title: '{NAME}',
    content: '{DESCRIPTION}'
  }}
  onLoad={(layer) => console.log('Layer loaded:', layer)}
/>
```

**Props:**
- `url`: string - Feature service URL
- `portalItem`: PortalItem - Portal item reference
- `visible`: boolean - Layer visibility
- `opacity`: number - Layer opacity (0-1)
- `renderer`: Renderer - Feature renderer
- `popupTemplate`: PopupTemplate - Popup configuration
- `definitionExpression`: string - SQL where clause
- `outFields`: string[] - Fields to query
- `onLoad`: (layer) => void - Load callback

### GraphicsLayer

```tsx
<GraphicsLayer
  graphics={graphicsArray}
  visible={true}
  opacity={1}
  onLoad={(layer) => console.log('Graphics layer loaded:', layer)}
/>
```

**Props:**
- `graphics`: Graphic[] - Array of graphics
- `visible`: boolean - Layer visibility
- `opacity`: number - Layer opacity (0-1)
- `elevationInfo`: ElevationInfo - Elevation settings
- `onLoad`: (layer) => void - Load callback

### GeoJSONLayer

```tsx
<GeoJSONLayer
  url="https://example.com/data.geojson"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: 'orange',
      size: 8
    }
  }}
/>
```

## Custom Hooks

### useView

Access the current view and map from any child component.

```tsx
import { useView } from 'react-arcgis';

function MyComponent() {
  const { view, map } = useView();
  
  useEffect(() => {
    if (view) {
      console.log('Current zoom:', view.zoom);
    }
  }, [view]);
  
  return <div>Zoom: {view?.zoom}</div>;
}
```

### useSearch

Add a search widget to your view.

```tsx
import { useSearch } from 'react-arcgis';

function SearchWidget() {
  const { view } = useView();
  const { search, loading } = useSearch({
    view,
    position: 'top-right',
    searchAllEnabled: true,
    suggestionEnabled: true
  });
  
  return loading ? <div>Loading search...</div> : null;
}
```

### useBasemapGallery

Add a basemap gallery widget.

```tsx
import { useBasemapGallery } from 'react-arcgis';

function BasemapSelector() {
  const { view } = useView();
  const { gallery, loading } = useBasemapGallery({
    view,
    position: 'top-right'
  });
  
  return null; // Widget is added to the view UI
}
```

### useSketchViewModel

Enable drawing and editing graphics.

```tsx
import { useSketchViewModel } from 'react-arcgis';

function DrawingTools() {
  const { view } = useView();
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  const { sketchVM, create, cancel } = useSketchViewModel({
    view,
    layer: graphicsLayer,
    onCreateComplete: (event) => {
      console.log('Graphic created:', event.graphic);
    }
  });
  
  return (
    <div>
      <button onClick={() => create('point')}>Draw Point</button>
      <button onClick={() => create('polyline')}>Draw Line</button>
      <button onClick={() => create('polygon')}>Draw Polygon</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}
```

### useGraphic

Create graphics programmatically.

```tsx
import { useGraphic } from 'react-arcgis';

function MyGraphic() {
  const { graphic, loading } = useGraphic({
    geometry: {
      type: 'point',
      longitude: -118.805,
      latitude: 34.027
    },
    symbol: {
      type: 'simple-marker',
      color: 'red',
      size: 12
    },
    attributes: {
      name: 'My Point'
    }
  });
  
  return loading ? null : <GraphicsLayer graphics={[graphic]} />;
}
```

## Advanced Examples

### Multiple Layers with State Management

```tsx
function AdvancedMap() {
  const [layers, setLayers] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  return (
    <Map basemap="gray-vector">
      <MapView
        center={[-98.5795, 39.8283]}
        zoom={4}
        onClick={async (event) => {
          const response = await view.hitTest(event);
          if (response.results.length > 0) {
            setSelectedFeatures(response.results);
          }
        }}
      >
        <FeatureLayer
          url="https://services.arcgis.com/.../FeatureServer/0"
          definitionExpression="POP2010 > 1000000"
          renderer={{
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [51, 51, 204, 0.5],
              outline: {
                color: 'white',
                width: 1
              }
            }
          }}
        />
        
        <GraphicsLayer graphics={selectedFeatures} />
      </MapView>
    </Map>
  );
}
```

### 3D Scene with Custom Camera

```tsx
function Scene3D() {
  const [camera, setCamera] = useState({
    position: { x: -118.805, y: 34.027, z: 5000 },
    heading: 0,
    tilt: 65
  });
  
  return (
    <Map basemap="satellite" ground="world-elevation">
      <SceneView
        camera={camera}
        viewingMode="global"
        onViewReady={(view) => {
          // Animate camera
          view.goTo({
            target: [-118.805, 34.027],
            zoom: 13,
            tilt: 80
          }, {
            duration: 3000
          });
        }}
      >
        <FeatureLayer
          url="https://services.arcgis.com/.../FeatureServer/0"
          elevationInfo={{
            mode: 'relative-to-ground',
            offset: 100
          }}
        />
      </SceneView>
    </Map>
  );
}
```

## TypeScript Support

All components and hooks are fully typed. Import types from the package:

```tsx
import type {
  MapViewProps,
  SceneViewProps,
  FeatureLayerProps,
  ViewType,
  ViewContext
} from 'react-arcgis';
```

## Calcite Design System

React ArcGIS includes full support for Esri's Calcite Design System. All Calcite web components are available as React components:

```tsx
import {
  Map,
  MapView,
  CalciteShell,
  CalcitePanel,
  CalciteButton,
  CalciteSwitch
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Controls">
          <CalciteButton>Click Me</CalciteButton>
        </CalcitePanel>
      </CalciteShellPanel>
      
      <Map basemap="streets-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </CalciteShell>
  );
}
```

For complete Calcite documentation, see [CALCITE.md](./CALCITE.md).

## Best Practices

1. **Always wrap layers in a View component**: Layers need a map and view context to function properly.

2. **Use the `useView` hook**: Access the view and map from nested components without prop drilling.

3. **Handle async operations**: ArcGIS SDK operations are async. Use `onLoad` and `onViewReady` callbacks.

4. **Manage layer lifecycle**: Layers are automatically added/removed when components mount/unmount.

5. **Memoize complex objects**: Use `useMemo` for layer configurations to prevent unnecessary re-renders.

```tsx
const renderer = useMemo(() => ({
  type: 'simple',
  symbol: { type: 'simple-fill', color: 'blue' }
}), []);
```

6. **Use Calcite for UI**: Leverage Calcite components for consistent, professional UI that matches the ArcGIS aesthetic.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Resources

- [ArcGIS SDK for JavaScript Documentation](https://developers.arcgis.com/javascript/latest/)
- [ArcGIS Developer Portal](https://developers.arcgis.com/)
- [React Documentation](https://react.dev/)
