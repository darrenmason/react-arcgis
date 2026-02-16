# Quick Reference

Common patterns and examples for React ArcGIS.

## Basic Map

```tsx
import { Map, MapView } from 'react-arcgis';

<Map basemap="topo-vector">
  <MapView center={[-118, 34]} zoom={10} />
</Map>
```

## With Layers

```tsx
import { Map, MapView, FeatureLayer, GraphicsLayer } from 'react-arcgis';

<Map basemap="gray-vector">
  <MapView center={[-98, 40]} zoom={4}>
    <FeatureLayer url="https://services.arcgis.com/.../FeatureServer/0" />
    <GraphicsLayer />
  </MapView>
</Map>
```

## With Widgets

```tsx
import { 
  Map, MapView, 
  Zoom, Home, Search, LayerList, Legend 
} from 'react-arcgis';

<Map basemap="streets-vector">
  <MapView center={[-122, 37]} zoom={12}>
    <Zoom position="top-left" />
    <Home position="top-left" />
    <Search position="top-right" />
    <LayerList position="top-right" />
    <Legend position="bottom-right" />
  </MapView>
</Map>
```

## 3D Scene

```tsx
import { Map, SceneView, SceneLayer } from 'react-arcgis';

<Map ground="world-elevation">
  <SceneView camera={{ position: { x: -118, y: 34, z: 50000 }}}>
    <SceneLayer url="https://tiles.arcgis.com/.../SceneServer" />
  </SceneView>
</Map>
```

## Using Hooks

### Query Features

```tsx
import { useQueryFeatures } from 'react-arcgis';

const { query, loading, results } = useQueryFeatures(featureLayer);

const handleQuery = async () => {
  const features = await query({
    where: "POP > 1000000",
    outFields: ['*']
  });
};
```

### Portal Search

```tsx
import { usePortal, usePortalSearch } from 'react-arcgis';

const { portal } = usePortal();
const { search, results } = usePortalSearch(portal);

const searchMaps = async () => {
  await search({
    query: 'type:"Web Map"',
    num: 20
  });
};
```

### Authentication

```tsx
import { useOAuthInfo } from 'react-arcgis';

const { credential, signIn, signOut } = useOAuthInfo({
  appId: 'YOUR_APP_ID'
});

<button onClick={signIn}>Sign In</button>
```

## Theme Management

```tsx
import { useTheme } from 'react-arcgis';

function App() {
  useTheme('auto'); // 'light', 'dark', or 'auto'
  
  return <Map>...</Map>;
}
```

## Load WebMap

```tsx
import { WebMap } from 'react-arcgis';

<WebMap portalItem={{ id: 'web-map-id' }} />
```

## Event Handling

```tsx
<MapView
  onViewReady={(view) => console.log('View ready', view)}
  onClick={(event) => console.log('Map clicked', event)}
  onPointerMove={(event) => console.log('Pointer moved', event)}
>
  {/* Content */}
</MapView>
```

## Graphics

```tsx
import { GraphicsLayer, useGraphic } from 'react-arcgis';

function MyComponent() {
  const [layer, setLayer] = useState(null);
  
  const graphic = useGraphic({
    geometry: {
      type: 'point',
      longitude: -118,
      latitude: 34
    },
    symbol: {
      type: 'simple-marker',
      color: 'red',
      size: 10
    }
  });
  
  useEffect(() => {
    if (layer && graphic) {
      layer.add(graphic);
    }
  }, [layer, graphic]);
  
  return <GraphicsLayer onLoad={setLayer} />;
}
```

## Analysis

```tsx
import { 
  useQueryFeatures,
  useStatistics,
  useBufferAnalysis,
  useSpatialQuery
} from 'react-arcgis';

// Query features
const { query } = useQueryFeatures(layer);
const features = await query({ where: "STATE = 'CA'" });

// Calculate statistics
const { calculateStatistics } = useStatistics(layer);
const stats = await calculateStatistics({
  statisticDefinitions: [
    { statisticType: 'sum', onStatisticField: 'POP', outStatisticFieldName: 'total' }
  ]
});

// Buffer analysis
const { buffer } = useBufferAnalysis();
const buffered = await buffer(point, { distance: 10, unit: 'miles' });

// Spatial query
const { findNearby } = useSpatialQuery(layer);
const nearby = await findNearby(point, { distance: 10, units: 'miles' });
```

## Measurement

```tsx
import { useGeometryMeasurement } from 'react-arcgis';

const { measureDistance, measureArea } = useGeometryMeasurement();

// Measure distance
const distance = await measureDistance(point1, point2, 'miles');
console.log(`Distance: ${distance.value} ${distance.unit}`);

// Measure area
const area = await measureArea(polygon, 'square-miles');
console.log(`Area: ${area.value} ${area.unit}`);
```

## Routing

```tsx
import { useRouteAnalysis } from 'react-arcgis';

const { solveRoute } = useRouteAnalysis(serviceUrl);

const route = await solveRoute({
  stops: [start, end],
  returnDirections: true
});

console.log('Distance:', route.routeResults[0].directions.totalLength);
```

## Common Imports

```tsx
// Core
import { Map, MapView, SceneView } from 'react-arcgis';

// Layers
import { 
  FeatureLayer, 
  GraphicsLayer, 
  TileLayer,
  MapImageLayer 
} from 'react-arcgis';

// Widgets
import { 
  Zoom, Home, Search, 
  LayerList, Legend,
  BasemapGallery, Sketch 
} from 'react-arcgis';

// Hooks
import { 
  useView,
  useQueryFeatures,
  usePortal,
  useTheme 
} from 'react-arcgis';

// Portal
import { 
  usePortal,
  usePortalSearch,
  usePortalItem,
  useOAuthInfo 
} from 'react-arcgis';

// Calcite
import { 
  CalciteButton,
  CalcitePanel,
  CalciteShell,
  CalciteLoader 
} from '@esri/calcite-components-react';
```

## Next Steps

- [Components API](../api/components.md) - Complete API reference
- [Hooks API](../api/hooks.md) - All hooks documentation
- [Examples](../examples/basic.md) - More examples
