import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import type Map from '@arcgis/core/Map';
import type WebMap from '@arcgis/core/WebMap';
import type Layer from '@arcgis/core/layers/Layer';

export type ViewType = MapView | SceneView;

export interface BaseMapProps {
  basemap?: string | __esri.Basemap;
  ground?: __esri.Ground;
  layers?: Layer[];
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (map: Map) => void;
}

export interface MapViewProps {
  map?: Map | WebMap;
  container?: HTMLDivElement | string;
  center?: __esri.PointProperties | number[];
  zoom?: number;
  scale?: number;
  extent?: __esri.ExtentProperties;
  rotation?: number;
  ui?: {
    components?: string[];
    position?: string;
  };
  constraints?: __esri.View2DConstraints;
  onLoad?: (view: MapView) => void;
  onViewReady?: (view: MapView) => void;
  onClick?: (event: __esri.ViewClickEvent) => void;
  onPointerMove?: (event: __esri.ViewPointerMoveEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface SceneViewProps {
  map?: Map | WebMap;
  container?: HTMLDivElement | string;
  center?: __esri.PointProperties | number[];
  zoom?: number;
  scale?: number;
  camera?: __esri.CameraProperties;
  viewingMode?: 'global' | 'local';
  onLoad?: (view: SceneView) => void;
  onViewReady?: (view: SceneView) => void;
  onClick?: (event: __esri.ViewClickEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface LayerProps {
  map?: Map;
  view?: ViewType;
  visible?: boolean;
  opacity?: number;
  onLoad?: (layer: Layer) => void;
}

export interface FeatureLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  fields?: __esri.Field[];
  geometryType?: 'point' | 'polyline' | 'polygon' | 'multipoint';
  objectIdField?: string;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
  definitionExpression?: string;
  outFields?: string[];
}

export interface GraphicsLayerProps extends LayerProps {
  graphics?: __esri.Graphic[];
  elevationInfo?: any;
}

export interface ViewContext {
  view: ViewType | null;
  map: Map | null;
}

// Re-export theme types
export type { Theme, ThemeMode, CalciteMode, ArcGISTheme } from './hooks/useTheme';
