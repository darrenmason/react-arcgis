# Layer Quick Reference Guide

## 📦 23 Layer Components - Complete Coverage

### 🎯 Vector & Features (5 layers)

```tsx
// Feature service data
<FeatureLayer url="..." renderer={{...}} popupTemplate={{...}} />

// Client-side graphics
<GraphicsLayer graphics={[...]} />

// GeoJSON files
<GeoJSONLayer url="data.geojson" />

// CSV point data
<CSVLayer url="data.csv" latitudeField="lat" longitudeField="lon" />

// Real-time streaming
<StreamLayer url="..." purgeOptions={{...}} updateInterval={500} />
```

### 🗺️ Tile Services (4 layers)

```tsx
// Cached tile services
<TileLayer url="..." />

// Vector tile basemaps
<VectorTileLayer portalItem={{id: "..."}} />

// Third-party tiles (OSM, etc.)
<WebTileLayer 
  urlTemplate="https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png"
  subDomains={["a","b","c"]}
/>

// Tiled imagery
<ImageryTileLayer url="..." rasterFunction={{...}} />
```

### 🖼️ Dynamic & Imagery (2 layers)

```tsx
// Dynamic map services
<MapImageLayer url="..." sublayers={[...]} />

// Raster imagery
<ImageryLayer url="..." renderingRule={{...}} />
```

### 🏢 3D Layers (5 layers)

```tsx
// 3D scene services
<SceneLayer url="..." />

// Building models
<BuildingSceneLayer portalItem={{id:"..."}} filters={[...]} />

// 3D mesh (photogrammetry)
<IntegratedMeshLayer portalItem={{id:"..."}} />

// Point clouds (LiDAR)
<PointCloudLayer url="..." renderer={{type:"point-cloud-rgb"}} />

// Terrain elevation
<ElevationLayer url="..." />
```

### 🌐 OGC & Standards (5 layers)

```tsx
// OGC Web Map Service
<WMSLayer url="..." sublayers={[...]} />

// OGC Web Map Tile Service
<WMTSLayer url="..." activeLayer={{...}} />

// OGC Web Feature Service
<WFSLayer url="..." name="namespace:featuretype" />

// OGC API - Features
<OGCFeatureLayer url="..." collectionId="..." />

// KML/KMZ files
<KMLLayer url="data.kml" />
```

### 📁 Organization (2 layers)

```tsx
// Layer groups
<GroupLayer visibilityMode="exclusive">
  <FeatureLayer url="..." />
  <TileLayer url="..." />
</GroupLayer>

// Subtype layers
<SubtypeGroupLayer url="..." />
```

---

## Common Patterns

### Basic Map

```tsx
<Map basemap="gray-vector">
  <MapView center={[-118, 34]} zoom={10}>
    <FeatureLayer url="..." />
    <TileLayer url="..." opacity={0.5} />
  </MapView>
</Map>
```

### 3D Scene

```tsx
<Map basemap="satellite">
  <SceneView camera={{...}}>
    <BuildingSceneLayer portalItem={{id:"..."}} />
    <IntegratedMeshLayer portalItem={{id:"..."}} />
  </SceneView>
</Map>
```

### Grouped Layers

```tsx
<MapView>
  <GroupLayer title="Basemaps" visibilityMode="exclusive">
    <TileLayer url="topo" />
    <TileLayer url="imagery" />
  </GroupLayer>
  
  <GroupLayer title="Data">
    <FeatureLayer url="..." />
    <FeatureLayer url="..." />
  </GroupLayer>
</MapView>
```

### Real-Time Data

```tsx
<MapView>
  <StreamLayer 
    url="..."
    purgeOptions={{ displayCount: 10000, age: 5 }}
    updateInterval={500}
  />
</MapView>
```

---

## Layer Selection Flowchart

```
Need to display data?
│
├─ Vector features?
│  ├─ From ArcGIS Service? → FeatureLayer
│  ├─ GeoJSON file? → GeoJSONLayer
│  ├─ CSV points? → CSVLayer
│  ├─ Client-side? → GraphicsLayer
│  └─ Real-time stream? → StreamLayer
│
├─ Basemap/Tiles?
│  ├─ ArcGIS tiles? → TileLayer
│  ├─ Vector tiles? → VectorTileLayer
│  ├─ Third-party (OSM)? → WebTileLayer
│  └─ Imagery tiles? → ImageryTileLayer
│
├─ Dynamic/Imagery?
│  ├─ Dynamic service? → MapImageLayer
│  └─ Imagery service? → ImageryLayer
│
├─ 3D Data?
│  ├─ 3D features? → SceneLayer
│  ├─ Buildings? → BuildingSceneLayer
│  ├─ Mesh (photos)? → IntegratedMeshLayer
│  ├─ Point cloud? → PointCloudLayer
│  └─ Terrain? → ElevationLayer
│
├─ OGC Standard?
│  ├─ WMS? → WMSLayer
│  ├─ WMTS? → WMTSLayer
│  ├─ WFS? → WFSLayer
│  ├─ OGC Features? → OGCFeatureLayer
│  └─ KML? → KMLLayer
│
└─ Organization?
   ├─ Group layers? → GroupLayer
   └─ Subtypes? → SubtypeGroupLayer
```

---

## Common Props Reference

All layers support:

```tsx
<AnyLayer
  visible={true}              // Show/hide layer
  opacity={1}                 // 0-1 transparency
  onLoad={(layer) => {...}}   // Callback when loaded
/>
```

Feature-based layers also support:

```tsx
<FeatureLayer
  renderer={{...}}            // Symbology
  popupTemplate={{...}}       // Popup config
  definitionExpression="..."  // SQL filter
  outFields={["*"]}          // Fields to return
/>
```

---

## Import Reference

```tsx
// Import individual layers
import { 
  FeatureLayer,
  TileLayer,
  VectorTileLayer,
  SceneLayer,
  // ... etc
} from 'react-arcgis';

// Import with types
import type {
  FeatureLayerProps,
  TileLayerProps,
  // ... etc
} from 'react-arcgis';
```

---

## Performance Tips

✅ **DO:**
- Use `definitionExpression` to filter server-side
- Set `outFields` to limit data transfer
- Use GroupLayer to organize related layers
- Control visibility with `visible` prop
- Use WebTileLayer for third-party tiles

❌ **DON'T:**
- Load all features at once (use pagination)
- Forget to set `purgeOptions` on StreamLayer
- Use multiple FeatureLayers for one service (use sublayers)
- Load high-res imagery at small scales

---

## Full Documentation

See [LAYER_LIBRARY.md](./LAYER_LIBRARY.md) for:
- Detailed prop documentation
- Complete code examples
- Advanced patterns
- TypeScript types
- Performance optimization

---

**React ArcGIS - 23 Layer Components** ✅
