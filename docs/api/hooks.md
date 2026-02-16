# Hooks API Reference

Complete API reference for all React ArcGIS hooks.

## Core Hooks

### useView

Access the current view instance from context.

```tsx
import { useView } from 'react-arcgis';

const { view, map } = useView();
```

**Returns:**
- `view`: `__esri.MapView | __esri.SceneView | null`
- `map`: `__esri.Map | null`

**Example:**
```tsx
function MyComponent() {
  const { view, map } = useView();
  
  useEffect(() => {
    if (view) {
      view.goTo({ center: [-118, 34], zoom: 12 });
    }
  }, [view]);
  
  return null;
}
```

---

## Widget Hooks

### useSearch

```tsx
const { widget, loading, error } = useSearch({
  view,
  sources,
  includeDefaultSources
});
```

**Options:**
- `view`: View instance (optional if in context)
- `sources`: Search sources array
- `includeDefaultSources`: Include default sources (default: `true`)

---

### useLayerList

```tsx
const { widget, loading, error } = useLayerList({
  view,
  listItemCreatedFunction,
  selectionEnabled
});
```

---

### useLegend

```tsx
const { widget, loading, error } = useLegend({
  view,
  layerInfos,
  style
});
```

For complete widget hooks, see [Widget Hooks Guide](../guides/widget-hooks.md).

---

## Analysis Hooks

### useQueryFeatures

Advanced feature queries with spatial and attribute filters.

```tsx
import { useQueryFeatures } from 'react-arcgis';

const { query, queryExtent, queryCount, loading, error, results } = 
  useQueryFeatures(featureLayer);
```

**Returns:**
- `query`: `(options: QueryFeaturesOptions) => Promise<__esri.Graphic[]>`
- `queryExtent`: `(options) => Promise<__esri.Extent>`
- `queryCount`: `(options) => Promise<number>`
- `loading`: `boolean`
- `error`: `Error | null`
- `results`: `__esri.Graphic[] | null`

**QueryFeaturesOptions:**
```tsx
interface QueryFeaturesOptions {
  where?: string;
  geometry?: __esri.Geometry;
  spatialRelationship?: 'intersects' | 'contains' | 'within' | ...;
  distance?: number;
  units?: __esri.LinearUnits;
  outFields?: string[];
  returnGeometry?: boolean;
  maxRecordCount?: number;
  orderByFields?: string[];
}
```

**Example:**
```tsx
const { query, loading, results } = useQueryFeatures(layer);

const handleQuery = async () => {
  const features = await query({
    where: "POP > 1000000",
    geometry: point,
    spatialRelationship: 'intersects',
    distance: 50,
    units: 'miles',
    outFields: ['*']
  });
};
```

---

### useStatistics

Calculate statistics on feature attributes.

```tsx
const { calculateStatistics, loading, error, results } = useStatistics(layer);
```

**StatisticsOptions:**
```tsx
interface StatisticsOptions {
  where?: string;
  geometry?: __esri.Geometry;
  statisticDefinitions: StatisticDefinition[];
  groupByFieldsForStatistics?: string[];
  orderByFields?: string[];
}

interface StatisticDefinition {
  statisticType: 'count' | 'sum' | 'min' | 'max' | 'avg' | 'stddev' | 'var';
  onStatisticField: string;
  outStatisticFieldName: string;
}
```

**Example:**
```tsx
const stats = await calculateStatistics({
  statisticDefinitions: [
    { statisticType: 'sum', onStatisticField: 'POP', outStatisticFieldName: 'total' },
    { statisticType: 'avg', onStatisticField: 'POP', outStatisticFieldName: 'avg' }
  ],
  groupByFieldsForStatistics: ['STATE']
});
```

---

### useSpatialQuery

Spatial query operations.

```tsx
const { findNearby, findWithin, findIntersecting, loading, error, results } = 
  useSpatialQuery(layer);
```

**Methods:**
- `findNearby(point, options)` - Find features near a point
- `findWithin(polygon, options)` - Find features within polygon
- `findIntersecting(geometry, options)` - Find intersecting features

**Example:**
```tsx
const nearby = await findNearby(point, {
  distance: 10,
  units: 'miles',
  where: "TYPE = 'Restaurant'"
});
```

---

### useBufferAnalysis

Buffer geometry analysis.

```tsx
const { buffer, bufferMultiple, loading, error } = useBufferAnalysis();
```

**BufferOptions:**
```tsx
interface BufferOptions {
  distance: number;
  unit: __esri.LinearUnits;
  geodesic?: boolean;
  unionResults?: boolean;
}
```

**Example:**
```tsx
const buffered = await buffer(point, {
  distance: 5,
  unit: 'miles',
  geodesic: true
});
```

---

### useGeometryMeasurement

Measure distance, area, and length.

```tsx
const { measureDistance, measureArea, measureLength, loading, error } = 
  useGeometryMeasurement();
```

**Returns:**
- `measureDistance(geom1, geom2, unit)` - Measure distance
- `measureArea(polygon, unit)` - Measure area
- `measureLength(polyline, unit)` - Measure length

**Example:**
```tsx
const distance = await measureDistance(point1, point2, 'miles');
// { value: 123.45, unit: 'miles' }

const area = await measureArea(polygon, 'square-miles');
// { value: 456.78, unit: 'square-miles' }
```

---

### useRouteAnalysis

Routing and service area analysis.

```tsx
const { solveRoute, calculateServiceArea, loading, error } = 
  useRouteAnalysis(serviceUrl);
```

**RouteOptions:**
```tsx
interface RouteOptions {
  stops: __esri.Graphic[];
  barriers?: __esri.Graphic[];
  returnDirections?: boolean;
  directionsLanguage?: string;
  directionsLengthUnits?: 'miles' | 'kilometers';
  outSpatialReference?: __esri.SpatialReference;
}
```

**Example:**
```tsx
const result = await solveRoute({
  stops: [startGraphic, endGraphic],
  returnDirections: true,
  directionsLengthUnits: 'miles'
});

const route = result.routeResults[0].route;
const directions = result.routeResults[0].directions;
```

For complete analysis hooks, see [Analysis Hooks Guide](../guides/analysis-hooks.md).

---

## Portal Hooks

### usePortal

Connect to ArcGIS Online or Enterprise Portal.

```tsx
const { portal, user, loading, error, signIn, signOut } = usePortal({
  url: 'https://www.arcgis.com',
  authMode: 'auto'
});
```

**Options:**
```tsx
interface UsePortalOptions {
  url?: string;  // Default: 'https://www.arcgis.com'
  authMode?: 'immediate' | 'auto' | 'no-prompt';  // Default: 'auto'
}
```

---

### useOAuthInfo

OAuth 2.0 authentication.

```tsx
const { credential, loading, error, checkSignInStatus, signIn, signOut } = 
  useOAuthInfo({
    appId: 'YOUR_APP_ID',
    portalUrl: 'https://www.arcgis.com/sharing',
    popup: true,
    flowType: 'auto'
  });
```

**Options:**
```tsx
interface OAuthInfoOptions {
  appId: string;
  portalUrl?: string;
  popup?: boolean;
  flowType?: 'auto' | 'authorization-code' | 'implicit';
}
```

---

### usePortalSearch

Search portal content.

```tsx
const { search, loadMore, loading, error, results, hasMore } = 
  usePortalSearch(portal);
```

**PortalSearchOptions:**
```tsx
interface PortalSearchOptions {
  query: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  num?: number;
  start?: number;
  categories?: string[];
  filter?: string;
}
```

**Example:**
```tsx
await search({
  query: 'type:"Web Map" AND access:public',
  sortField: 'numViews',
  sortOrder: 'desc',
  num: 20
});

if (hasMore) {
  await loadMore();
}
```

---

### usePortalItem

Load and manage portal items.

```tsx
const { item, loading, error, reload, updateItem } = usePortalItem({
  id: 'item-id',
  portal
});
```

**Example:**
```tsx
await updateItem({
  title: 'New Title',
  tags: ['updated']
});
```

---

### usePortalContent

Manage portal content (CRUD operations).

```tsx
const { addItem, updateItem, deleteItem, shareItem, loading, error } = 
  usePortalContent(portal);
```

**AddItemOptions:**
```tsx
interface AddItemOptions {
  type: string;
  title: string;
  description?: string;
  snippet?: string;
  tags?: string[];
  thumbnail?: File | Blob;
  data?: any;
  folder?: string;
  access?: 'private' | 'org' | 'public';
}
```

**Example:**
```tsx
const item = await addItem({
  type: 'Web Map',
  title: 'My New Map',
  tags: ['map'],
  data: { baseMap: {}, operationalLayers: [] },
  access: 'private'
});

await shareItem(item.id, { everyone: true });
```

For complete portal hooks, see [Portal Integration Guide](../guides/portal-integration.md).

---

## Theme Hooks

### useTheme

Unified theme management (Calcite + ArcGIS).

```tsx
import { useTheme } from 'react-arcgis';

useTheme('auto'); // 'light', 'dark', or 'auto'
```

**Modes:**
- `'light'` - Light mode
- `'dark'` - Dark mode
- `'auto'` - Follow system preference

---

### useSystemTheme

Detect system theme preference.

```tsx
const { theme, isDark } = useSystemTheme();
```

**Returns:**
- `theme`: `'light' | 'dark'`
- `isDark`: `boolean`

For complete theme hooks, see [Theme Hooks Guide](../guides/theming.md).

---

## Utility Hooks

### useEsriModule

Lazy-load ArcGIS SDK modules.

```tsx
const { Module, loading, error } = useEsriModule(
  () => import('@arcgis/core/layers/FeatureLayer'),
  'FeatureLayer'
);
```

---

### useGraphic

Create ArcGIS Graphic instances.

```tsx
const graphic = useGraphic({
  geometry: { type: 'point', longitude: -118, latitude: 34 },
  symbol: { type: 'simple-marker', color: 'red' },
  attributes: { name: 'My Point' }
});
```

---

### useWatchUtils

Watch property changes on ArcGIS objects.

```tsx
const { watch } = useWatchUtils(view, 'zoom', (newValue, oldValue) => {
  console.log('Zoom changed:', oldValue, '->', newValue);
});
```

---

## Type Definitions

```tsx
import type {
  UsePortalOptions,
  UsePortalItemOptions,
  PortalSearchOptions,
  OAuthInfoOptions,
  QueryFeaturesOptions,
  StatisticsOptions,
  BufferOptions,
  RouteOptions,
  AddItemOptions,
  UpdateItemOptions
} from 'react-arcgis';
```

---

## Related

- [Components API](./components.md) - Component props and methods
- [Types API](./types.md) - TypeScript types
- [Hook Guides](../guides/) - Detailed guides for each hook category
