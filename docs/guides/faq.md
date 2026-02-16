# Frequently Asked Questions

Common questions about React ArcGIS.

## General

### What is React ArcGIS?

React ArcGIS is a library that provides React components and hooks for building applications with the ArcGIS Maps SDK for JavaScript. It offers a declarative, React-first API for creating interactive maps and GIS applications.

### Do I need an ArcGIS account?

- **For basic maps:** No, you can use public basemaps and services without an account.
- **For Portal content:** Yes, you need an ArcGIS Online or Enterprise account.
- **For OAuth authentication:** Yes, you need to register an application at [developers.arcgis.com](https://developers.arcgis.com).

### Which ArcGIS Maps SDK version is supported?

React ArcGIS is designed to work with ArcGIS Maps SDK 4.x (currently 4.29+). It uses dynamic imports to load SDK modules, so you can use any compatible version.

## Installation & Setup

### How do I install React ArcGIS?

```bash
npm install react-arcgis @arcgis/core @esri/calcite-components-react
```

### Do I need to include CSS?

Yes, add to your `index.html`:

```html
<link rel="stylesheet" href="https://js.arcgis.com/4.29/@arcgis/core/assets/esri/themes/light/main.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/calcite.css">
```

### Can I use it with Vite?

Yes! React ArcGIS works great with Vite. No special configuration needed.

### Can I use it with Next.js?

Yes, but you may need to configure Next.js for client-side rendering of map components:

```tsx
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false
});
```

## Components

### Why isn't my map showing?

Check these common issues:

1. **Missing CSS:**
   ```html
   <link rel="stylesheet" href="https://js.arcgis.com/.../main.css">
   ```

2. **No height:**
   ```tsx
   <div style={{ height: '100vh' }}>
     <Map><MapView /></Map>
   </div>
   ```

3. **View not ready:**
   ```tsx
   const [view, setView] = useState(null);
   <MapView onViewReady={setView}>
     {view && <Layers />}
   </MapView>
   ```

### How do I access the view instance?

Use the `useView` hook:

```tsx
const { view, map } = useView();
```

Or use the callback:

```tsx
<MapView onViewReady={(view) => console.log(view)} />
```

### Can I use multiple maps?

Yes, use separate `ViewProvider` components:

```tsx
<ViewProvider>
  <Map><MapView /></Map>
</ViewProvider>
<ViewProvider>
  <Map><MapView /></Map>
</ViewProvider>
```

### How do I switch between 2D and 3D?

```tsx
const [is3D, setIs3D] = useState(false);

<Map ground={is3D ? 'world-elevation' : undefined}>
  {is3D ? <SceneView /> : <MapView />}
</Map>
```

## Hooks

### When should I use hooks vs components?

- **Components:** For declarative UI (widgets, layers)
- **Hooks:** For programmatic access (queries, analysis)

Example:
```tsx
// Component - declarative
<Search position="top-right" />

// Hook - programmatic
const { search } = useSearch();
await search.search('coffee');
```

### Do hooks work outside MapView?

Most hooks require a view instance. Pass it explicitly or use inside `MapView`:

```tsx
// Inside MapView (uses context)
<MapView>
  <MyComponent /> {/* useView() works here */}
</MapView>

// Outside MapView (pass view)
const { query } = useQueryFeatures(layer, view);
```

### Why is my hook returning null?

Hooks that load data asynchronously return `null` until loaded:

```tsx
const { item, loading } = usePortalItem({ id: '...' });

if (loading) return <Loader />;
if (!item) return <div>No item</div>;

return <div>{item.title}</div>;
```

## Portal Integration

### How do I authenticate users?

Use `useOAuthInfo`:

```tsx
const { credential, signIn, signOut } = useOAuthInfo({
  appId: 'YOUR_APP_ID'
});

{credential ? (
  <button onClick={signOut}>Sign Out</button>
) : (
  <button onClick={signIn}>Sign In</button>
)}
```

### How do I search for portal items?

```tsx
const { search, results } = usePortalSearch(portal);

await search({
  query: 'type:"Web Map"',
  num: 20
});
```

### Can I create/update portal items?

Yes, use `usePortalContent`:

```tsx
const { addItem, updateItem } = usePortalContent(portal);

const item = await addItem({
  type: 'Web Map',
  title: 'My Map',
  data: { ... }
});

await updateItem(item.id, { title: 'Updated Title' });
```

## Analysis

### How do I query features?

```tsx
const { query } = useQueryFeatures(layer);

const features = await query({
  where: "POP > 1000000",
  outFields: ['*']
});
```

### How do I create a buffer?

```tsx
const { buffer } = useBufferAnalysis();

const buffered = await buffer(point, {
  distance: 10,
  unit: 'miles',
  geodesic: true
});
```

### How do I calculate statistics?

```tsx
const { calculateStatistics } = useStatistics(layer);

const stats = await calculateStatistics({
  statisticDefinitions: [
    { statisticType: 'sum', onStatisticField: 'POP', outStatisticFieldName: 'total' }
  ]
});
```

## Theming

### How do I enable dark mode?

```tsx
useTheme('dark'); // 'light', 'dark', or 'auto'
```

### How do I follow system theme?

```tsx
useTheme('auto');
```

### Can I customize colors?

Yes, using CSS variables:

```css
:root {
  --calcite-color-brand: #0079c1;
  --calcite-color-brand-hover: #005a87;
}
```

## Performance

### My map is slow with many layers. What can I do?

1. **Use GroupLayer** to organize layers
2. **Enable clustering** for large datasets
3. **Optimize queries** (request only needed fields)
4. **Use FeatureReduction**:
   ```tsx
   <FeatureLayer
     featureReduction={{ type: 'cluster' }}
   />
   ```

### How do I optimize for mobile?

1. **Reduce layer count**
2. **Use lower quality basemaps**
3. **Disable expensive features:**
   ```tsx
   <SceneView
     qualityProfile="low"
     environment={{ atmosphereEnabled: false }}
   />
   ```

## TypeScript

### Do I need TypeScript?

No, React ArcGIS works with JavaScript too. But TypeScript provides better autocomplete and type checking.

### How do I import types?

```tsx
import type { MapViewProps, UsePortalOptions } from 'react-arcgis';
```

### What are the ArcGIS types?

ArcGIS types are prefixed with `__esri`:

```tsx
const view: __esri.MapView = ...;
const layer: __esri.FeatureLayer = ...;
```

## Troubleshooting

### I get "Module not found" errors

Make sure you installed all dependencies:

```bash
npm install react-arcgis @arcgis/core @esri/calcite-components-react
```

### The map doesn't fit the container

Set explicit height:

```css
.map-container {
  height: 100vh;
  width: 100%;
}
```

### Widgets aren't showing

Check:
1. Widget position is valid
2. View is ready
3. Widget hasn't been removed by `ui.components`

### OAuth redirect not working

Ensure redirect URL is registered in your app at developers.arcgis.com:

```
Redirect URLs: http://localhost:3000
```

## Contributing

### Can I contribute?

Yes! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### How do I report bugs?

Create an issue on GitHub with:
- React ArcGIS version
- ArcGIS Maps SDK version
- Browser and version
- Minimal reproduction code

### How do I request features?

Open a GitHub issue with:
- Clear description
- Use case
- Example code (if applicable)

## Related

- [Getting Started](./getting-started.md)
- [Troubleshooting](./troubleshooting.md)
- [Best Practices](./best-practices.md)
- [API Reference](../api/)
