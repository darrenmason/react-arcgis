export interface ComponentDoc {
  name: string;
  description: string;
  category: string;
  exampleCode: string;
  props: PropDoc[];
  instructions: string[];
}

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export const componentDocs: ComponentDoc[] = [
  {
    name: 'Map',
    description: 'The base Map component that wraps the ArcGIS Map class. This is the root component for all map-based visualizations.',
    category: 'Core Components',
    exampleCode: `import { Map, MapView } from 'react-arcgis';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </div>
  );
}`,
    props: [
      {
        name: 'basemap',
        type: 'string',
        required: false,
        default: "'topo-vector'",
        description: 'The basemap style to use. Common values: "streets-vector", "topo-vector", "gray-vector", "satellite", etc.'
      },
      {
        name: 'ground',
        type: 'string',
        required: false,
        description: 'The ground surface for 3D scenes. Common values: "world-elevation", "world-topobathymetry"'
      },
      {
        name: 'layers',
        type: 'Layer[]',
        required: false,
        description: 'Array of layer instances to add to the map'
      },
      {
        name: 'onLoad',
        type: '(map: EsriMap) => void',
        required: false,
        description: 'Callback function called when the map is loaded'
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Child components (typically MapView or SceneView)'
      }
    ],
    instructions: [
      'Wrap your MapView or SceneView component inside the Map component',
      'Set the basemap prop to choose your map style',
      'Use the onLoad callback to access the underlying ArcGIS Map instance',
      'Add layers either via the layers prop or as child components'
    ]
  },
  {
    name: 'MapView',
    description: 'A 2D map view component that displays a Map instance. This is the primary component for 2D mapping applications.',
    category: 'Core Components',
    exampleCode: `import { Map, MapView } from 'react-arcgis';

function MyMap() {
  return (
    <Map basemap="streets-vector">
      <MapView 
        center={[-118.805, 34.027]} 
        zoom={13}
        onClick={(event) => {
          console.log('Clicked:', event.mapPoint);
        }}
      />
    </Map>
  );
}`,
    props: [
      {
        name: 'center',
        type: '[number, number]',
        required: false,
        description: 'Initial center point as [longitude, latitude]'
      },
      {
        name: 'zoom',
        type: 'number',
        required: false,
        description: 'Initial zoom level (typically 1-20)'
      },
      {
        name: 'extent',
        type: 'Extent',
        required: false,
        description: 'Initial extent of the map view'
      },
      {
        name: 'onClick',
        type: '(event: ViewClickEvent) => void',
        required: false,
        description: 'Callback for map click events'
      },
      {
        name: 'onLoad',
        type: '(view: MapView) => void',
        required: false,
        description: 'Callback when the view is loaded'
      }
    ],
    instructions: [
      'Must be a child of the Map component',
      'Set center and zoom for initial map position',
      'Use onClick to handle user interactions',
      'Add layer components as children to display data'
    ]
  },
  {
    name: 'FeatureLayer',
    description: 'Displays feature data from a feature service or feature collection. Supports popups, styling, and queries.',
    category: 'Layers',
    exampleCode: `import { Map, MapView, FeatureLayer } from 'react-arcgis';

function DataMap() {
  return (
    <Map basemap="streets-vector">
      <MapView center={[-98, 39]} zoom={4}>
        <FeatureLayer
          url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
          popupTemplate={{
            title: '{NAME}',
            content: 'Population: {POP2020}'
          }}
        />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'url',
        type: 'string',
        required: false,
        description: 'URL to the feature service or feature layer'
      },
      {
        name: 'portalItem',
        type: 'PortalItemProperties',
        required: false,
        description: 'Portal item (e.g. { id }) to load the layer from ArcGIS Online or Enterprise'
      },
      {
        name: 'fields',
        type: 'Field[]',
        required: false,
        description: 'Array of field definitions for the layer'
      },
      {
        name: 'geometryType',
        type: '"point" | "polyline" | "polygon" | "multipoint"',
        required: false,
        description: 'Geometry type of the features'
      },
      {
        name: 'objectIdField',
        type: 'string',
        required: false,
        description: 'Name of the object ID field'
      },
      {
        name: 'definitionExpression',
        type: 'string',
        required: false,
        description: 'SQL where clause to filter features'
      },
      {
        name: 'outFields',
        type: 'string[]',
        required: false,
        default: '["*"]',
        description: 'Fields to include in queries and popups'
      },
      {
        name: 'popupTemplate',
        type: 'PopupTemplate',
        required: false,
        description: 'Template for popup display when features are clicked'
      },
      {
        name: 'renderer',
        type: 'Renderer',
        required: false,
        description: 'Renderer for styling features'
      },
      {
        name: 'opacity',
        type: 'number',
        required: false,
        default: '1',
        description: 'Layer opacity (0-1)'
      },
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Whether the layer is visible'
      },
      {
        name: 'onLoad',
        type: '(layer: FeatureLayer) => void',
        required: false,
        description: 'Callback when layer is loaded'
      }
    ],
    instructions: [
      'Must be a child of MapView or SceneView',
      'Provide a valid feature service URL',
      'Use popupTemplate to customize popup content',
      'Use renderer to style features based on attributes'
    ]
  },
  {
    name: 'Zoom',
    description: 'A widget that provides zoom in and zoom out buttons for the map view.',
    category: 'Widgets',
    exampleCode: `import { Map, MapView, Zoom } from 'react-arcgis';

function MapWithZoom() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <Zoom position="top-left" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'position',
        type: 'string',
        required: false,
        default: "'top-right'",
        description: 'Position of the widget. Options: "top-left", "top-right", "bottom-left", "bottom-right"'
      },
      {
        name: 'onLoad',
        type: '(widget: Zoom) => void',
        required: false,
        description: 'Callback when widget is loaded'
      }
    ],
    instructions: [
      'Place as a child of MapView or SceneView',
      'Set position to control widget placement',
      'Widget automatically connects to the parent view'
    ]
  },
  {
    name: 'Home',
    description: 'A widget that provides a button to return the view to its initial extent.',
    category: 'Widgets',
    exampleCode: `import { Map, MapView, Home } from 'react-arcgis';

function MapWithHome() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <Home position="top-left" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'position',
        type: 'string',
        required: false,
        default: "'top-right'",
        description: 'Position of the widget'
      },
      {
        name: 'onLoad',
        type: '(widget: Home) => void',
        required: false,
        description: 'Callback when widget is loaded'
      }
    ],
    instructions: [
      'Place as a child of MapView or SceneView',
      'Clicking the button returns to the initial view extent',
      'Works automatically with the parent view'
    ]
  },
  {
    name: 'Search',
    description: 'A widget that provides search functionality to find locations and features on the map.',
    category: 'Widgets',
    exampleCode: `import { Map, MapView, Search } from 'react-arcgis';

function SearchableMap() {
  return (
    <Map basemap="streets-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <Search position="top-right" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'position',
        type: 'string',
        required: false,
        default: "'top-right'",
        description: 'Position of the widget'
      },
      {
        name: 'sources',
        type: 'SearchSource[]',
        required: false,
        description: 'Custom search sources'
      },
      {
        name: 'onLoad',
        type: '(widget: Search) => void',
        required: false,
        description: 'Callback when widget is loaded'
      }
    ],
    instructions: [
      'Place as a child of MapView or SceneView',
      'Uses default geocoding service by default',
      'Can be configured with custom search sources'
    ]
  },
  {
    name: 'LayerList',
    description: 'A widget that displays a list of layers in the map and allows users to toggle visibility and access layer properties.',
    category: 'Widgets',
    exampleCode: `import { Map, MapView, FeatureLayer, LayerList } from 'react-arcgis';

function MapWithLayers() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <FeatureLayer url="..." />
        <LayerList position="top-right" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'position',
        type: 'string',
        required: false,
        default: "'top-right'",
        description: 'Position of the widget'
      },
      {
        name: 'onLoad',
        type: '(widget: LayerList) => void',
        required: false,
        description: 'Callback when widget is loaded'
      }
    ],
    instructions: [
      'Place as a child of MapView or SceneView',
      'Automatically lists all layers in the map',
      'Users can toggle visibility and access layer properties'
    ]
  },
  {
    name: 'Legend',
    description: 'A widget that displays the legend for all layers in the map.',
    category: 'Widgets',
    exampleCode: `import { Map, MapView, FeatureLayer, Legend } from 'react-arcgis';

function MapWithLegend() {
  return (
    <Map basemap="gray-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <FeatureLayer url="..." />
        <Legend position="bottom-left" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'position',
        type: 'string',
        required: false,
        default: "'top-right'",
        description: 'Position of the widget'
      },
      {
        name: 'onLoad',
        type: '(widget: Legend) => void',
        required: false,
        description: 'Callback when widget is loaded'
      }
    ],
    instructions: [
      'Place as a child of MapView or SceneView',
      'Automatically displays legend for all visible layers',
      'Updates when layers change'
    ]
  },
  {
    name: 'TileLayer',
    description: 'Displays tiled map services, including cached map services and tile packages.',
    category: 'Layers',
    exampleCode: `import { Map, MapView, TileLayer } from 'react-arcgis';

function TileMap() {
  return (
    <Map>
      <MapView center={[-118, 34]} zoom={10}>
        <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'url',
        type: 'string | null',
        required: false,
        description: 'URL of the REST endpoint of the tile service'
      },
      {
        name: 'portalItem',
        type: 'PortalItemProperties',
        required: false,
        description: 'Portal item (e.g. { id }) to load the layer from ArcGIS Online or Enterprise'
      },
      {
        name: 'apiKey',
        type: 'string | null',
        required: false,
        description: 'API key appended to all requests for the layer'
      },
      {
        name: 'blendMode',
        type: 'string',
        required: false,
        description: 'Blend mode (e.g. "normal", "multiply", "screen"). See TileLayer blendMode in the API.'
      },
      {
        name: 'copyright',
        type: 'string | null',
        required: false,
        description: 'Copyright text as defined by the service'
      },
      {
        name: 'customParameters',
        type: 'Record<string, string> | null',
        required: false,
        description: 'Custom parameters appended to the URL of all resources fetched by the layer'
      },
      {
        name: 'effect',
        type: 'Effect | string | null',
        required: false,
        description: 'CSS filter-like effect applied to the layer'
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unique ID for the layer'
      },
      {
        name: 'legendEnabled',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Whether the layer is included in the legend'
      },
      {
        name: 'listMode',
        type: '"show" | "hide" | "hide-children"',
        required: false,
        description: 'How the layer displays in the LayerList component'
      },
      {
        name: 'maxScale',
        type: 'number',
        required: false,
        description: 'Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum.'
      },
      {
        name: 'minScale',
        type: 'number',
        required: false,
        description: 'Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum.'
      },
      {
        name: 'persistenceEnabled',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Enable persistence of the layer in a WebMap or WebScene'
      },
      {
        name: 'refreshInterval',
        type: 'number',
        required: false,
        default: '0',
        description: 'Refresh interval in minutes. 0 = no refresh.'
      },
      {
        name: 'resampling',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'When true, tiles are resampled at lower LOD when not available'
      },
      {
        name: 'tileInfo',
        type: 'TileInfo',
        required: false,
        description: 'Tiling scheme for the layer'
      },
      {
        name: 'tileServers',
        type: 'string[]',
        required: false,
        description: 'Array of tile server URLs for changing map tiles'
      },
      {
        name: 'title',
        type: 'string | null',
        required: false,
        description: 'Title for the layer (e.g. in Legend, LayerList)'
      },
      {
        name: 'visibilityTimeExtent',
        type: 'TimeExtentProperties | null',
        required: false,
        description: 'Time extent during which the layer is visible'
      },
      {
        name: 'opacity',
        type: 'number',
        required: false,
        default: '1',
        description: 'Layer opacity (0-1)'
      },
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Whether the layer is visible'
      },
      {
        name: 'onLoad',
        type: '(layer: TileLayer) => void',
        required: false,
        description: 'Callback when layer is loaded'
      }
    ],
    instructions: [
      'Must be a child of MapView or SceneView',
      'Provide url or portalItem for the tile service',
      'Tile layers are cached and load quickly'
    ]
  },
  {
    name: 'GraphicsLayer',
    description: 'A layer for displaying graphics, such as points, lines, and polygons drawn by users or added programmatically.',
    category: 'Layers',
    exampleCode: `import { Map, MapView, GraphicsLayer } from 'react-arcgis';

function GraphicsMap() {
  return (
    <Map basemap="streets-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <GraphicsLayer />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'graphics',
        type: 'Graphic[]',
        required: false,
        description: 'Initial graphics in the layer. Pass a new array to replace; use layer.graphics.add() for incremental updates.'
      },
      {
        name: 'blendMode',
        type: 'string',
        required: false,
        description: 'Blend mode (e.g. "normal", "multiply", "screen"). See GraphicsLayer blendMode in the API.'
      },
      {
        name: 'effect',
        type: 'Effect | string | null',
        required: false,
        description: 'CSS filter-like effect applied to the layer.'
      },
      {
        name: 'elevationInfo',
        type: 'ElevationInfoProperties | null',
        required: false,
        description: 'How graphics are placed on the vertical axis (z). SceneView only.'
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unique ID for the layer.'
      },
      {
        name: 'listMode',
        type: '"show" | "hide" | "hide-children"',
        required: false,
        description: 'How the layer displays in the LayerList component.'
      },
      {
        name: 'maxScale',
        type: 'number',
        required: false,
        description: 'Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum.'
      },
      {
        name: 'minScale',
        type: 'number',
        required: false,
        description: 'Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum.'
      },
      {
        name: 'persistenceEnabled',
        type: 'boolean',
        required: false,
        description: 'When true, the layer can be persisted (e.g. in a web map).'
      },
      {
        name: 'screenSizePerspectiveEnabled',
        type: 'boolean',
        required: false,
        description: 'Apply perspective scaling to screen-size symbols in SceneView.'
      },
      {
        name: 'title',
        type: 'string | null',
        required: false,
        description: 'Title for the layer (e.g. in LayerList).'
      },
      {
        name: 'visibilityTimeExtent',
        type: 'TimeExtentProperties | null',
        required: false,
        description: 'Time extent during which the layer is visible.'
      },
      {
        name: 'opacity',
        type: 'number',
        required: false,
        default: '1',
        description: 'Layer opacity (0-1)'
      },
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Whether the layer is visible'
      },
      {
        name: 'onLoad',
        type: '(layer: GraphicsLayer) => void',
        required: false,
        description: 'Callback when layer is loaded'
      }
    ],
    instructions: [
      'Must be a child of MapView or SceneView',
      'Use graphics prop for initial/replacement graphics or useGraphic + onLoad for incremental adds',
      'Commonly used for user drawings and temporary features'
    ]
  },
  {
    name: 'GeoJSONLayer',
    description: 'Displays GeoJSON data as a feature layer on the map.',
    category: 'Layers',
    exampleCode: `import { Map, MapView, GeoJSONLayer } from 'react-arcgis';

function GeoJSONMap() {
  const geojson = {
    type: 'FeatureCollection',
    features: [/* ... */]
  };

  return (
    <Map basemap="gray-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <GeoJSONLayer url="https://example.com/data.geojson" />
      </MapView>
    </Map>
  );
}`,
    props: [
      {
        name: 'url',
        type: 'string',
        required: false,
        description: 'URL to GeoJSON file'
      },
      {
        name: 'data',
        type: 'GeoJSON',
        required: false,
        description: 'GeoJSON data object'
      },
      {
        name: 'renderer',
        type: 'Renderer',
        required: false,
        description: 'Renderer for styling features'
      },
      {
        name: 'onLoad',
        type: '(layer: GeoJSONLayer) => void',
        required: false,
        description: 'Callback when layer is loaded'
      }
    ],
    instructions: [
      'Must be a child of MapView or SceneView',
      'Provide either url or data prop',
      'Supports all standard GeoJSON geometry types'
    ]
  },
  {
    name: 'SceneView',
    description: 'A 3D map view component that displays a Map instance in 3D. Used for 3D visualizations and scenes.',
    category: 'Core Components',
    exampleCode: `import { Map, SceneView } from 'react-arcgis';

function Scene3D() {
  return (
    <Map ground="world-elevation">
      <SceneView
        camera={{
          position: {
            x: -118.805,
            y: 34.027,
            z: 5000
          },
          heading: 45,
          tilt: 75
        }}
      />
    </Map>
  );
}`,
    props: [
      {
        name: 'camera',
        type: 'Camera',
        required: false,
        description: 'Initial camera position and orientation'
      },
      {
        name: 'onLoad',
        type: '(view: SceneView) => void',
        required: false,
        description: 'Callback when the view is loaded'
      }
    ],
    instructions: [
      'Must be a child of the Map component',
      'Set camera for initial 3D view position',
      'Use elevation layers for 3D terrain',
      'Add 3D layers like SceneLayer as children'
    ]
  },
  {
    name: 'WebMap',
    description: 'Loads a web map from ArcGIS Online or Portal. Web maps contain all configuration including layers, styles, and popups.',
    category: 'Core Components',
    exampleCode: `import { WebMap } from 'react-arcgis';

function PortalMap() {
  return (
    <WebMap
      portalItem={{
        id: 'e691172598f04ea8881cd2a4adaa45ba'
      }}
    />
  );
}`,
    props: [
      {
        name: 'portalItem',
        type: '{ id: string }',
        required: true,
        description: 'Portal item ID for the web map'
      },
      {
        name: 'onLoad',
        type: '(webMap: WebMap) => void',
        required: false,
        description: 'Callback when web map is loaded'
      }
    ],
    instructions: [
      'Provide a valid portal item ID',
      'Web maps include all configuration',
      'No need to manually add layers or configure popups'
    ]
  },
  {
    name: 'WebScene',
    description: 'Loads a web scene from ArcGIS Online or Portal. Web scenes contain 3D configuration including layers and camera settings.',
    category: 'Core Components',
    exampleCode: `import { WebScene } from 'react-arcgis';

function PortalScene() {
  return (
    <WebScene
      portalItem={{
        id: '3a9976baef9240ab8645ee25c7e9c096'
      }}
    />
  );
}`,
    props: [
      {
        name: 'portalItem',
        type: '{ id: string }',
        required: true,
        description: 'Portal item ID for the web scene'
      },
      {
        name: 'onLoad',
        type: '(webScene: WebScene) => void',
        required: false,
        description: 'Callback when web scene is loaded'
      }
    ],
    instructions: [
      'Provide a valid portal item ID',
      'Web scenes include 3D configuration',
      'Automatically sets up camera and layers'
    ]
  },
  {
    name: 'useView',
    description: 'Hook to access the current MapView or SceneView instance. Useful for programmatic control of the view.',
    category: 'Hooks',
    exampleCode: `import { Map, MapView, useView } from 'react-arcgis';

function MapContent() {
  const { view } = useView();
  
  const goToLocation = () => {
    if (view) {
      view.goTo({
        center: [-122.4, 37.8],
        zoom: 12
      });
    }
  };
  
  return (
    <>
      <button onClick={goToLocation}>Go to San Francisco</button>
    </>
  );
}

function App() {
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118, 34]} zoom={10}>
        <MapContent />
      </MapView>
    </Map>
  );
}`,
    props: [],
    instructions: [
      'Must be called inside a component that is a child of MapView or SceneView',
      'Returns an object with the view instance',
      'Use for programmatic control: goTo, zoom, pan, etc.'
    ]
  },
  {
    name: 'useGraphic',
    description: 'Hook to create and manage graphics. Returns a graphic instance that can be added to a GraphicsLayer.',
    category: 'Hooks',
    exampleCode: `import { Map, MapView, GraphicsLayer, useGraphic } from 'react-arcgis';
import { useEffect } from 'react';

function MapWithGraphic() {
  const [layer, setLayer] = useState(null);
  
  const point = useGraphic({
    geometry: {
      type: 'point',
      longitude: -118.805,
      latitude: 34.027
    },
    symbol: {
      type: 'simple-marker',
      color: 'red',
      size: 10
    }
  });
  
  useEffect(() => {
    if (layer && point) {
      layer.add(point);
    }
  }, [layer, point]);
  
  return (
    <Map basemap="streets-vector">
      <MapView center={[-118.805, 34.027]} zoom={13}>
        <GraphicsLayer onLoad={setLayer} />
      </MapView>
    </Map>
  );
}`,
    props: [],
    instructions: [
      'Returns a graphic instance based on the provided configuration',
      'Add the graphic to a GraphicsLayer using layer.add()',
      'Graphics update reactively when configuration changes'
    ]
  },
  {
    name: 'useQueryFeatures',
    description: 'Hook for querying features from a feature layer. Provides loading state and results.',
    category: 'Hooks',
    exampleCode: `import { Map, MapView, FeatureLayer, useQueryFeatures } from 'react-arcgis';
import { useState } from 'react';

function QueryMap() {
  const [layer, setLayer] = useState(null);
  const { query, loading, results } = useQueryFeatures(layer);
  
  const handleQuery = async () => {
    const features = await query({
      where: "POP2020 > 1000000",
      outFields: ['NAME', 'POP2020']
    });
  };
  
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118, 34]} zoom={8}>
        <FeatureLayer url="..." onLoad={setLayer} />
        <button onClick={handleQuery} disabled={loading}>
          Query Large Cities
        </button>
      </MapView>
    </Map>
  );
}`,
    props: [],
    instructions: [
      'Pass a feature layer instance to the hook',
      'Use the query function to execute queries',
      'Access loading state and results from the hook return value'
    ]
  }
];
