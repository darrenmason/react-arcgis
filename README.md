# React ArcGIS

Modern React components and hooks for building ArcGIS Maps SDK applications.

[![npm version](https://img.shields.io/npm/v/react-arcgis.svg)](https://www.npmjs.com/package/react-arcgis)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🗺️ **46 Components** - Complete component library (5 core + 18 widgets + 23 layers)
- 🎣 **36+ Hooks** - Full React hooks API for all ArcGIS functionality
- 🎨 **Theme Support** - Built-in light/dark mode with system preference detection
- 🌐 **Portal Integration** - Complete ArcGIS Online/Enterprise support with 9 specialized hooks
- 📊 **GIS Analysis** - 10 analysis hooks for queries, statistics, spatial ops, and routing
- 🔐 **Authentication** - OAuth 2.0 and Portal authentication
- 📱 **Responsive** - Mobile-friendly and responsive design
- 🎯 **TypeScript** - Full type definitions included
- 🚀 **Modern Build** - ESM and CJS formats, tree-shakeable

## Quick Start

### Installation

```bash
npm install react-arcgis @arcgis/core @esri/calcite-components-react
```

### Basic Map

```tsx
import { Map, MapView, FeatureLayer, Zoom, Search } from 'react-arcgis';

function App() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <FeatureLayer url="https://services3.arcgis.com/.../FeatureServer/0" />
        <Zoom position="top-left" />
        <Search position="top-right" />
      </MapView>
    </Map>
  );
}
```

## Documentation

**📚 [Complete Documentation →](./docs/README.md)**

### Quick Links

- **[Getting Started](./docs/guides/getting-started.md)** - Installation and setup
- **[Quick Reference](./docs/guides/quick-reference.md)** - Common patterns
- **[API Reference](./docs/api/)** - Complete API documentation

### Guides

#### Components
- [Map & View Components](./docs/guides/map-and-views.md) - Map, MapView, SceneView
- [Layer Components](./docs/guides/layers.md) - All 23 layer types
- [Widget Components](./docs/guides/widgets.md) - All 18 widgets
- [WebMap & WebScene](./docs/guides/webmap-webscene.md) - Portal content loading

#### Hooks
- [Widget Hooks](./docs/guides/widget-hooks.md) - Widget integration
- [Analysis Hooks](./docs/guides/analysis-hooks.md) - Query and analysis
- [Portal Hooks](./docs/guides/portal-integration.md) - Portal integration
- [Theme Hooks](./docs/guides/theming.md) - Theme management

#### Features
- [Authentication](./docs/guides/authentication.md) - OAuth and Portal auth
- [Portal Integration](./docs/guides/portal-integration.md) - ArcGIS Online/Enterprise
- [Theming](./docs/guides/theming.md) - Light/dark modes
- [Best Practices](./docs/guides/best-practices.md) - Recommended patterns

## What's Included

### Components (46)

**Core (5)**
- Map, MapView, SceneView, WebMap, WebScene

**Widgets (18)**
- Navigation: Zoom, Home, Compass, Locate, Track, Fullscreen
- Information: LayerList, Legend, ScaleBar, Search
- Basemap: BasemapGallery, BasemapToggle
- Editing: Editor, Sketch
- Analysis: FeatureTable, TimeSlider, Measurement, HistogramRangeSlider, ElevationProfile
- Advanced: Print, Directions, CoordinateConversion, Swipe
- Utility: Expand

**Layers (23)**
- Vector: FeatureLayer, GraphicsLayer, GeoJSONLayer, CSVLayer, StreamLayer
- Tile: TileLayer, VectorTileLayer, WebTileLayer, ImageryTileLayer
- Dynamic: MapImageLayer, ImageryLayer
- 3D: SceneLayer, BuildingSceneLayer, IntegratedMeshLayer, PointCloudLayer, ElevationLayer
- OGC: WMSLayer, WMTSLayer, WFSLayer, OGCFeatureLayer, KMLLayer
- Organization: GroupLayer, SubtypeGroupLayer

### Hooks (36+)

**Widget Hooks (10)**
- useSearch, useLayerList, useLegend, useBasemapGallery, useBasemapToggle, useScaleBar, useSketchViewModel, usePopup, and more

**Analysis Hooks (10)**
- useQuery, useQueryFeatures, useStatistics, useSpatialQuery, useIdentify, useBufferAnalysis, useGeometryMeasurement, useRouteAnalysis, useClosestFacility, useGeocoding

**Portal Hooks (9)**
- usePortal, useOAuthInfo, usePortalItem, usePortalSearch, usePortalGroup, usePortalUser, usePortalContent, useWebMap, useWebScene

**Theme Hooks (5)**
- useTheme, useSystemTheme, useCalciteMode, useArcGISTheme, getSystemTheme

**Utility Hooks (7+)**
- useView, useGraphic, useWatchUtils, useWatchWhen, useEsriModule, usePropertyUpdater, useEventHandlers

## Examples

### Portal Integration

```tsx
import { usePortal, usePortalSearch, useOAuthInfo } from 'react-arcgis';

function PortalApp() {
  const { credential, signIn, signOut } = useOAuthInfo({
    appId: 'YOUR_APP_ID'
  });
  
  const { portal, user } = usePortal();
  const { search, results } = usePortalSearch(portal);
  
  const searchMaps = async () => {
    await search({
      query: 'type:"Web Map" AND access:public',
      sortField: 'numViews',
      sortOrder: 'desc'
    });
  };
  
  return (
    <div>
      {credential ? (
        <>
          <p>Welcome, {user?.username}</p>
          <button onClick={searchMaps}>Search Maps</button>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}
```

### GIS Analysis

```tsx
import { useQueryFeatures, useBufferAnalysis } from 'react-arcgis';

function Analysis() {
  const { query } = useQueryFeatures(featureLayer);
  const { buffer } = useBufferAnalysis();
  
  const analyze = async (point) => {
    // Create 10-mile buffer
    const buffered = await buffer(point, {
      distance: 10,
      unit: 'miles',
      geodesic: true
    });
    
    // Find features within buffer
    const features = await query({
      geometry: buffered,
      where: "TYPE = 'City'",
      outFields: ['*']
    });
    
    console.log(`Found ${features.length} cities`);
  };
  
  return <button onClick={() => analyze(clickPoint)}>Analyze</button>;
}
```

### Theme Management

```tsx
import { useTheme } from 'react-arcgis';

function App() {
  const [theme, setTheme] = useState('auto');
  useTheme(theme); // 'light', 'dark', or 'auto'
  
  return (
    <div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('auto')}>Auto</button>
      
      <Map basemap="gray-vector">
        <MapView center={[-98, 40]} zoom={4} />
      </Map>
    </div>
  );
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript

Full TypeScript support included. Import types as needed:

```tsx
import type { 
  MapProps, 
  MapViewProps, 
  FeatureLayerProps,
  UsePortalOptions,
  QueryFeaturesOptions
} from 'react-arcgis';
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © Darren Mason

## Resources

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- [Calcite Design System](https://developers.arcgis.com/calcite-design-system/)
- [ArcGIS Developer](https://developers.arcgis.com/)

## Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Issue Tracker](https://github.com/your-repo/react-arcgis/issues)
- 💬 [Discussions](https://github.com/your-repo/react-arcgis/discussions)
- 📧 [Email Support](mailto:support@example.com)

---

**Built with ❤️ for the ArcGIS developer community**
