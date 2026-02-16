# Project Structure

```
react-arcgis/
├── src/                          # Source code for the library
│   ├── components/              # React components
│   │   ├── Map.tsx             # Map component (creates ArcGIS Map)
│   │   ├── MapView.tsx         # 2D map view component
│   │   ├── SceneView.tsx       # 3D scene view component
│   │   └── layers/             # Layer components
│   │       ├── FeatureLayer.tsx   # Feature layer wrapper
│   │       ├── GraphicsLayer.tsx  # Graphics layer wrapper
│   │       ├── GeoJSONLayer.tsx   # GeoJSON layer wrapper
│   │       └── index.ts           # Layer exports
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGraphic.ts       # Hook for creating graphics
│   │   ├── useSearch.ts        # Hook for search widget
│   │   ├── useBasemapGallery.ts # Hook for basemap gallery
│   │   ├── useSketchViewModel.ts # Hook for drawing/editing
│   │   └── index.ts            # Hook exports
│   ├── context/                 # React context
│   │   └── ViewContext.tsx     # Context for sharing view/map
│   ├── types.ts                # TypeScript type definitions
│   └── index.ts                # Main library export
│
├── example/                     # Example application
│   ├── src/
│   │   ├── App.tsx             # Basic example
│   │   ├── AdvancedExample.tsx # Advanced features demo
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Styles
│   ├── index.html              # HTML template
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   └── package.json            # Example dependencies
│
├── dist/                        # Built library (generated)
│   ├── index.js                # CommonJS build
│   ├── index.esm.js            # ES Module build
│   └── index.d.ts              # TypeScript definitions
│
├── package.json                # Package configuration
├── tsconfig.json               # TypeScript configuration
├── rollup.config.js            # Build configuration
├── README.md                   # Main documentation
├── GETTING_STARTED.md          # Quick start guide
├── CHANGELOG.md                # Version history
├── LICENSE                     # MIT license
├── .gitignore                  # Git ignore rules
└── .npmignore                  # NPM ignore rules
```

## Key Files

### Core Components

- **Map.tsx**: Creates and manages ArcGIS Map instance with React lifecycle
- **MapView.tsx**: 2D view with props for center, zoom, rotation, etc.
- **SceneView.tsx**: 3D view with camera controls
- **Layer Components**: Wrap ArcGIS layers with automatic add/remove

### Hooks

- **useView**: Access view and map from any child component
- **useSearch**: Add search widget with configuration
- **useBasemapGallery**: Add basemap selector
- **useSketchViewModel**: Enable drawing and editing graphics
- **useGraphic**: Create graphics programmatically

### Context

- **ViewContext**: Provides view and map to all child components via React Context API

### Build Output

The library builds to both CommonJS and ES Module formats:
- `dist/index.js` - CommonJS for Node.js
- `dist/index.esm.js` - ES Modules for modern bundlers
- `dist/index.d.ts` - TypeScript definitions

## Component Architecture

```
Map (creates ArcGIS Map)
  └── MapView/SceneView (creates View)
        └── ViewContext.Provider (shares view/map)
              ├── Layer Components (add layers to map)
              └── Custom Components (can use useView hook)
```

## Data Flow

1. **Map Component**: Creates ArcGIS Map instance
2. **View Component**: Creates MapView/SceneView with the map
3. **Context Provider**: Makes view/map available to children
4. **Layer Components**: Use context to access map and add themselves
5. **Custom Components**: Use `useView()` hook to access view/map

## Props Flow Example

```tsx
<Map basemap="streets">           {/* Props → Map instance */}
  <MapView center={[...]} zoom={10}>  {/* Props → View instance */}
    <FeatureLayer url="..." />    {/* Props → Layer instance */}
  </MapView>
</Map>
```

## Lifecycle Management

Each component:
1. **Mount**: Creates ArcGIS instance asynchronously
2. **Update**: Watches props and updates ArcGIS instance
3. **Unmount**: Properly destroys ArcGIS instance and removes event listeners

## TypeScript Support

All components are fully typed with:
- Prop interfaces (MapViewProps, FeatureLayerProps, etc.)
- ArcGIS SDK types from `@arcgis/core`
- Generic view types (MapView | SceneView)
- Type-safe hooks with proper return types
