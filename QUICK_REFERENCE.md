# React ArcGIS Quick Reference

## Installation

```bash
npm install react-arcgis @arcgis/core
```

## Basic Usage

```tsx
import { Map, MapView, FeatureLayer } from 'react-arcgis';
import '@arcgis/core/assets/esri/themes/light/main.css';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Map basemap="streets-vector">
        <MapView center={[-118.805, 34.027]} zoom={13}>
          <FeatureLayer url="..." />
        </MapView>
      </Map>
    </div>
  );
}
```

## With Calcite Components

```tsx
import {
  Map,
  MapView,
  CalciteShell,
  CalcitePanel,
  CalciteButton
} from 'react-arcgis';
import '@arcgis/core/assets/esri/themes/light/main.css';
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

## Component Cheat Sheet

### Core Components
- `<Map>` - Creates ArcGIS Map
- `<MapView>` - 2D view
- `<SceneView>` - 3D view

### Layers
- `<FeatureLayer>` - Feature service layer
- `<GraphicsLayer>` - Graphics layer
- `<GeoJSONLayer>` - GeoJSON layer

### Hooks
- `useView()` - Access view/map
- `useSearch()` - Search widget
- `useBasemapGallery()` - Basemap selector
- `useSketchViewModel()` - Drawing tools
- `useGraphic()` - Create graphics

### Common Calcite Components
- `CalciteShell` - App layout
- `CalcitePanel` - Content panel
- `CalciteButton` - Button
- `CalciteInput` - Text input
- `CalciteSelect` - Dropdown
- `CalciteSwitch` - Toggle
- `CalciteSlider` - Range slider
- `CalciteAlert` - Alert message
- `CalciteModal` - Modal dialog
- `CalciteLoader` - Loading indicator

## Common Props

### MapView
```tsx
<MapView
  center={[-118.805, 34.027]}
  zoom={13}
  rotation={45}
  onClick={(e) => {...}}
  onViewReady={(view) => {...}}
/>
```

### FeatureLayer
```tsx
<FeatureLayer
  url="https://..."
  visible={true}
  opacity={0.8}
  definitionExpression="STATE = 'CA'"
  renderer={{...}}
  popupTemplate={{...}}
  onLoad={(layer) => {...}}
/>
```

### CalciteButton
```tsx
<CalciteButton
  kind="brand"              // brand | neutral | danger
  appearance="solid"        // solid | outline | transparent
  scale="m"                // s | m | l
  width="auto"             // auto | half | full
  iconStart="plus"         // icon name
  loading={false}
  disabled={false}
  onClick={() => {...}}
>
  Click Me
</CalciteButton>
```

### CalcitePanel
```tsx
<CalcitePanel
  heading="Title"
  description="Subtitle"
  closable={false}
  collapsed={false}
  collapsible={false}
>
  Content
</CalcitePanel>
```

## Event Handlers

### Map Events
```tsx
<MapView
  onClick={(e) => console.log(e.mapPoint)}
  onPointerMove={(e) => {...}}
  onViewReady={(view) => {...}}
/>
```

### Calcite Events
```tsx
// Switch
<CalciteSwitch
  onCalciteSwitchChange={(e) => console.log(e.target.checked)}
/>

// Slider
<CalciteSlider
  onCalciteSliderChange={(e) => console.log(e.target.value)}
/>

// Select
<CalciteSelect
  onCalciteSelectChange={(e) => console.log(e.target.value)}
/>

// Input
<CalciteInput
  onCalciteInputInput={(e) => {...}}    // As user types
  onCalciteInputChange={(e) => {...}}   // On blur
/>
```

## TypeScript

```tsx
import type {
  MapViewProps,
  FeatureLayerProps,
  ViewType
} from 'react-arcgis';

import type {
  CalciteButtonCustomEvent,
  CalciteSwitchCustomEvent
} from 'react-arcgis';
```

## Common Patterns

### Access View from Child Component
```tsx
import { useView } from 'react-arcgis';

function MyComponent() {
  const { view, map } = useView();
  
  return <div>Zoom: {view?.zoom}</div>;
}
```

### Conditional Rendering
```tsx
{showLayer && <FeatureLayer url="..." />}
```

### State-Controlled Props
```tsx
const [zoom, setZoom] = useState(10);

<MapView zoom={zoom} />
<CalciteSlider
  value={zoom}
  onCalciteSliderChange={(e) => setZoom(e.target.value)}
/>
```

### Loading State
```tsx
const [loading, setLoading] = useState(true);

{loading && <CalciteLoader />}

<MapView onViewReady={() => setLoading(false)} />
```

## Useful Icons

Common Calcite icon names:
- `layers`, `basemap`, `legend`, `bookmark`
- `plus`, `minus`, `close`, `check`
- `search`, `filter`, `information`
- `home`, `zoom-in`, `zoom-out`
- `pin`, `pencil`, `polygon`, `line`
- `view-visible`, `view-hide`
- `trash`, `gear`, `save`

## Resources

- [Full Documentation](./README.md)
- [Calcite Guide](./CALCITE.md)
- [Calcite Patterns](./CALCITE_PATTERNS.md)
- [Getting Started](./GETTING_STARTED.md)
- [Examples](./example/)
