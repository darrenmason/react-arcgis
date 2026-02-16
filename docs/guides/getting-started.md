# Getting Started

Quick start guide for React ArcGIS.

## Installation

```bash
npm install react-arcgis @arcgis/core @esri/calcite-components-react
```

## Basic Setup

### 1. Import Styles

Add to your `index.html` or main CSS file:

```html
<!-- ArcGIS Maps SDK CSS -->
<link rel="stylesheet" href="https://js.arcgis.com/4.29/@arcgis/core/assets/esri/themes/light/main.css">

<!-- Calcite Components CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/calcite.css">
```

### 2. Create Your First Map

```tsx
import { Map, MapView, FeatureLayer } from 'react-arcgis';

function App() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <FeatureLayer
          url="https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
        />
      </MapView>
    </Map>
  );
}

export default App;
```

### 3. Add Widgets

```tsx
import { Map, MapView, FeatureLayer, Zoom, Search } from 'react-arcgis';

function App() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <FeatureLayer url="..." />
        
        {/* Add widgets */}
        <Zoom position="top-left" />
        <Search position="top-right" />
      </MapView>
    </Map>
  );
}
```

## Project Structure

```
your-project/
├── src/
│   ├── App.tsx          # Main application
│   ├── main.tsx         # Entry point
│   └── components/      # Your components
├── public/
│   └── index.html       # Include CSS here
├── package.json
└── tsconfig.json        # TypeScript config
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

## Next Steps

- [Map & View Components](./map-and-views.md) - Learn about Map, MapView, and SceneView
- [Layer Components](./layers.md) - Add data layers to your map
- [Widget Components](./widgets.md) - Add interactive widgets
- [Theming](./theming.md) - Customize the appearance

## Common Patterns

### Loading State

```tsx
function App() {
  const [view, setView] = useState(null);
  
  return (
    <div>
      {!view && <div>Loading map...</div>}
      
      <MapView onViewReady={setView}>
        {/* Map content */}
      </MapView>
    </div>
  );
}
```

### Using Hooks

```tsx
import { useView } from 'react-arcgis';

function MyComponent() {
  const { view, map } = useView();
  
  useEffect(() => {
    if (view) {
      console.log('View is ready!');
    }
  }, [view]);
  
  return null;
}
```

### Error Handling

```tsx
function App() {
  const [error, setError] = useState(null);
  
  return (
    <MapView onError={(err) => setError(err)}>
      {error && <div>Error: {error.message}</div>}
    </MapView>
  );
}
```

## Need Help?

- [Quick Reference](./quick-reference.md) - Common patterns
- [Troubleshooting](./troubleshooting.md) - Common issues
- [FAQ](./faq.md) - Frequently asked questions
- [GitHub Issues](https://github.com/your-repo/react-arcgis/issues) - Report bugs
