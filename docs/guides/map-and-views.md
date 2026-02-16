# Map & View Components

Core components for creating maps in React ArcGIS.

## Overview

React ArcGIS provides three core view components:
- **Map** - Container for map data and configuration
- **MapView** - 2D map display
- **SceneView** - 3D scene display

## Map Component

The `Map` component is the container that holds all map configuration and layers.

### Basic Usage

```tsx
import { Map, MapView } from 'react-arcgis';

<Map basemap="topo-vector">
  <MapView center={[-118, 34]} zoom={10} />
</Map>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `basemap` | `string \| __esri.Basemap` | Basemap to display |
| `ground` | `string \| __esri.Ground` | Ground surface (for 3D) |
| `layers` | `__esri.Layer[]` | Initial layers |
| `onLoad` | `(map: __esri.Map) => void` | Callback when map loads |

### Basemap Options

Built-in basemaps:
- `'topo-vector'` - Topographic (vector)
- `'streets-vector'` - Streets (vector)
- `'gray-vector'` - Gray canvas (vector)
- `'dark-gray-vector'` - Dark gray canvas (vector)
- `'streets-navigation-vector'` - Streets navigation
- `'streets-night-vector'` - Streets at night
- `'satellite'` - Satellite imagery
- `'hybrid'` - Satellite with labels
- `'terrain'` - Terrain with labels
- `'oceans'` - Ocean basemap

### Custom Basemap

```tsx
<Map
  basemap={{
    baseLayers: [
      new TileLayer({ url: 'https://...' })
    ]
  }}
>
  <MapView />
</Map>
```

---

## MapView Component

2D map display with pan, zoom, and rotation.

### Basic Usage

```tsx
<Map basemap="streets-vector">
  <MapView
    center={[-118.805, 34.027]}
    zoom={13}
    rotation={45}
  >
    {/* Add layers and widgets here */}
  </MapView>
</Map>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `center` | `[number, number]` | Map center [longitude, latitude] |
| `zoom` | `number` | Zoom level (0-23) |
| `rotation` | `number` | Map rotation in degrees |
| `scale` | `number` | Map scale |
| `extent` | `__esri.Extent` | Visible extent |
| `constraints` | `__esri.View2DConstraints` | View constraints |
| `padding` | `{ top, right, bottom, left }` | View padding |
| `ui` | `{ components: string[] }` | UI components to display |
| `highlightOptions` | `__esri.HighlightOptions` | Highlight styling |
| `className` | `string` | CSS class name |
| `style` | `React.CSSProperties` | Inline styles |

### Events

| Event | Description |
|-------|-------------|
| `onViewReady` | View is ready |
| `onClick` | Map clicked |
| `onDoubleClick` | Map double-clicked |
| `onPointerMove` | Pointer moved |
| `onPointerEnter` | Pointer entered |
| `onPointerLeave` | Pointer left |
| `onDrag` | Map dragged |
| `onHold` | Long press/hold |
| `onKeyDown` | Key pressed |
| `onKeyUp` | Key released |
| `onMouseWheel` | Mouse wheel scrolled |
| `onResize` | View resized |

### Example: Full Configuration

```tsx
<MapView
  center={[-118.805, 34.027]}
  zoom={13}
  rotation={0}
  constraints={{
    minZoom: 3,
    maxZoom: 18,
    rotationEnabled: true
  }}
  padding={{ top: 50, right: 0, bottom: 0, left: 300 }}
  ui={{
    components: ['attribution'] // Hide default UI
  }}
  highlightOptions={{
    color: [255, 255, 0, 1],
    haloColor: [255, 255, 255, 1],
    fillOpacity: 0.25
  }}
  onViewReady={(view) => console.log('View ready', view)}
  onClick={(event) => console.log('Click', event.mapPoint)}
  onPointerMove={(event) => console.log('Move', event.x, event.y)}
>
  {/* Layers and widgets */}
</MapView>
```

---

## SceneView Component

3D scene display with tilt, heading, and elevation.

### Basic Usage

```tsx
<Map ground="world-elevation">
  <SceneView
    camera={{
      position: {
        x: -118.805,
        y: 34.027,
        z: 5000
      },
      heading: 0,
      tilt: 75
    }}
  >
    {/* Add 3D layers */}
  </SceneView>
</Map>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `camera` | `__esri.Camera` | Camera position and orientation |
| `center` | `[number, number, number]` | Center [lon, lat, elevation] |
| `viewingMode` | `'global' \| 'local'` | Viewing mode |
| `clippingArea` | `__esri.Extent` | Clipping area |
| `constraints` | `__esri.SceneViewConstraints` | View constraints |
| `environment` | `__esri.SceneViewEnvironment` | Lighting and atmosphere |
| `qualityProfile` | `'low' \| 'medium' \| 'high'` | Rendering quality |
| All MapView props | | All MapView props also supported |

### Camera Configuration

```tsx
<SceneView
  camera={{
    position: {
      x: -118.805,    // Longitude
      y: 34.027,      // Latitude
      z: 5000,        // Elevation (meters)
      spatialReference: { wkid: 4326 }
    },
    heading: 45,      // Direction (0-360)
    tilt: 75          // Tilt angle (0-90)
  }}
/>
```

### Environment Configuration

```tsx
<SceneView
  environment={{
    lighting: {
      date: new Date('June 21, 2024 15:00:00 UTC'),
      directShadowsEnabled: true,
      ambientOcclusionEnabled: true
    },
    atmosphereEnabled: true,
    starsEnabled: true
  }}
/>
```

### Example: Full 3D Configuration

```tsx
<Map ground="world-elevation">
  <SceneView
    camera={{
      position: { x: -118.805, y: 34.027, z: 5000 },
      heading: 45,
      tilt: 75
    }}
    viewingMode="global"
    environment={{
      lighting: {
        date: new Date(),
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true
      },
      atmosphereEnabled: true,
      starsEnabled: true
    }}
    qualityProfile="high"
    constraints={{
      altitude: {
        min: 100,
        max: 100000
      }
    }}
    onViewReady={(view) => console.log('3D View ready', view)}
  >
    <SceneLayer url="https://tiles.arcgis.com/.../SceneServer" />
    <IntegratedMeshLayer url="..." />
  </SceneView>
</Map>
```

---

## Using with Context

Access the view instance from child components:

```tsx
import { useView } from 'react-arcgis';

function MyComponent() {
  const { view, map } = useView();
  
  useEffect(() => {
    if (view) {
      // Interact with the view
      view.goTo({
        center: [-118, 34],
        zoom: 12
      });
    }
  }, [view]);
  
  return null;
}

// Use inside MapView
<MapView>
  <MyComponent />
</MapView>
```

---

## Switching Between 2D and 3D

```tsx
function MapContainer() {
  const [is3D, setIs3D] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIs3D(!is3D)}>
        Switch to {is3D ? '2D' : '3D'}
      </button>
      
      <Map basemap="satellite" ground={is3D ? 'world-elevation' : undefined}>
        {is3D ? (
          <SceneView camera={{ position: {...}, heading: 0, tilt: 75 }}>
            <SceneLayer url="..." />
          </SceneView>
        ) : (
          <MapView center={[-118, 34]} zoom={12}>
            <FeatureLayer url="..." />
          </MapView>
        )}
      </Map>
    </div>
  );
}
```

---

## Best Practices

### 1. View Initialization

Wait for view to be ready before interacting:

```tsx
const [view, setView] = useState(null);

<MapView onViewReady={setView}>
  {view && (
    // Components that need view
  )}
</MapView>
```

### 2. Controlled vs Uncontrolled

```tsx
// Uncontrolled (recommended for initial state)
<MapView center={[-118, 34]} zoom={12} />

// Controlled (use for programmatic updates)
<MapView center={center} zoom={zoom} />
```

### 3. Performance

- Limit the number of layers
- Use clustering for large datasets
- Optimize basemap selection
- Set appropriate quality profile for 3D

### 4. Responsive Design

```tsx
<div style={{ height: '100vh', width: '100vw' }}>
  <Map>
    <MapView>
      {/* Map content */}
    </MapView>
  </Map>
</div>
```

---

## Related

- [Layer Components](./layers.md) - Add data layers
- [Widget Components](./widgets.md) - Add UI widgets
- [WebMap & WebScene](./webmap-webscene.md) - Load portal content
- [Utility Hooks](./utility-hooks.md) - Core hooks including useView

---

## API Reference

For complete API details, see:
- [Components API](../api/components.md#map)
- [Components API](../api/components.md#mapview)
- [Components API](../api/components.md#sceneview)
