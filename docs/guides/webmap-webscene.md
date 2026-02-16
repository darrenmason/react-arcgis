# WebMap & WebScene Guide

Complete guide to using WebMap and WebScene components and hooks for loading ArcGIS Online and Portal content in React.

## Table of Contents

- [Overview](#overview)
- [WebMap Component](#webmap-component)
- [WebScene Component](#webscene-component)
- [useWebMap Hook](#usewebmap-hook)
- [useWebScene Hook](#usewebscene-hook)
- [Portal Integration](#portal-integration)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Overview

WebMap and WebScene support allows you to load pre-configured maps and scenes from:
- **ArcGIS Online** - Public or organizational content
- **ArcGIS Enterprise Portal** - On-premises portal content

Both **component** and **hook** APIs are available for maximum flexibility.

### When to Use

**Use WebMap/WebScene when:**
- ✅ Loading published maps from ArcGIS Online
- ✅ Using organizational content
- ✅ Leveraging existing map configurations
- ✅ Sharing maps across applications
- ✅ Non-developers need to update maps

**Use Map/SceneView components when:**
- ✅ Building custom maps from scratch
- ✅ Full control over layers and configuration
- ✅ Dynamic layer creation
- ✅ Programmatic map construction

---

## WebMap Component

Load a 2D web map from ArcGIS Online or Portal.

### Basic Usage

```tsx
import { WebMap, MapView } from 'react-arcgis';

function App() {
  return (
    <WebMap portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}>
      <MapView center={[-118.805, 34.027]} zoom={13} />
    </WebMap>
  );
}
```

### Props

```tsx
interface WebMapProps {
  portalItem: { id: string } | __esri.PortalItemProperties;
  onLoad?: (webMap: WebMap) => void;
  children?: React.ReactNode;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `portalItem` | `{ id: string }` or `PortalItemProperties` | Portal item ID or properties |
| `onLoad` | `(webMap: WebMap) => void` | Callback when WebMap loads |
| `children` | `React.ReactNode` | MapView and other components |

### Examples

#### Simple WebMap

```tsx
<WebMap portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}>
  <MapView />
</WebMap>
```

#### With onLoad Callback

```tsx
function WebMapApp() {
  const [mapInfo, setMapInfo] = useState(null);

  return (
    <WebMap
      portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}
      onLoad={(webMap) => {
        console.log('WebMap loaded:', webMap);
        setMapInfo({
          title: webMap.portalItem.title,
          description: webMap.portalItem.description,
          layerCount: webMap.layers.length
        });
      }}
    >
      <MapView>
        {/* Add widgets */}
        <Zoom position="top-left" />
        <Home position="top-left" />
        <LayerList position="top-right" />
        <Legend position="bottom-right" />
      </MapView>
    </WebMap>
  );
}
```

#### With Custom View Settings

```tsx
<WebMap portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}>
  <MapView
    center={[-100, 40]}
    zoom={5}
    constraints={{
      minZoom: 3,
      maxZoom: 18
    }}
  >
    <Search position="top-right" />
  </MapView>
</WebMap>
```

#### Multiple Views of Same WebMap

```tsx
function DualViewApp() {
  const [webMap, setWebMap] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <WebMap
          portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}
          onLoad={setWebMap}
        >
          <MapView center={[-100, 40]} zoom={4} />
        </WebMap>
      </div>
      
      {webMap && (
        <div style={{ flex: 1 }}>
          <MapView map={webMap} center={[-120, 37]} zoom={6} />
        </div>
      )}
    </div>
  );
}
```

---

## WebScene Component

Load a 3D scene from ArcGIS Online or Portal.

### Basic Usage

```tsx
import { WebScene, SceneView } from 'react-arcgis';

function App() {
  return (
    <WebScene portalItem={{ id: '579f97b2f3b94d4a8e48a5f140a6639b' }}>
      <SceneView />
    </WebScene>
  );
}
```

### Props

```tsx
interface WebSceneProps {
  portalItem: { id: string } | __esri.PortalItemProperties;
  onLoad?: (webScene: WebScene) => void;
  children?: React.ReactNode;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `portalItem` | `{ id: string }` or `PortalItemProperties` | Portal item ID or properties |
| `onLoad` | `(webScene: WebScene) => void` | Callback when WebScene loads |
| `children` | `React.ReactNode` | SceneView and other components |

### Examples

#### Simple WebScene

```tsx
<WebScene portalItem={{ id: '579f97b2f3b94d4a8e48a5f140a6639b' }}>
  <SceneView />
</WebScene>
```

#### With Camera Position

```tsx
<WebScene portalItem={{ id: '579f97b2f3b94d4a8e48a5f140a6639b' }}>
  <SceneView
    camera={{
      position: {
        x: -118.808,
        y: 33.961,
        z: 2000
      },
      tilt: 75,
      heading: 30
    }}
  >
    <Home position="top-left" />
    <Compass position="top-left" />
  </SceneView>
</WebScene>
```

#### With onLoad Callback

```tsx
function WebSceneApp() {
  return (
    <WebScene
      portalItem={{ id: '579f97b2f3b94d4a8e48a5f140a6639b' }}
      onLoad={(webScene) => {
        console.log('WebScene loaded:', webScene);
        console.log('Layers:', webScene.layers.map(l => l.title));
        console.log('Viewpoint:', webScene.initialViewProperties);
      }}
    >
      <SceneView>
        <LayerList position="top-right" />
        <Legend position="bottom-right" />
        <ElevationProfile position="bottom" />
      </SceneView>
    </WebScene>
  );
}
```

---

## useWebMap Hook

Load a WebMap programmatically with full control.

### Basic Usage

```tsx
import { useWebMap, MapView } from 'react-arcgis';

function WebMapLoader() {
  const { webMap, loading, error } = useWebMap({
    portalItem: { id: 'e691172598f04ea8881cd2a4adaa45ba' }
  });
  
  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <MapView map={webMap} />;
}
```

### Return Value

```tsx
interface UseWebMapReturn {
  webMap: WebMap | null;
  loading: boolean;
  error: Error | null;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `webMap` | `WebMap \| null` | Loaded WebMap instance |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error if loading failed |

### Examples

#### With Loading States

```tsx
function WebMapWithStates() {
  const { webMap, loading, error } = useWebMap({
    portalItem: { id: 'e691172598f04ea8881cd2a4adaa45ba' }
  });
  
  if (loading) {
    return (
      <div className="loading-container">
        <CalciteLoader scale="l" text="Loading map..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <CalciteNotice kind="danger" open>
        <div slot="title">Failed to Load Map</div>
        <div slot="message">{error.message}</div>
      </CalciteNotice>
    );
  }
  
  return (
    <MapView map={webMap}>
      <LayerList position="top-right" />
      <Legend position="bottom-right" />
    </MapView>
  );
}
```

#### Dynamic WebMap Selection

```tsx
function WebMapSelector() {
  const [selectedId, setSelectedId] = useState('e691172598f04ea8881cd2a4adaa45ba');
  
  const { webMap, loading, error } = useWebMap({
    portalItem: { id: selectedId }
  });
  
  const maps = [
    { id: 'e691172598f04ea8881cd2a4adaa45ba', name: 'World Street Map' },
    { id: 'abc123xyz', name: 'Custom Map' },
    { id: 'def456uvw', name: 'Thematic Map' }
  ];
  
  return (
    <div>
      <CalciteSelect onCalciteSelectChange={(e) => setSelectedId(e.target.value)}>
        {maps.map(map => (
          <CalciteOption key={map.id} value={map.id}>
            {map.name}
          </CalciteOption>
        ))}
      </CalciteSelect>
      
      {loading && <CalciteLoader />}
      {error && <div>Error: {error.message}</div>}
      {webMap && <MapView map={webMap} />}
    </div>
  );
}
```

#### Access WebMap Properties

```tsx
function WebMapInfo() {
  const { webMap, loading } = useWebMap({
    portalItem: { id: 'e691172598f04ea8881cd2a4adaa45ba' }
  });
  
  const [info, setInfo] = useState(null);
  
  useEffect(() => {
    if (webMap) {
      setInfo({
        title: webMap.portalItem.title,
        description: webMap.portalItem.description,
        owner: webMap.portalItem.owner,
        created: webMap.portalItem.created,
        modified: webMap.portalItem.modified,
        layers: webMap.layers.map(l => ({
          id: l.id,
          title: l.title,
          type: l.type,
          visible: l.visible
        }))
      });
    }
  }, [webMap]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{info?.title}</h2>
      <p>{info?.description}</p>
      <h3>Layers ({info?.layers.length})</h3>
      <ul>
        {info?.layers.map(layer => (
          <li key={layer.id}>
            {layer.title} ({layer.type})
          </li>
        ))}
      </ul>
      
      <MapView map={webMap} />
    </div>
  );
}
```

---

## useWebScene Hook

Load a WebScene programmatically with full control.

### Basic Usage

```tsx
import { useWebScene, SceneView } from 'react-arcgis';

function WebSceneLoader() {
  const { webScene, loading, error } = useWebScene({
    portalItem: { id: '579f97b2f3b94d4a8e48a5f140a6639b' }
  });
  
  if (loading) return <div>Loading scene...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <SceneView map={webScene} />;
}
```

### Return Value

```tsx
interface UseWebSceneReturn {
  webScene: WebScene | null;
  loading: boolean;
  error: Error | null;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `webScene` | `WebScene \| null` | Loaded WebScene instance |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error if loading failed |

### Examples

#### With Loading States

```tsx
function WebSceneWithStates() {
  const { webScene, loading, error } = useWebScene({
    portalItem: { id: '579f97b2f3b94d4a8e48a5f140a6639b' }
  });
  
  if (loading) {
    return (
      <div className="loading-container">
        <CalciteLoader scale="l" text="Loading 3D scene..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <CalciteNotice kind="danger" open>
        <div slot="title">Failed to Load Scene</div>
        <div slot="message">{error.message}</div>
      </CalciteNotice>
    );
  }
  
  return (
    <SceneView map={webScene}>
      <Home position="top-left" />
      <Compass position="top-left" />
      <LayerList position="top-right" />
      <ElevationProfile position="bottom" />
    </SceneView>
  );
}
```

#### Scene Gallery

```tsx
function SceneGallery() {
  const scenes = [
    { id: '579f97b2f3b94d4a8e48a5f140a6639b', name: 'Buildings Scene', thumbnail: '...' },
    { id: 'abc123', name: 'Terrain Scene', thumbnail: '...' },
    { id: 'def456', name: 'Urban Scene', thumbnail: '...' }
  ];
  
  const [selectedScene, setSelectedScene] = useState(scenes[0].id);
  
  const { webScene, loading, error } = useWebScene({
    portalItem: { id: selectedScene }
  });
  
  return (
    <div className="scene-gallery">
      <div className="gallery-sidebar">
        {scenes.map(scene => (
          <CalciteCard key={scene.id} onClick={() => setSelectedScene(scene.id)}>
            <img src={scene.thumbnail} alt={scene.name} />
            <span slot="title">{scene.name}</span>
          </CalciteCard>
        ))}
      </div>
      
      <div className="scene-view">
        {loading && <CalciteLoader />}
        {error && <div>Error: {error.message}</div>}
        {webScene && <SceneView map={webScene} />}
      </div>
    </div>
  );
}
```

---

## Portal Integration

### Using with Portal Authentication

```tsx
import { usePortal, useWebMap, MapView } from 'react-arcgis';

function PortalWebMapApp() {
  const { portal, user, signIn, signOut, loading: portalLoading } = usePortal({
    url: 'https://myorg.maps.arcgis.com'
  });
  
  const { webMap, loading: mapLoading } = useWebMap({
    portalItem: { id: 'private-map-id' }
  });
  
  if (portalLoading) return <div>Connecting to portal...</div>;
  
  if (!user) {
    return (
      <div>
        <h2>Sign in to view private maps</h2>
        <CalciteButton onClick={signIn}>Sign In</CalciteButton>
      </div>
    );
  }
  
  return (
    <div>
      <header>
        <span>Welcome, {user.fullName}</span>
        <CalciteButton onClick={signOut}>Sign Out</CalciteButton>
      </header>
      
      {mapLoading && <CalciteLoader />}
      {webMap && <MapView map={webMap} />}
    </div>
  );
}
```

### Loading Organization Content

```tsx
function OrganizationMaps() {
  const { portal, user } = usePortal({
    url: 'https://myorg.maps.arcgis.com'
  });
  
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  
  useEffect(() => {
    if (portal && user) {
      // Query organization maps
      portal.queryItems({
        query: `owner:${user.username} type:"Web Map"`,
        num: 10
      }).then(result => {
        setMaps(result.results);
        if (result.results.length > 0) {
          setSelectedMap(result.results[0].id);
        }
      });
    }
  }, [portal, user]);
  
  const { webMap, loading } = useWebMap({
    portalItem: { id: selectedMap }
  });
  
  return (
    <div>
      <CalciteSelect
        label="Your Maps"
        onCalciteSelectChange={(e) => setSelectedMap(e.target.value)}
      >
        {maps.map(map => (
          <CalciteOption key={map.id} value={map.id}>
            {map.title}
          </CalciteOption>
        ))}
      </CalciteSelect>
      
      {loading && <CalciteLoader />}
      {webMap && <MapView map={webMap} />}
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: WebMap with Widgets

```tsx
function WebMapWithUI() {
  return (
    <WebMap portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}>
      <MapView>
        {/* Navigation */}
        <Zoom position="top-left" />
        <Home position="top-left" />
        <Compass position="top-left" />
        
        {/* Information */}
        <Search position="top-right" />
        <LayerList position="top-right" />
        <Legend position="bottom-right" />
        
        {/* Basemap */}
        <BasemapToggle position="bottom-left" nextBasemap="satellite" />
      </MapView>
    </WebMap>
  );
}
```

### Pattern 2: WebScene with 3D Widgets

```tsx
function WebSceneWith3DWidgets() {
  return (
    <WebScene portalItem={{ id: '579f97b2f3b94d4a8e48a5f140a6639b' }}>
      <SceneView>
        <Home position="top-left" />
        <Compass position="top-left" />
        <LayerList position="top-right" />
        <Legend position="bottom-right" />
        <ElevationProfile position="bottom" unit="metric" />
      </SceneView>
    </WebScene>
  );
}
```

### Pattern 3: Loading State Management

```tsx
function LoadingStateExample() {
  const { webMap, loading, error } = useWebMap({
    portalItem: { id: 'e691172598f04ea8881cd2a4adaa45ba' }
  });
  
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {loading && (
        <div className="loading-overlay">
          <CalciteLoader scale="l" />
          <p>Loading map...</p>
        </div>
      )}
      
      {error && (
        <CalciteNotice kind="danger" open>
          <div slot="title">Error Loading Map</div>
          <div slot="message">{error.message}</div>
        </CalciteNotice>
      )}
      
      {webMap && (
        <MapView map={webMap}>
          <Search position="top-right" />
        </MapView>
      )}
    </div>
  );
}
```

### Pattern 4: Side-by-Side Comparison

```tsx
function MapComparison() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <WebMap portalItem={{ id: 'map-2020' }}>
          <MapView>
            <h3 style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
              2020 Data
            </h3>
          </MapView>
        </WebMap>
      </div>
      
      <div style={{ flex: 1 }}>
        <WebMap portalItem={{ id: 'map-2025' }}>
          <MapView>
            <h3 style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
              2025 Data
            </h3>
          </MapView>
        </WebMap>
      </div>
    </div>
  );
}
```

### Pattern 5: Adding Dynamic Layers

```tsx
function WebMapWithExtraLayers() {
  return (
    <WebMap portalItem={{ id: 'e691172598f04ea8881cd2a4adaa45ba' }}>
      <MapView>
        {/* WebMap's layers load automatically */}
        
        {/* Add additional layers */}
        <GraphicsLayer />
        <FeatureLayer
          url="https://services.arcgis.com/.../FeatureServer/0"
          title="Additional Data"
        />
        
        <LayerList position="top-right" />
      </MapView>
    </WebMap>
  );
}
```

---

## Best Practices

### 1. Component vs Hook

**Use Component when:**
- ✅ Simple loading with minimal logic
- ✅ Declarative API preferred
- ✅ Single map/scene per component

```tsx
<WebMap portalItem={{ id: '...' }}>
  <MapView />
</WebMap>
```

**Use Hook when:**
- ✅ Need loading/error states
- ✅ Dynamic map selection
- ✅ Multiple views of same map
- ✅ Access to map properties

```tsx
const { webMap, loading, error } = useWebMap({ portalItem: { id: '...' } });
```

### 2. Error Handling

Always handle errors gracefully:

```tsx
const { webMap, loading, error } = useWebMap({
  portalItem: { id: mapId }
});

if (error) {
  return (
    <CalciteNotice kind="danger" open>
      <div slot="title">Failed to Load Map</div>
      <div slot="message">
        {error.message}
        <CalciteButton onClick={() => window.location.reload()}>
          Retry
        </CalciteButton>
      </div>
    </CalciteNotice>
  );
}
```

### 3. Loading States

Provide feedback during loading:

```tsx
if (loading) {
  return (
    <div className="loading-container">
      <CalciteLoader scale="l" text="Loading map..." />
      <p>This may take a few moments...</p>
    </div>
  );
}
```

### 4. Portal Item IDs

Store IDs in configuration:

```tsx
// config.ts
export const MAPS = {
  BASEMAP: 'e691172598f04ea8881cd2a4adaa45ba',
  THEMATIC: 'abc123...',
  CUSTOM: 'def456...'
};

// App.tsx
<WebMap portalItem={{ id: MAPS.BASEMAP }}>
  <MapView />
</WebMap>
```

### 5. Caching

WebMaps/WebScenes are cached by the SDK, but you can memoize the ID:

```tsx
const portalItem = useMemo(() => ({ id: mapId }), [mapId]);

const { webMap } = useWebMap({ portalItem });
```

---

## Complete Example

```tsx
import { useState, useEffect } from 'react';
import {
  WebMap,
  WebScene,
  MapView,
  SceneView,
  useWebMap,
  useWebScene,
  usePortal,
  Zoom,
  Home,
  Search,
  LayerList,
  Legend,
  BasemapToggle
} from 'react-arcgis';
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteButton,
  CalciteSelect,
  CalciteOption,
  CalciteLoader,
  CalciteNotice
} from '@esri/calcite-components-react';

function WebMapApp() {
  const [viewType, setViewType] = useState<'2d' | '3d'>('2d');
  const [mapId, setMapId] = useState('e691172598f04ea8881cd2a4adaa45ba');
  const [sceneId, setSceneId] = useState('579f97b2f3b94d4a8e48a5f140a6639b');
  
  const { webMap, loading: map2DLoading, error: map2DError } = useWebMap({
    portalItem: { id: mapId }
  });
  
  const { webScene, loading: scene3DLoading, error: scene3DError } = useWebScene({
    portalItem: { id: sceneId }
  });
  
  const loading = viewType === '2d' ? map2DLoading : scene3DLoading;
  const error = viewType === '2d' ? map2DError : scene3DError;
  
  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start" width-scale="m">
        <CalcitePanel heading="WebMap/WebScene Demo">
          <CalciteBlock heading="View Type" open>
            <CalciteSelect
              value={viewType}
              onCalciteSelectChange={(e) => setViewType(e.target.value as any)}
            >
              <CalciteOption value="2d">2D Map</CalciteOption>
              <CalciteOption value="3d">3D Scene</CalciteOption>
            </CalciteSelect>
          </CalciteBlock>
          
          {viewType === '2d' && (
            <CalciteBlock heading="Select Map" open>
              <CalciteSelect
                value={mapId}
                onCalciteSelectChange={(e) => setMapId(e.target.value)}
              >
                <CalciteOption value="e691172598f04ea8881cd2a4adaa45ba">
                  World Street Map
                </CalciteOption>
                <CalciteOption value="another-map-id">
                  Custom Map
                </CalciteOption>
              </CalciteSelect>
            </CalciteBlock>
          )}
          
          {viewType === '3d' && (
            <CalciteBlock heading="Select Scene" open>
              <CalciteSelect
                value={sceneId}
                onCalciteSelectChange={(e) => setSceneId(e.target.value)}
              >
                <CalciteOption value="579f97b2f3b94d4a8e48a5f140a6639b">
                  Buildings Scene
                </CalciteOption>
                <CalciteOption value="another-scene-id">
                  Custom Scene
                </CalciteOption>
              </CalciteSelect>
            </CalciteBlock>
          )}
          
          <CalciteBlock heading="Status" open>
            {loading && <CalciteLoader text="Loading..." />}
            {error && (
              <CalciteNotice kind="danger" open>
                <div slot="message">{error.message}</div>
              </CalciteNotice>
            )}
            {!loading && !error && (
              <CalciteNotice kind="success" open>
                <div slot="message">Loaded successfully!</div>
              </CalciteNotice>
            )}
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>
      
      <div style={{ height: '100%', position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}>
            <CalciteLoader scale="l" />
          </div>
        )}
        
        {viewType === '2d' && webMap && !loading && (
          <MapView map={webMap}>
            <Zoom position="top-left" />
            <Home position="top-left" />
            <Search position="top-right" />
            <LayerList position="top-right" />
            <Legend position="bottom-right" />
            <BasemapToggle position="bottom-left" nextBasemap="satellite" />
          </MapView>
        )}
        
        {viewType === '3d' && webScene && !loading && (
          <SceneView map={webScene}>
            <Home position="top-left" />
            <LayerList position="top-right" />
            <Legend position="bottom-right" />
          </SceneView>
        )}
      </div>
    </CalciteShell>
  );
}

export default WebMapApp;
```

---

## Finding Portal Item IDs

### ArcGIS Online
1. Open your map in ArcGIS Online
2. Look at the URL: `https://www.arcgis.com/home/webmap/viewer.html?id=ITEM_ID_HERE`
3. Copy the ID after `?id=`

### From Portal
1. Open item details page
2. Copy ID from URL or item properties

### Programmatically
```tsx
const { portal } = usePortal();

useEffect(() => {
  if (portal) {
    portal.queryItems({
      query: 'type:"Web Map" AND owner:username',
      num: 10
    }).then(result => {
      console.log('Maps:', result.results.map(item => ({
        id: item.id,
        title: item.title
      })));
    });
  }
}, [portal]);
```

---

## TypeScript Support

Full TypeScript definitions:

```tsx
import type {
  WebMapProps,
  WebSceneProps,
  UseWebMapOptions,
  UseWebSceneOptions
} from 'react-arcgis';

// Component props are fully typed
const props: WebMapProps = {
  portalItem: { id: '...' },
  onLoad: (webMap) => {
    // webMap is typed as WebMap
    console.log(webMap.portalItem.title);
  }
};
```

---

## Summary

**WebMap/WebScene support provides:**

✅ **Component API** - Declarative JSX
✅ **Hook API** - Programmatic control
✅ **Loading States** - loading, error handling
✅ **Portal Integration** - ArcGIS Online & Enterprise
✅ **Full Widget Support** - All widgets work
✅ **TypeScript** - Complete type definitions
✅ **Automatic Cleanup** - No memory leaks

**Choose the right tool:**
- Use **components** for simple, declarative loading
- Use **hooks** for complex logic and state management
- Use **Portal integration** for private/organizational content

---

**Ready to use WebMaps and WebScenes in your React app!** 🗺️
