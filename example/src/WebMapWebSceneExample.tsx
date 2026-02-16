import { useState, useEffect } from 'react';
import {
  WebMap,
  WebScene,
  MapView,
  SceneView,
  useWebMap,
  useWebScene,
  // Widgets
  Zoom,
  Home,
  Compass,
  Search,
  LayerList,
  Legend,
  BasemapToggle,
  ElevationProfile,
  GraphicsLayer
} from '../../src';
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteButton,
  CalciteSelect,
  CalciteOption,
  CalciteLoader,
  CalciteNotice,
  CalciteLabel,
  CalciteSwitch,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem
} from '@esri/calcite-components-react';

interface MapInfo {
  id: string;
  name: string;
  description: string;
}

const SAMPLE_MAPS: MapInfo[] = [
  {
    id: 'e691172598f04ea8881cd2a4adaa45ba',
    name: 'USA Topo Maps',
    description: 'Topographic map of the United States'
  },
  {
    id: '86265e5a4bbb4187a59719cf134e0018',
    name: 'World Imagery',
    description: 'Satellite imagery basemap'
  },
  {
    id: '67372ff42cd145319639a99152b15bc3',
    name: 'World Street Map',
    description: 'Detailed street map of the world'
  }
];

const SAMPLE_SCENES: MapInfo[] = [
  {
    id: '579f97b2f3b94d4a8e48a5f140a6639b',
    name: 'Campus Buildings',
    description: '3D campus visualization'
  },
  {
    id: '91b46c2b162c48dba264b2190e1dbcff',
    name: 'Urban Scene',
    description: '3D city buildings'
  }
];

type ViewMode = 'component' | 'hook';
type ViewType = '2d' | '3d';

export function WebMapWebSceneExample() {
  const [viewMode, setViewMode] = useState<ViewMode>('component');
  const [viewType, setViewType] = useState<ViewType>('2d');
  const [selectedMapId, setSelectedMapId] = useState(SAMPLE_MAPS[0].id);
  const [selectedSceneId, setSelectedSceneId] = useState(SAMPLE_SCENES[0].id);
  const [showWidgets, setShowWidgets] = useState(true);
  const [mapInfo, setMapInfo] = useState<any>(null);

  // Hook-based loading
  const { webMap, loading: mapLoading, error: mapError } = useWebMap({
    portalItem: { id: selectedMapId }
  });

  const { webScene, loading: sceneLoading, error: sceneError } = useWebScene({
    portalItem: { id: selectedSceneId }
  });

  const loading = viewType === '2d' ? mapLoading : sceneLoading;
  const error = viewType === '2d' ? mapError : sceneError;

  // Extract map info when loaded
  useEffect(() => {
    const item = viewType === '2d' ? webMap : webScene;
    if (item) {
      setMapInfo({
        title: item.portalItem?.title,
        description: item.portalItem?.description,
        owner: item.portalItem?.owner,
        layerCount: item.layers?.length || 0,
        basemapTitle: item.basemap?.title
      });
    }
  }, [webMap, webScene, viewType]);

  const renderComponentView = () => {
    if (viewType === '2d') {
      return (
        <WebMap
          portalItem={{ id: selectedMapId }}
          onLoad={(map) => {
            console.log('WebMap loaded:', map);
          }}
        >
          <MapView center={[-98.5795, 39.8283]} zoom={4}>
            {showWidgets && (
              <>
                <Zoom position="top-left" />
                <Home position="top-left" />
                <Compass position="top-left" />
                <Search position="top-right" />
                <LayerList position="top-right" />
                <Legend position="bottom-right" />
                <BasemapToggle position="bottom-left" nextBasemap="satellite" />
              </>
            )}
          </MapView>
        </WebMap>
      );
    } else {
      return (
        <WebScene
          portalItem={{ id: selectedSceneId }}
          onLoad={(scene) => {
            console.log('WebScene loaded:', scene);
          }}
        >
          <SceneView>
            {showWidgets && (
              <>
                <Home position="top-left" />
                <Compass position="top-left" />
                <LayerList position="top-right" />
                <Legend position="bottom-right" />
                <ElevationProfile position="bottom" unit="metric" />
              </>
            )}
          </SceneView>
        </WebScene>
      );
    }
  };

  const renderHookView = () => {
    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '1rem'
          }}
        >
          <CalciteLoader scale="l" />
          <p>Loading {viewType === '2d' ? 'map' : 'scene'}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: '2rem' }}>
          <CalciteNotice kind="danger" open>
            <div slot="title">Failed to Load {viewType === '2d' ? 'Map' : 'Scene'}</div>
            <div slot="message">
              {error.message}
              <br />
              <CalciteButton
                style={{ marginTop: '0.5rem' }}
                onClick={() => window.location.reload()}
              >
                Retry
              </CalciteButton>
            </div>
          </CalciteNotice>
        </div>
      );
    }

    if (viewType === '2d' && webMap) {
      return (
        <MapView map={webMap} center={[-98.5795, 39.8283]} zoom={4}>
          {showWidgets && (
            <>
              <Zoom position="top-left" />
              <Home position="top-left" />
              <Compass position="top-left" />
              <Search position="top-right" />
              <LayerList position="top-right" />
              <Legend position="bottom-right" />
              <BasemapToggle position="bottom-left" nextBasemap="satellite" />
            </>
          )}
        </MapView>
      );
    }

    if (viewType === '3d' && webScene) {
      return (
        <SceneView map={webScene}>
          {showWidgets && (
            <>
              <Home position="top-left" />
              <Compass position="top-left" />
              <LayerList position="top-right" />
              <Legend position="bottom-right" />
              <ElevationProfile position="bottom" unit="metric" />
            </>
          )}
        </SceneView>
      );
    }

    return null;
  };

  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start" width-scale="m">
        <CalcitePanel heading="WebMap/WebScene Demo">
          <CalciteBlock heading="API Type" open>
            <CalciteSegmentedControl width="full">
              <CalciteSegmentedControlItem
                value="component"
                checked={viewMode === 'component'}
                onClick={() => setViewMode('component')}
              >
                Component
              </CalciteSegmentedControlItem>
              <CalciteSegmentedControlItem
                value="hook"
                checked={viewMode === 'hook'}
                onClick={() => setViewMode('hook')}
              >
                Hook
              </CalciteSegmentedControlItem>
            </CalciteSegmentedControl>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--calcite-color-text-3)' }}>
              {viewMode === 'component' 
                ? 'Using <WebMap> / <WebScene> components'
                : 'Using useWebMap() / useWebScene() hooks'}
            </p>
          </CalciteBlock>

          <CalciteBlock heading="View Type" open>
            <CalciteSegmentedControl width="full">
              <CalciteSegmentedControlItem
                value="2d"
                checked={viewType === '2d'}
                onClick={() => setViewType('2d')}
              >
                2D Map
              </CalciteSegmentedControlItem>
              <CalciteSegmentedControlItem
                value="3d"
                checked={viewType === '3d'}
                onClick={() => setViewType('3d')}
              >
                3D Scene
              </CalciteSegmentedControlItem>
            </CalciteSegmentedControl>
          </CalciteBlock>

          {viewType === '2d' && (
            <CalciteBlock heading="Select WebMap" open>
              <CalciteSelect
                label="Choose a map"
                value={selectedMapId}
                onCalciteSelectChange={(e) => setSelectedMapId(e.target.value)}
              >
                {SAMPLE_MAPS.map((map) => (
                  <CalciteOption key={map.id} value={map.id}>
                    {map.name}
                  </CalciteOption>
                ))}
              </CalciteSelect>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--calcite-color-text-3)' }}>
                {SAMPLE_MAPS.find(m => m.id === selectedMapId)?.description}
              </p>
            </CalciteBlock>
          )}

          {viewType === '3d' && (
            <CalciteBlock heading="Select WebScene" open>
              <CalciteSelect
                label="Choose a scene"
                value={selectedSceneId}
                onCalciteSelectChange={(e) => setSelectedSceneId(e.target.value)}
              >
                {SAMPLE_SCENES.map((scene) => (
                  <CalciteOption key={scene.id} value={scene.id}>
                    {scene.name}
                  </CalciteOption>
                ))}
              </CalciteSelect>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--calcite-color-text-3)' }}>
                {SAMPLE_SCENES.find(s => s.id === selectedSceneId)?.description}
              </p>
            </CalciteBlock>
          )}

          <CalciteBlock heading="Options" open>
            <CalciteLabel layout="inline">
              Show Widgets
              <CalciteSwitch
                checked={showWidgets}
                onCalciteSwitchChange={() => setShowWidgets(!showWidgets)}
              />
            </CalciteLabel>
          </CalciteBlock>

          {mapInfo && (
            <CalciteBlock heading="Map Info" collapsible>
              <div style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                <p><strong>Title:</strong> {mapInfo.title}</p>
                {mapInfo.description && (
                  <p><strong>Description:</strong> {mapInfo.description}</p>
                )}
                {mapInfo.owner && (
                  <p><strong>Owner:</strong> {mapInfo.owner}</p>
                )}
                <p><strong>Layers:</strong> {mapInfo.layerCount}</p>
                {mapInfo.basemapTitle && (
                  <p><strong>Basemap:</strong> {mapInfo.basemapTitle}</p>
                )}
              </div>
            </CalciteBlock>
          )}

          {viewMode === 'hook' && (
            <CalciteBlock heading="Status" open>
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalciteLoader scale="s" />
                  <span>Loading...</span>
                </div>
              )}
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
          )}

          <CalciteBlock heading="How It Works" collapsible>
            <div style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
              {viewMode === 'component' ? (
                <>
                  <p><strong>Component API:</strong></p>
                  <pre style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`<${viewType === '2d' ? 'WebMap' : 'WebScene'}
  portalItem={{ id: '...' }}
  onLoad={(item) => {...}}
>
  <${viewType === '2d' ? 'MapView' : 'SceneView'}>
    <Zoom />
    <Home />
  </${viewType === '2d' ? 'MapView' : 'SceneView'}>
</${viewType === '2d' ? 'WebMap' : 'WebScene'}>`}
                  </pre>
                </>
              ) : (
                <>
                  <p><strong>Hook API:</strong></p>
                  <pre style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`const { ${viewType === '2d' ? 'webMap' : 'webScene'}, loading, error } = 
  use${viewType === '2d' ? 'WebMap' : 'WebScene'}({
    portalItem: { id: '...' }
  });

if (loading) return <Loader />;
if (error) return <Error />;

return (
  <${viewType === '2d' ? 'MapView' : 'SceneView'} 
    map={${viewType === '2d' ? 'webMap' : 'webScene'}}
  />
);`}
                  </pre>
                </>
              )}
            </div>
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>

      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        {viewMode === 'component' ? renderComponentView() : renderHookView()}
      </div>
    </CalciteShell>
  );
}

export default WebMapWebSceneExample;
