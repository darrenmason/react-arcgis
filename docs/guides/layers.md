# Comprehensive Layer Component Library

React ArcGIS provides **23 layer components** covering every ArcGIS Maps SDK layer type. All layers follow consistent React patterns with declarative JSX syntax.

## Quick Reference

| Category | Layers | Count |
|----------|--------|-------|
| **Vector & Features** | FeatureLayer, GraphicsLayer, GeoJSONLayer, CSVLayer, StreamLayer | 5 |
| **Tile Services** | TileLayer, VectorTileLayer, WebTileLayer, ImageryTileLayer | 4 |
| **Dynamic & Imagery** | MapImageLayer, ImageryLayer | 2 |
| **3D Layers** | SceneLayer, BuildingSceneLayer, IntegratedMeshLayer, PointCloudLayer, ElevationLayer | 5 |
| **OGC Standards** | WMSLayer, WMTSLayer, WFSLayer, OGCFeatureLayer, KMLLayer | 5 |
| **Organization** | GroupLayer, SubtypeGroupLayer | 2 |
| **TOTAL** | | **23** |

---

## Vector & Feature Layers

### FeatureLayer

Display vector features from ArcGIS feature services.

```tsx
<FeatureLayer
  url="https://services.arcgis.com/.../FeatureServer/0"
  visible={true}
  opacity={0.8}
  definitionExpression="POP2010 > 1000000"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [51, 51, 204, 0.9]
    }
  }}
  popupTemplate={{
    title: '{NAME}',
    content: 'Population: {POP2010}'
  }}
  onLoad={(layer) => console.log('Layer loaded:', layer)}
/>
```

**Props:**
- `url` - Feature service URL
- `portalItem` - Portal item reference
- `fields` - Field definitions
- `renderer` - Symbology renderer
- `popupTemplate` - Popup configuration
- `definitionExpression` - SQL filter
- `outFields` - Fields to return

---

### GraphicsLayer

Client-side graphics collection.

```tsx
<GraphicsLayer
  graphics={[
    {
      geometry: { type: 'point', x: -118.805, y: 34.027 },
      symbol: { type: 'simple-marker', color: 'red' },
      attributes: { name: 'My Point' }
    }
  ]}
  elevationInfo={{
    mode: 'relative-to-ground',
    offset: 100
  }}
/>
```

**Props:**
- `graphics` - Array of graphic objects
- `elevationInfo` - 3D elevation settings

---

### GeoJSONLayer

Display GeoJSON data.

```tsx
<GeoJSONLayer
  url="https://example.com/data.geojson"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: 'blue',
      size: 8
    }
  }}
  copyright="© My Organization"
/>
```

**Props:**
- `url` - GeoJSON file URL
- `renderer` - Symbology
- `popupTemplate` - Popup config

---

### CSVLayer

Display CSV point data.

```tsx
<CSVLayer
  url="https://example.com/data.csv"
  latitudeField="lat"
  longitudeField="lon"
  delimiter=","
  fields={[
    { name: 'name', type: 'string' },
    { name: 'value', type: 'double' }
  ]}
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: 'green'
    }
  }}
/>
```

**Props:**
- `url` - CSV file URL
- `latitudeField` - Latitude column name
- `longitudeField` - Longitude column name
- `delimiter` - Field delimiter
- `fields` - Field definitions

---

### StreamLayer

Real-time streaming data.

```tsx
<StreamLayer
  url="https://geoeventsample.esri.com/stream"
  purgeOptions={{
    displayCount: 10000,
    age: 5
  }}
  updateInterval={500}
  maximumTrackPoints={1000}
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: [255, 0, 0],
      size: 8
    }
  }}
/>
```

**Props:**
- `url` - Stream service URL
- `purgeOptions` - Data retention settings
- `updateInterval` - Refresh interval (ms)
- `maximumTrackPoints` - Track history length

---

## Tile Services

### TileLayer

Cached tile services.

```tsx
<TileLayer
  url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
  opacity={0.7}
  refreshInterval={30}
/>
```

**Props:**
- `url` - Tile service URL
- `portalItem` - Portal item
- `tileInfo` - Tile schema
- `refreshInterval` - Auto-refresh interval

---

### VectorTileLayer

Vector tile basemaps.

```tsx
<VectorTileLayer
  portalItem={{ id: "abc123" }}
  style="https://example.com/style.json"
/>
```

**Props:**
- `url` - Vector tile URL
- `portalItem` - Portal item
- `style` - Mapbox style JSON

---

### WebTileLayer

Third-party tile services (OpenStreetMap, etc.).

```tsx
<WebTileLayer
  urlTemplate="https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png"
  subDomains={["a", "b", "c"]}
  copyright="© OpenStreetMap contributors"
/>
```

**Props:**
- `urlTemplate` - URL template with tokens
- `subDomains` - Subdomain array
- `copyright` - Attribution text
- `tileInfo` - Tile schema

---

### ImageryTileLayer

Tiled imagery services.

```tsx
<ImageryTileLayer
  url="https://tiledimageservices.arcgis.com/service/ImageServer"
  rasterFunction={{
    functionName: "Hillshade",
    functionArguments: {
      azimuth: 315,
      altitude: 45
    }
  }}
/>
```

**Props:**
- `url` - Imagery tile service URL
- `rasterFunction` - Raster function
- `multidimensionalDefinition` - Multidimensional data

---

## Dynamic & Imagery Layers

### MapImageLayer

Dynamic map services.

```tsx
<MapImageLayer
  url="https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
  sublayers={[
    { id: 0, visible: true },
    { id: 1, visible: true, opacity: 0.5 },
    { id: 2, visible: false }
  ]}
  imageFormat="png32"
  refreshInterval={60}
/>
```

**Props:**
- `url` - Map service URL
- `sublayers` - Sublayer configuration
- `imageFormat` - Image format
- `imageMaxWidth/Height` - Max dimensions
- `refreshInterval` - Auto-refresh

---

### ImageryLayer

Raster imagery services.

```tsx
<ImageryLayer
  url="https://landsat.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer"
  renderingRule={{
    functionName: "NDVI",
    functionArguments: {
      visibleBandID: 3,
      infraredBandID: 4
    }
  }}
  mosaicRule={{
    method: "center",
    operation: "first"
  }}
/>
```

**Props:**
- `url` - Image service URL
- `rasterFunction` - Raster function
- `renderingRule` - Rendering rule
- `mosaicRule` - Mosaic rule
- `pixelFilter` - Custom pixel filter

---

## 3D Layers

### SceneLayer

3D scene services.

```tsx
<SceneLayer
  url="https://tiles.arcgis.com/.../SceneServer"
  popupTemplate={{
    title: "{NAME}",
    content: "Height: {HEIGHT}m"
  }}
  elevationInfo={{
    mode: "on-the-ground"
  }}
/>
```

**Props:**
- `url` - Scene service URL
- `elevationInfo` - 3D elevation
- `renderer` - 3D symbology
- `popupTemplate` - Popup config

---

### BuildingSceneLayer

3D building models with filtering.

```tsx
<BuildingSceneLayer
  portalItem={{ id: "building-id" }}
  activeFilterId="floors-1-5"
  filters={[
    {
      id: "floors-1-5",
      name: "Floors 1-5",
      where: "FLOOR_LEVEL >= 1 AND FLOOR_LEVEL <= 5"
    },
    {
      id: "structural",
      name: "Structural",
      where: "CATEGORY = 'Structural'"
    }
  ]}
/>
```

**Props:**
- `url` - Building scene URL
- `portalItem` - Portal item
- `activeFilterId` - Active filter
- `filters` - Building filters

---

### IntegratedMeshLayer

3D mesh data (photogrammetry).

```tsx
<IntegratedMeshLayer
  portalItem={{ id: "mesh-id" }}
  elevationInfo={{
    mode: "on-the-ground"
  }}
/>
```

**Props:**
- `url` - Mesh service URL
- `portalItem` - Portal item
- `elevationInfo` - Elevation settings

---

### PointCloudLayer

LiDAR point cloud data.

```tsx
<PointCloudLayer
  url="https://tiles.arcgis.com/.../SceneServer"
  renderer={{
    type: "point-cloud-rgb",
    field: "RGB",
    pointSizeAlgorithm: {
      type: "fixed-size",
      useRealWorldSymbolSizes: false,
      size: 3
    }
  }}
  filters={[
    {
      field: "CLASS_CODE",
      type: "value",
      values: [2, 3, 4, 5]
    }
  ]}
/>
```

**Props:**
- `url` - Point cloud service URL
- `renderer` - Point cloud renderer
- `filters` - Point cloud filters
- `elevationInfo` - Elevation settings

---

### ElevationLayer

Terrain elevation data.

```tsx
<ElevationLayer
  url="https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
/>
```

**Note:** Typically added to `map.ground.layers` rather than as a regular layer.

**Props:**
- `url` - Elevation service URL
- `portalItem` - Portal item

---

## OGC & Standards

### WMSLayer

OGC Web Map Service.

```tsx
<WMSLayer
  url="https://example.com/wms"
  sublayers={[
    { name: "0" },
    { name: "1" }
  ]}
  version="1.3.0"
  imageFormat="image/png"
  imageTransparency={true}
/>
```

**Props:**
- `url` - WMS endpoint
- `sublayers` - WMS layers
- `version` - WMS version
- `imageFormat` - Image format
- `customLayerParameters` - Custom params

---

### WMTSLayer

OGC Web Map Tile Service.

```tsx
<WMTSLayer
  url="https://example.com/wmts"
  activeLayer={{ id: "layer1" }}
  serviceMode="RESTful"
/>
```

**Props:**
- `url` - WMTS endpoint
- `activeLayer` - Active layer
- `serviceMode` - "KVP" or "RESTful"
- `customParameters` - Custom params

---

### WFSLayer

OGC Web Feature Service.

```tsx
<WFSLayer
  url="https://example.com/wfs"
  name="namespace:featuretype"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [0, 100, 200, 0.5]
    }
  }}
/>
```

**Props:**
- `url` - WFS endpoint
- `name` - Feature type name
- `customParameters` - Custom params
- `renderer` - Symbology

---

### OGCFeatureLayer

OGC API - Features.

```tsx
<OGCFeatureLayer
  url="https://example.com/ogcapi/collections"
  collectionId="my-collection"
  renderer={{
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: 'blue'
    }
  }}
/>
```

**Props:**
- `url` - OGC API endpoint
- `collectionId` - Collection ID
- `customParameters` - Custom params

---

### KMLLayer

KML/KMZ files.

```tsx
<KMLLayer
  url="https://example.com/data.kml"
  refreshInterval={300}
/>
```

**Props:**
- `url` - KML file URL
- `portalItem` - Portal item
- `refreshInterval` - Auto-refresh

---

## Organization Layers

### GroupLayer

Organize layers into groups.

```tsx
<GroupLayer
  visibilityMode="independent"
  layers={[layer1, layer2, layer3]}
>
  <FeatureLayer url="..." />
  <FeatureLayer url="..." />
  <TileLayer url="..." />
</GroupLayer>
```

**Props:**
- `layers` - Layer array
- `visibilityMode` - "independent", "inherited", or "exclusive"

**Visibility Modes:**
- `independent` - Each layer controls its own visibility
- `inherited` - Layers inherit group visibility
- `exclusive` - Only one layer visible at a time

---

### SubtypeGroupLayer

Feature layers with subtypes.

```tsx
<SubtypeGroupLayer
  url="https://services.arcgis.com/.../FeatureServer/0"
  onLoad={(layer) => {
    console.log('Subtypes:', layer.sublayers);
    layer.sublayers.forEach(sublayer => {
      console.log(sublayer.subtypeCode, sublayer.title);
    });
  }}
/>
```

**Props:**
- `url` - Feature service URL with subtypes
- `portalItem` - Portal item
- `sublayers` - Subtype sublayers

---

## Common Props

All layer components support these common props:

```tsx
interface LayerProps {
  visible?: boolean;        // Layer visibility (default: true)
  opacity?: number;         // Layer opacity 0-1 (default: 1)
  map?: Map;               // Parent map (auto-provided)
  view?: ViewType;         // Parent view (auto-provided)
  onLoad?: (layer) => void; // Load callback
}
```

---

## Usage Patterns

### Basic Usage

```tsx
<Map basemap="gray-vector">
  <MapView center={[-118.805, 34.027]} zoom={13}>
    <FeatureLayer url="..." />
    <TileLayer url="..." opacity={0.5} />
    <GraphicsLayer graphics={myGraphics} />
  </MapView>
</Map>
```

### Conditional Rendering

```tsx
function LayerSelector() {
  const [showImagery, setShowImagery] = useState(false);
  
  return (
    <MapView center={[-118.805, 34.027]} zoom={13}>
      <VectorTileLayer portalItem={{ id: "abc123" }} />
      
      {showImagery && (
        <ImageryLayer url="..." opacity={0.7} />
      )}
      
      <button onClick={() => setShowImagery(!showImagery)}>
        Toggle Imagery
      </button>
    </MapView>
  );
}
```

### Grouped Layers

```tsx
<MapView center={[-118.805, 34.027]} zoom={13}>
  <GroupLayer title="Base Layers" visibilityMode="exclusive">
    <TileLayer url="..." />
    <VectorTileLayer url="..." />
  </GroupLayer>
  
  <GroupLayer title="Data Layers" visibilityMode="independent">
    <FeatureLayer url="..." />
    <FeatureLayer url="..." />
  </GroupLayer>
</MapView>
```

### 3D Scene

```tsx
<Map basemap="satellite" ground="world-elevation">
  <SceneView camera={{ position: { x: -118.805, y: 34.027, z: 5000 }, tilt: 65 }}>
    <BuildingSceneLayer portalItem={{ id: "..." }} />
    <IntegratedMeshLayer portalItem={{ id: "..." }} />
    <PointCloudLayer url="..." />
  </SceneView>
</Map>
```

### Dynamic Data

```tsx
function RealTimeMap() {
  const [filter, setFilter] = useState("");
  
  return (
    <MapView center={[0, 0]} zoom={2}>
      <StreamLayer
        url="https://..."
        purgeOptions={{ displayCount: 10000 }}
        updateInterval={500}
      />
      
      <FeatureLayer
        url="..."
        definitionExpression={filter}
      />
    </MapView>
  );
}
```

### Loading State

```tsx
function LayerWithLoading() {
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState(null);
  
  return (
    <>
      {loading && <div>Loading layer...</div>}
      
      <FeatureLayer
        url="..."
        onLoad={(l) => {
          setLayer(l);
          setLoading(false);
        }}
      />
    </>
  );
}
```

---

## Layer Selection Guide

| Use Case | Recommended Layer |
|----------|------------------|
| Vector features from ArcGIS | FeatureLayer |
| Client-side graphics | GraphicsLayer |
| GeoJSON files | GeoJSONLayer |
| CSV points | CSVLayer |
| Real-time data | StreamLayer |
| Basemap tiles | TileLayer, VectorTileLayer |
| Third-party tiles | WebTileLayer |
| Satellite imagery | ImageryLayer, ImageryTileLayer |
| Dynamic maps | MapImageLayer |
| 3D buildings | BuildingSceneLayer, SceneLayer |
| 3D terrain | ElevationLayer |
| Point clouds | PointCloudLayer |
| Photogrammetry | IntegratedMeshLayer |
| OGC services | WMSLayer, WMTSLayer, WFSLayer |
| KML files | KMLLayer |

---

## TypeScript Support

All layer components have full TypeScript definitions:

```tsx
import type {
  FeatureLayerProps,
  TileLayerProps,
  SceneLayerProps,
  // ... etc
} from 'react-arcgis';

const props: FeatureLayerProps = {
  url: "...",
  visible: true,
  renderer: { /* ... */ }
};
```

---

## Performance Tips

1. **Use GroupLayers** to organize related layers
2. **Set `outFields`** on FeatureLayer to limit data
3. **Use `definitionExpression`** to filter server-side
4. **Set appropriate `refreshInterval`** for dynamic layers
5. **Control layer `visible`** and `opacity` for performance
6. **Use WebTileLayer** for third-party tiles (lighter than proxy)
7. **Limit StreamLayer `purgeOptions.displayCount`** for memory

---

## Complete Example

```tsx
import {
  Map,
  MapView,
  VectorTileLayer,
  FeatureLayer,
  CSVLayer,
  GroupLayer,
  useLayerList,
  useLegend
} from 'react-arcgis';

function ComprehensiveMap() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-98.5795, 39.8283]} zoom={4}>
        {/* Basemap */}
        <VectorTileLayer
          portalItem={{ id: "basemap-id" }}
          opacity={0.7}
        />
        
        {/* Reference layers */}
        <GroupLayer title="Reference" visibilityMode="independent">
          <FeatureLayer
            url="https://.../states"
            renderer={{ type: 'simple', symbol: { type: 'simple-fill' } }}
          />
          <FeatureLayer
            url="https://.../cities"
            renderer={{ type: 'simple', symbol: { type: 'simple-marker' } }}
          />
        </GroupLayer>
        
        {/* Data layer */}
        <CSVLayer
          url="data.csv"
          latitudeField="lat"
          longitudeField="lon"
          renderer={{
            type: 'simple',
            symbol: { type: 'simple-marker', color: 'red' }
          }}
        />
        
        <MapWidgets />
      </MapView>
    </Map>
  );
}

function MapWidgets() {
  const { view } = useView();
  useLayerList({ view, position: 'top-right' });
  useLegend({ view, position: 'bottom-right' });
  return null;
}
```

---

**23 Layer Components - Complete Coverage of ArcGIS Maps SDK** ✅
