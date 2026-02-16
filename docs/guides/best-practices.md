# Best Practices

Recommended patterns and best practices for React ArcGIS applications.

## Component Organization

### 1. Separate Map Logic from UI

```tsx
// ✅ Good
function MapContainer() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118, 34]} zoom={12}>
        <MapContent />
      </MapView>
    </Map>
  );
}

function MapContent() {
  const { view } = useView();
  // Map-specific logic here
  return (
    <>
      <FeatureLayer url="..." />
      <Zoom position="top-left" />
    </>
  );
}

// ❌ Avoid mixing concerns
function App() {
  return (
    <div>
      <Header />
      <Map>
        <MapView>
          <UserProfile /> {/* UI component mixed with map */}
        </MapView>
      </Map>
    </div>
  );
}
```

### 2. Use Context for Shared State

```tsx
// ✅ Good - Use context for map state
function MyMap() {
  return (
    <MapView onViewReady={setView}>
      <FeatureLayer url="..." onLoad={setLayer} />
      <QueryPanel /> {/* Access view/layer from context */}
      <ResultsPanel />
    </MapView>
  );
}

function QueryPanel() {
  const { view } = useView();
  // Use view from context
}
```

## Performance

### 1. Limit Layer Count

```tsx
// ✅ Good - Use GroupLayer for organization
<GroupLayer title="Demographics">
  <FeatureLayer url=".../Population" />
  <FeatureLayer url=".../Income" />
</GroupLayer>

// ❌ Avoid too many top-level layers
<MapView>
  <FeatureLayer url="..." />
  <FeatureLayer url="..." />
  {/* ...20 more layers... */}
</MapView>
```

### 2. Use Clustering for Large Datasets

```tsx
<FeatureLayer
  url="..."
  featureReduction={{
    type: 'cluster',
    clusterRadius: 50
  }}
/>
```

### 3. Optimize Queries

```tsx
// ✅ Good - Request only needed fields
const { query } = useQueryFeatures(layer);
await query({
  where: "STATE = 'CA'",
  outFields: ['NAME', 'POP'],  // Only needed fields
  returnGeometry: false         // If geometry not needed
});

// ❌ Avoid requesting everything
await query({
  where: "1=1",
  outFields: ['*'],
  returnGeometry: true
});
```

## State Management

### 1. Wait for View to Be Ready

```tsx
// ✅ Good
function MyComponent() {
  const [view, setView] = useState(null);
  
  useEffect(() => {
    if (view) {
      // Interact with view
      view.goTo({ center: [-118, 34] });
    }
  }, [view]);
  
  return (
    <MapView onViewReady={setView}>
      {view && <LayerList />}
    </MapView>
  );
}

// ❌ Avoid accessing view before ready
function BadComponent() {
  const { view } = useView();
  view.goTo(...); // May be null!
}
```

### 2. Handle Loading States

```tsx
// ✅ Good
function DataLoader() {
  const { query, loading, error } = useQueryFeatures(layer);
  
  if (loading) return <CalciteLoader />;
  if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
  
  return <ResultsList />;
}
```

### 3. Clean Up Resources

```tsx
// ✅ Good - Cleanup is automatic
<MapView>
  <FeatureLayer url="..." />
</MapView>

// Manual cleanup if needed
useEffect(() => {
  const handle = view.on('click', handler);
  return () => handle.remove();
}, [view]);
```

## Error Handling

### 1. Handle API Errors

```tsx
// ✅ Good
const { search, error } = usePortalSearch(portal);

try {
  await search({ query: '...' });
} catch (err) {
  console.error('Search failed:', err);
  showErrorNotification(err.message);
}

{error && (
  <CalciteNotice kind="danger" open>
    <div slot="message">{error.message}</div>
  </CalciteNotice>
)}
```

### 2. Provide Fallbacks

```tsx
// ✅ Good
function MapComponent() {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div>
        <h2>Failed to load map</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  return <Map onError={setError}>...</Map>;
}
```

## TypeScript

### 1. Use Proper Types

```tsx
// ✅ Good
import type { MapViewProps, FeatureLayerProps } from 'react-arcgis';

interface MyMapProps {
  center: [number, number];
  layers: FeatureLayerProps[];
}

function MyMap({ center, layers }: MyMapProps) {
  return (
    <MapView center={center}>
      {layers.map((layer, i) => (
        <FeatureLayer key={i} {...layer} />
      ))}
    </MapView>
  );
}
```

### 2. Type Hook Results

```tsx
// ✅ Good
const { view } = useView();
// view is automatically typed as MapView | SceneView | null

const { query, results } = useQueryFeatures(layer);
// results is automatically typed as __esri.Graphic[] | null
```

## Authentication

### 1. Check Sign-In Status on Mount

```tsx
// ✅ Good
function App() {
  const { credential, checkSignInStatus, signIn } = useOAuthInfo({
    appId: 'YOUR_APP_ID'
  });
  
  useEffect(() => {
    checkSignInStatus();
  }, []);
  
  if (!credential) {
    return <button onClick={signIn}>Sign In</button>;
  }
  
  return <AuthenticatedApp />;
}
```

### 2. Handle Session Expiration

```tsx
// ✅ Good
useEffect(() => {
  if (credential && credential.expires < Date.now()) {
    signOut();
    showNotification('Session expired. Please sign in again.');
  }
}, [credential]);
```

## Portal Integration

### 1. Reuse Portal Instance

```tsx
// ✅ Good
function App() {
  const { portal } = usePortal();
  
  return (
    <div>
      <PortalSearch portal={portal} />
      <UserContent portal={portal} />
      <GroupBrowser portal={portal} />
    </div>
  );
}

// ❌ Avoid multiple portal instances
function Bad() {
  const portal1 = usePortal();
  const portal2 = usePortal(); // Unnecessary
}
```

### 2. Cache Search Results

```tsx
// ✅ Good
function SearchComponent() {
  const { search, results } = usePortalSearch(portal);
  const [cache, setCache] = useState({});
  
  const performSearch = async (query) => {
    if (cache[query]) {
      return cache[query];
    }
    
    const result = await search({ query });
    setCache({ ...cache, [query]: result });
    return result;
  };
}
```

## Theming

### 1. Set Theme at App Level

```tsx
// ✅ Good
function App() {
  useTheme('auto'); // Set once at app level
  
  return <MapContainer />;
}

// ❌ Avoid setting theme in multiple components
function BadMap() {
  useTheme('light'); // Don't set here
  return <Map>...</Map>;
}
```

### 2. Persist Theme Preference

```tsx
// ✅ Good
function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'auto'
  );
  
  useTheme(theme);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return <ThemeSelector value={theme} onChange={setTheme} />;
}
```

## Accessibility

### 1. Provide Alt Text

```tsx
// ✅ Good
<CalciteButton icon-start="search" aria-label="Search maps">
  Search
</CalciteButton>

<MapView aria-label="Interactive map showing population data">
  ...
</MapView>
```

### 2. Keyboard Navigation

```tsx
// ✅ Good - Ensure keyboard access
<MapView
  onKeyDown={(event) => {
    if (event.key === 'Enter') {
      handleSelection();
    }
  }}
/>
```

## Testing

### 1. Mock ArcGIS Modules

```tsx
// test-utils.ts
jest.mock('@arcgis/core/Map', () => ({
  default: jest.fn(() => ({
    layers: [],
    add: jest.fn()
  }))
}));
```

### 2. Test Hook Behavior

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useQueryFeatures } from 'react-arcgis';

test('useQueryFeatures returns results', async () => {
  const { result } = renderHook(() => useQueryFeatures(mockLayer));
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.results).toHaveLength(10);
});
```

## Code Organization

### Project Structure

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx
│   │   ├── MapControls.tsx
│   │   └── MapLayers.tsx
│   ├── Panels/
│   │   ├── SearchPanel.tsx
│   │   ├── ResultsPanel.tsx
│   │   └── DetailsPanel.tsx
│   └── shared/
│       ├── ErrorBoundary.tsx
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useMapData.ts
│   ├── useAnalysis.ts
│   └── usePortalIntegration.ts
├── utils/
│   ├── geometry.ts
│   ├── formatting.ts
│   └── constants.ts
└── types/
    └── index.ts
```

## Common Patterns

### 1. Conditional Rendering

```tsx
// ✅ Good
{view && layer && (
  <QueryPanel view={view} layer={layer} />
)}

// ❌ Avoid optional chaining in JSX
{view?.ready && <Panel />} // Unclear when ready
```

### 2. Event Handlers

```tsx
// ✅ Good - Use callbacks
const handleMapClick = useCallback((event) => {
  console.log('Clicked:', event.mapPoint);
}, []);

<MapView onClick={handleMapClick} />

// ❌ Avoid inline functions
<MapView onClick={(e) => console.log(e)} />
```

### 3. Custom Hooks

```tsx
// ✅ Good - Extract reusable logic
function useMapAnalysis(layer) {
  const { query } = useQueryFeatures(layer);
  const { buffer } = useBufferAnalysis();
  
  const analyzeArea = useCallback(async (point) => {
    const buffered = await buffer(point, { distance: 10, unit: 'miles' });
    const features = await query({ geometry: buffered });
    return { buffer: buffered, features };
  }, [buffer, query]);
  
  return { analyzeArea };
}
```

## Summary

✅ **Do:**
- Wait for view/layer to be ready
- Handle loading and error states
- Use context for shared state
- Clean up resources
- Optimize queries
- Use TypeScript
- Test your code

❌ **Don't:**
- Mix UI and map logic
- Access undefined objects
- Ignore errors
- Request unnecessary data
- Create multiple portal instances
- Set theme in multiple places
- Block the UI thread

## Related

- [Troubleshooting](./troubleshooting.md) - Common issues
- [FAQ](./faq.md) - Frequently asked questions
- [API Reference](../api/) - Complete API documentation
