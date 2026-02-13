# Getting Started with React ArcGIS

This guide will help you get started with the React ArcGIS wrapper library.

## Installation

1. Install the package and its peer dependency:

```bash
npm install react-arcgis @arcgis/core
```

2. Add the ArcGIS CSS to your HTML file:

```html
<link rel="stylesheet" href="https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/light/main.css">
```

## Your First Map

Create a simple map component:

```tsx
import React from 'react';
import { Map, MapView } from 'react-arcgis';
import '@arcgis/core/assets/esri/themes/light/main.css';

function MyMap() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Map basemap="streets-vector">
        <MapView
          center={[-118.805, 34.027]}
          zoom={13}
        />
      </Map>
    </div>
  );
}

export default MyMap;
```

## Adding Layers

Add a feature layer to your map:

```tsx
import { Map, MapView, FeatureLayer } from 'react-arcgis';

function MapWithLayer() {
  return (
    <div style={{ height: '100vh' }}>
      <Map basemap="topo-vector">
        <MapView center={[-98.5795, 39.8283]} zoom={4}>
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
            popupTemplate={{
              title: '{STATE_NAME}',
              content: 'Population: {POP2010:NumberFormat}'
            }}
          />
        </MapView>
      </Map>
    </div>
  );
}
```

## Handling Events

React to user interactions:

```tsx
function InteractiveMap() {
  const [clickedPoint, setClickedPoint] = useState(null);

  return (
    <Map basemap="streets-vector">
      <MapView
        center={[-118.805, 34.027]}
        zoom={13}
        onClick={(event) => {
          setClickedPoint({
            lat: event.mapPoint.latitude,
            lng: event.mapPoint.longitude
          });
        }}
      />
    </Map>
  );
}
```

## Using Hooks

Access the view from child components:

```tsx
import { useView } from 'react-arcgis';

function ZoomDisplay() {
  const { view } = useView();
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (view) {
      view.watch('zoom', setZoom);
    }
  }, [view]);

  return <div>Current Zoom: {zoom}</div>;
}

// Use it inside a MapView
function App() {
  return (
    <Map basemap="streets-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <ZoomDisplay />
      </MapView>
    </Map>
  );
}
```

## Controlling Map State

Use React state to control the map:

```tsx
function ControlledMap() {
  const [basemap, setBasemap] = useState('streets-vector');
  const [zoom, setZoom] = useState(10);

  return (
    <>
      <div>
        <button onClick={() => setBasemap('satellite')}>Satellite</button>
        <button onClick={() => setBasemap('streets-vector')}>Streets</button>
        <button onClick={() => setZoom(z => z + 1)}>Zoom In</button>
        <button onClick={() => setZoom(z => z - 1)}>Zoom Out</button>
      </div>
      
      <Map basemap={basemap}>
        <MapView
          center={[-118.805, 34.027]}
          zoom={zoom}
        />
      </Map>
    </>
  );
}
```

## Running the Example

To see a working example:

```bash
cd example
npm install
npm start
```

This will start a development server at `http://localhost:3000`.

## Next Steps

- Check out the [README.md](./README.md) for complete API documentation
- Explore the example applications in the `/example` directory
- Read the [ArcGIS SDK documentation](https://developers.arcgis.com/javascript/latest/) for more details on the underlying SDK

## Common Patterns

### Lazy Loading Map Components

```tsx
const LazyMap = lazy(() => import('./components/Map'));

function App() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <LazyMap />
    </Suspense>
  );
}
```

### Multiple Maps

```tsx
function DualMaps() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' }}>
      <Map basemap="streets-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
      
      <Map basemap="satellite">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </div>
  );
}
```

### Dynamic Layers

```tsx
function DynamicLayerMap() {
  const [showLayer, setShowLayer] = useState(true);

  return (
    <>
      <button onClick={() => setShowLayer(!showLayer)}>
        Toggle Layer
      </button>
      
      <Map basemap="gray-vector">
        <MapView center={[-98.5795, 39.8283]} zoom={4}>
          {showLayer && (
            <FeatureLayer url="..." />
          )}
        </MapView>
      </Map>
    </>
  );
}
```

## Troubleshooting

### Map not displaying

- Ensure the parent container has explicit height/width
- Check that the ArcGIS CSS is loaded
- Verify your ArcGIS SDK version matches the peer dependency

### TypeScript errors

- Install `@types/arcgis-js-api` if needed
- Ensure `@arcgis/core` is installed

### Performance issues

- Memoize layer configurations with `useMemo`
- Avoid creating new objects in render
- Use `definitionExpression` to limit feature queries

```tsx
// Good
const renderer = useMemo(() => ({ type: 'simple', ... }), []);

// Bad - creates new object every render
<FeatureLayer renderer={{ type: 'simple', ... }} />
```
