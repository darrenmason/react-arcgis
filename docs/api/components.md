# Components API Reference

Complete API reference for all React ArcGIS components.

## Core Components

### Map

Container component for map configuration.

```tsx
import { Map } from 'react-arcgis';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `basemap` | `string \| __esri.Basemap` | `'topo-vector'` | Basemap to display |
| `ground` | `string \| __esri.Ground` | - | Ground surface for 3D |
| `layers` | `__esri.Layer[]` | `[]` | Initial layers |
| `children` | `ReactNode` | - | Child components (views, layers) |
| `onLoad` | `(map: __esri.Map) => void` | - | Callback when map loads |

**Example:**
```tsx
<Map
  basemap="streets-vector"
  layers={[featureLayer]}
  onLoad={(map) => console.log('Map loaded', map)}
>
  <MapView />
</Map>
```

---

### MapView

2D map view component.

```tsx
import { MapView } from 'react-arcgis';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | - | Map center [longitude, latitude] |
| `zoom` | `number` | - | Zoom level (0-23) |
| `scale` | `number` | - | Map scale |
| `rotation` | `number` | `0` | Map rotation (degrees) |
| `extent` | `__esri.Extent` | - | Visible extent |
| `constraints` | `__esri.View2DConstraints` | - | View constraints |
| `padding` | `{ top, right, bottom, left }` | - | View padding |
| `ui` | `{ components: string[] }` | - | UI configuration |
| `highlightOptions` | `__esri.HighlightOptions` | - | Highlight styling |
| `className` | `string` | - | CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Child components |
| **Events** | | | |
| `onViewReady` | `(view: __esri.MapView) => void` | - | View ready callback |
| `onClick` | `(event: __esri.ViewClickEvent) => void` | - | Click handler |
| `onDoubleClick` | `(event: __esri.ViewDoubleClickEvent) => void` | - | Double-click handler |
| `onPointerMove` | `(event: __esri.ViewPointerMoveEvent) => void` | - | Pointer move handler |
| `onPointerEnter` | `(event: __esri.ViewPointerEnterEvent) => void` | - | Pointer enter handler |
| `onPointerLeave` | `(event: __esri.ViewPointerLeaveEvent) => void` | - | Pointer leave handler |
| `onDrag` | `(event: __esri.ViewDragEvent) => void` | - | Drag handler |
| `onHold` | `(event: __esri.ViewHoldEvent) => void` | - | Hold handler |
| `onKeyDown` | `(event: __esri.ViewKeyDownEvent) => void` | - | Key down handler |
| `onKeyUp` | `(event: __esri.ViewKeyUpEvent) => void` | - | Key up handler |
| `onMouseWheel` | `(event: __esri.ViewMouseWheelEvent) => void` | - | Mouse wheel handler |
| `onResize` | `(event: __esri.ViewResizeEvent) => void` | - | Resize handler |

**Example:**
```tsx
<MapView
  center={[-118.805, 34.027]}
  zoom={13}
  rotation={45}
  constraints={{
    minZoom: 3,
    maxZoom: 18
  }}
  onViewReady={(view) => console.log('Ready', view)}
  onClick={(event) => console.log('Click', event.mapPoint)}
>
  <FeatureLayer url="..." />
</MapView>
```

---

### SceneView

3D scene view component.

```tsx
import { SceneView } from 'react-arcgis';
```

**Props:**

Inherits all MapView props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `camera` | `__esri.Camera` | - | Camera position |
| `viewingMode` | `'global' \| 'local'` | `'global'` | Viewing mode |
| `clippingArea` | `__esri.Extent` | - | Clipping area |
| `environment` | `__esri.SceneViewEnvironment` | - | Lighting/atmosphere |
| `qualityProfile` | `'low' \| 'medium' \| 'high'` | `'high'` | Rendering quality |

**Example:**
```tsx
<SceneView
  camera={{
    position: { x: -118, y: 34, z: 5000 },
    heading: 45,
    tilt: 75
  }}
  environment={{
    lighting: { date: new Date() },
    atmosphereEnabled: true
  }}
>
  <SceneLayer url="..." />
</SceneView>
```

---

### WebMap

Load a web map from ArcGIS Online/Enterprise.

```tsx
import { WebMap } from 'react-arcgis';
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `portalItem` | `{ id: string, portal?: __esri.Portal }` | Portal item configuration |
| `children` | `ReactNode` | Optional child components |

**Example:**
```tsx
<WebMap
  portalItem={{
    id: 'web-map-id',
    portal: myPortal
  }}
/>
```

---

### WebScene

Load a web scene from ArcGIS Online/Enterprise.

```tsx
import { WebScene } from 'react-arcgis';
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `portalItem` | `{ id: string, portal?: __esri.Portal }` | Portal item configuration |
| `children` | `ReactNode` | Optional child components |

**Example:**
```tsx
<WebScene
  portalItem={{
    id: 'web-scene-id',
    portal: myPortal
  }}
/>
```

---

## Layer Components

All layer components share common props:

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | Service URL (if applicable) |
| `visible` | `boolean` | Layer visibility |
| `opacity` | `number` | Layer opacity (0-1) |
| `title` | `string` | Layer title |
| `listMode` | `'show' \| 'hide' \| 'hide-children'` | LayerList behavior |
| `onLoad` | `(layer) => void` | Load callback |

### FeatureLayer

```tsx
<FeatureLayer
  url="https://services.arcgis.com/.../FeatureServer/0"
  outFields={['*']}
  popupTemplate={{
    title: '{NAME}',
    content: '{DESCRIPTION}'
  }}
  renderer={{
    type: 'simple',
    symbol: { type: 'simple-marker', color: 'red' }
  }}
/>
```

### GraphicsLayer

```tsx
<GraphicsLayer
  graphics={[graphic1, graphic2]}
  elevationInfo={{ mode: 'on-the-ground' }}
/>
```

### TileLayer

```tsx
<TileLayer
  url="https://services.arcgisonline.com/.../MapServer"
  blendMode="multiply"
/>
```

For complete layer API, see [Layer Components Guide](../guides/layers.md).

---

## Widget Components

All widget components share common props:

| Prop | Type | Description |
|------|------|-------------|
| `view` | `__esri.MapView \| __esri.SceneView` | View instance (optional if inside MapView) |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | Widget position |
| `onLoad` | `(widget) => void` | Load callback |

### Zoom

```tsx
<Zoom position="top-left" />
```

### Home

```tsx
<Home position="top-left" />
```

### Search

```tsx
<Search
  position="top-right"
  sources={[
    { layer: featureLayer, searchFields: ['NAME'] }
  ]}
  onSearch={(result) => console.log(result)}
/>
```

### LayerList

```tsx
<LayerList
  position="top-right"
  listItemCreatedFunction={(event) => {
    event.item.panel = {
      content: 'legend',
      open: true
    };
  }}
/>
```

### Legend

```tsx
<Legend
  position="bottom-right"
  layerInfos={[
    { layer: featureLayer, title: 'Custom Title' }
  ]}
/>
```

For complete widget API, see [Widget Components Guide](../guides/widgets.md).

---

## Type Definitions

```tsx
import type {
  MapProps,
  MapViewProps,
  SceneViewProps,
  WebMapProps,
  WebSceneProps,
  FeatureLayerProps,
  GraphicsLayerProps,
  ZoomProps,
  SearchProps,
  LayerListProps,
  LegendProps
} from 'react-arcgis';
```

---

## Related

- [Hooks API](./hooks.md) - Hook signatures and options
- [Types API](./types.md) - TypeScript types
- [Component Guides](../guides/) - Detailed guides for each component
