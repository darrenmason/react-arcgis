# Troubleshooting

Common issues and solutions for React ArcGIS.

## Installation Issues

### Module not found: '@arcgis/core'

**Problem:** Missing ArcGIS Maps SDK dependency.

**Solution:**
```bash
npm install @arcgis/core
```

### Module not found: '@esri/calcite-components-react'

**Problem:** Missing Calcite Components dependency.

**Solution:**
```bash
npm install @esri/calcite-components-react
```

### TypeScript errors with ArcGIS types

**Problem:** Missing type definitions.

**Solution:** Types are included with `@arcgis/core`. Ensure it's installed:
```bash
npm install @arcgis/core
```

## Map Display Issues

### Map container has no height

**Problem:** Map doesn't display or has zero height.

**Solution:** Set explicit height on container:
```tsx
<div style={{ height: '100vh', width: '100%' }}>
  <Map><MapView /></Map>
</div>
```

Or with CSS:
```css
.map-container {
  height: 100vh;
  width: 100%;
}
```

### Map styles not loading

**Problem:** Map displays but has no basemap styling.

**Solution:** Include ArcGIS CSS in your `index.html`:
```html
<link rel="stylesheet" href="https://js.arcgis.com/4.29/@arcgis/core/assets/esri/themes/light/main.css">
```

### Basemap not showing

**Problem:** Map loads but basemap is blank.

**Possible causes:**
1. **Invalid basemap name:**
   ```tsx
   // ❌ Wrong
   <Map basemap="topographic" />
   
   // ✅ Correct
   <Map basemap="topo-vector" />
   ```

2. **Network connectivity issues** - Check browser console for errors

3. **CORS issues** - Ensure your development server is properly configured

## Component Issues

### View is null when accessed

**Problem:** `useView()` returns null.

**Solution:** Wait for view to be ready:
```tsx
const [view, setView] = useState(null);

<MapView onViewReady={setView}>
  {view && <MyComponent />}
</MapView>
```

Or check for null:
```tsx
const { view } = useView();

useEffect(() => {
  if (view) {
    // Safe to use view
  }
}, [view]);
```

### Widgets not appearing

**Problem:** Widget components render but don't appear on map.

**Possible solutions:**

1. **View not ready:**
   ```tsx
   <MapView onViewReady={setView}>
     {view && <Zoom position="top-left" />}
   </MapView>
   ```

2. **Invalid position:**
   ```tsx
   // ✅ Valid positions
   position="top-left"
   position="top-right"
   position="bottom-left"
   position="bottom-right"
   
   // ❌ Invalid
   position="center"
   ```

3. **UI components removed:**
   ```tsx
   <MapView ui={{ components: [] }}> {/* Removes all UI */}
     <Zoom /> {/* Won't show */}
   </MapView>
   ```

### Layers not displaying

**Problem:** Layer component renders but no data shows.

**Checklist:**
1. **Valid URL** - Check service is accessible
2. **Visibility** - Ensure `visible={true}` (default)
3. **Scale dependency** - Some layers only show at certain scales
4. **Spatial reference** - Ensure layer SR matches map SR
5. **Network errors** - Check browser console

```tsx
<FeatureLayer
  url="https://..."
  visible={true}
  onLoad={(layer) => {
    console.log('Layer loaded', layer);
    console.log('Extent:', layer.fullExtent);
  }}
  onError={(error) => console.error('Layer error:', error)}
/>
```

## Hook Issues

### Hook returns undefined

**Problem:** Hook returns `undefined` instead of expected value.

**Solution:** Most hooks return objects with named properties:
```tsx
// ❌ Wrong
const query = useQueryFeatures(layer);

// ✅ Correct
const { query, loading, results } = useQueryFeatures(layer);
```

### Infinite render loop

**Problem:** Component re-renders continuously.

**Possible causes:**

1. **Creating new objects in render:**
   ```tsx
   // ❌ Wrong - creates new array every render
   <MapView center={[-118, 34]} />
   
   // ✅ Correct - use state or memo
   const center = useMemo(() => [-118, 34], []);
   <MapView center={center} />
   ```

2. **Missing dependency array:**
   ```tsx
   // ❌ Wrong
   useEffect(() => {
     query({ where: '1=1' });
   }); // Runs every render!
   
   // ✅ Correct
   useEffect(() => {
     query({ where: '1=1' });
   }, [query]); // Only when query changes
   ```

### Memory leaks

**Problem:** Memory usage increases over time.

**Solution:** Ensure cleanup in useEffect:
```tsx
useEffect(() => {
  if (!view) return;
  
  const handle = view.on('click', handler);
  
  return () => {
    handle.remove(); // Cleanup
  };
}, [view]);
```

## Portal Issues

### OAuth redirect not working

**Problem:** Sign-in redirects but doesn't complete.

**Solution:**

1. **Register redirect URL** at [developers.arcgis.com](https://developers.arcgis.com):
   ```
   Redirect URLs: http://localhost:3000
   ```

2. **Use correct app ID:**
   ```tsx
   useOAuthInfo({
     appId: 'YOUR_ACTUAL_APP_ID' // Not 'YOUR_APP_ID'
   })
   ```

3. **Check popup blockers** - Disable or use redirect mode

### Portal search returns no results

**Problem:** `usePortalSearch` returns empty results.

**Possible causes:**

1. **Invalid query syntax:**
   ```tsx
   // ❌ Wrong
   query: "Web Map"
   
   // ✅ Correct
   query: 'type:"Web Map"'
   ```

2. **Not signed in** - Some content requires authentication

3. **Empty portal** - User has no content

### Portal items fail to load

**Problem:** `usePortalItem` returns error.

**Checklist:**
1. **Valid item ID** - Check ID is correct
2. **Item exists** - Item may have been deleted
3. **Access permissions** - User may not have access
4. **Network issues** - Check connectivity

```tsx
const { item, loading, error } = usePortalItem({ id: '...' });

if (error) {
  console.error('Failed to load item:', error);
  // Handle error appropriately
}
```

## Analysis Issues

### Query returns no features

**Problem:** `useQueryFeatures` returns empty array.

**Possible causes:**

1. **Invalid WHERE clause:**
   ```tsx
   // ❌ Wrong - SQL syntax error
   where: "POP = 1000000"
   
   // ✅ Correct
   where: "POP = '1000000'" // or
   where: "POP > 1000000"
   ```

2. **Geometry not intersecting:**
   ```tsx
   // Check geometry is in correct spatial reference
   geometry: point,
   spatialRelationship: 'intersects'
   ```

3. **Layer not loaded:**
   ```tsx
   const [layer, setLayer] = useState(null);
   const { query } = useQueryFeatures(layer);
   
   <FeatureLayer url="..." onLoad={setLayer} />
   ```

### Statistics return unexpected results

**Problem:** `useStatistics` returns incorrect values.

**Checklist:**
1. **Correct field names** - Check field exists
2. **Correct statistic type** - Use right type for data
3. **WHERE clause** - May be filtering data unexpectedly

```tsx
const stats = await calculateStatistics({
  where: "1=1", // Remove filters to test
  statisticDefinitions: [{
    statisticType: 'sum',
    onStatisticField: 'POP', // Verify field name
    outStatisticFieldName: 'total'
  }]
});
```

### Buffer analysis fails

**Problem:** `useBufferAnalysis` throws error.

**Possible causes:**

1. **Invalid geometry:**
   ```tsx
   // Ensure geometry has spatial reference
   const point = {
     type: 'point',
     longitude: -118,
     latitude: 34,
     spatialReference: { wkid: 4326 }
   };
   ```

2. **Invalid distance or units:**
   ```tsx
   await buffer(point, {
     distance: 10,
     unit: 'miles' // Valid units: miles, kilometers, meters, etc.
   });
   ```

## Theme Issues

### Theme not applying

**Problem:** `useTheme()` doesn't change appearance.

**Solution:**

1. **Include Calcite CSS:**
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/calcite.css">
   ```

2. **Call at app root:**
   ```tsx
   function App() {
     useTheme('dark'); // Call at top level
     return <MapContainer />;
   }
   ```

3. **Check for conflicting styles** - Custom CSS may override theme

### Auto theme not detecting system

**Problem:** `useTheme('auto')` doesn't follow system theme.

**Solution:** Ensure browser supports `prefers-color-scheme`:
```tsx
// Test if supported
const { theme } = useSystemTheme();
console.log('Detected theme:', theme);
```

## Performance Issues

### Slow map rendering

**Problem:** Map is sluggish or unresponsive.

**Solutions:**

1. **Reduce layer count:**
   ```tsx
   // Use GroupLayer to organize
   <GroupLayer>
     <FeatureLayer url="..." />
     <FeatureLayer url="..." />
   </GroupLayer>
   ```

2. **Enable clustering:**
   ```tsx
   <FeatureLayer
     featureReduction={{ type: 'cluster', clusterRadius: 50 }}
   />
   ```

3. **Optimize queries:**
   ```tsx
   await query({
     where: "STATE = 'CA'",
     outFields: ['NAME', 'POP'], // Only needed fields
     returnGeometry: false, // If geometry not needed
     maxRecordCount: 100 // Limit results
   });
   ```

4. **Use simpler basemap:**
   ```tsx
   <Map basemap="gray-vector" /> // Lighter than satellite
   ```

### Memory usage increasing

**Problem:** Memory grows over time.

**Checklist:**
1. **Remove event listeners** in cleanup
2. **Destroy widgets** when unmounting
3. **Clear graphics** when no longer needed:
   ```tsx
   useEffect(() => {
     return () => {
       graphicsLayer.removeAll();
     };
   }, []);
   ```

## Build Issues

### Build fails with ArcGIS modules

**Problem:** Production build fails with import errors.

**Solution:** React ArcGIS uses dynamic imports - ensure your bundler supports them. For Vite, no configuration needed. For Webpack, ensure code splitting is enabled.

### Bundle size too large

**Problem:** Production bundle is very large.

**Solutions:**
1. **Tree shaking** - Import only what you need:
   ```tsx
   // ✅ Good
   import { Map, MapView } from 'react-arcgis';
   
   // ❌ Avoid
   import * as ReactArcGIS from 'react-arcgis';
   ```

2. **Code splitting** - Lazy load heavy components:
   ```tsx
   const AnalysisPanel = lazy(() => import('./AnalysisPanel'));
   ```

## Getting Help

If you're still experiencing issues:

1. **Check browser console** for error messages
2. **Enable debug logging:**
   ```tsx
   <MapView
     onError={(error) => console.error('View error:', error)}
     onLoad={(view) => console.log('View loaded:', view)}
   />
   ```

3. **Create minimal reproduction**
4. **Check GitHub issues** for similar problems
5. **Open a new issue** with:
   - React ArcGIS version
   - ArcGIS Maps SDK version
   - Browser and version
   - Minimal code example
   - Error messages

## Related

- [FAQ](./faq.md) - Frequently asked questions
- [Best Practices](./best-practices.md) - Recommended patterns
- [API Reference](../api/) - Complete API documentation
