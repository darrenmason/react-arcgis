import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import type Map from '@arcgis/core/Map';
import type WebMap from '@arcgis/core/WebMap';
import type Layer from '@arcgis/core/layers/Layer';

export type ViewType = MapView | SceneView;

export interface BaseMapProps {
  basemap?: string | __esri.Basemap;
  ground?: __esri.Ground | __esri.GroundProperties | string;
  layers?: Layer[];
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (map: Map) => void;
  children?: React.ReactNode;
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
  /** Blend mode for the layer. See [GraphicsLayer blendMode](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html#blendMode). */
  blendMode?: __esri.GraphicsLayerProperties['blendMode'];
  /** Effect (e.g. CSS filter-like) applied to the layer. */
  effect?: __esri.Effect | string | null;
  /** Specifies how graphics are placed on the vertical axis (z). SceneView only. */
  elevationInfo?: __esri.ElevationInfoProperties | null;
  /** Initial graphics in the layer. Use layer.graphics.add() or addMany() for runtime updates, or pass a new array to replace. */
  graphics?: __esri.Graphic[];
  /** Unique ID for the layer. */
  id?: string;
  /** How the layer displays in the LayerList: "show" | "hide" | "hide-children". */
  listMode?: 'show' | 'hide' | 'hide-children';
  /** Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum. */
  maxScale?: number;
  /** When true, the layer can be persisted (e.g. in a web map). */
  persistenceEnabled?: boolean;
  /** Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum. */
  minScale?: number;
  /** Apply perspective scaling to screen-size symbols in SceneView. */
  screenSizePerspectiveEnabled?: boolean;
  /** Title for the layer (e.g. in LayerList). */
  title?: string | null;
  /** Time extent during which the layer is visible. */
  visibilityTimeExtent?: __esri.TimeExtentProperties | null;
}

export interface ViewContext {
  view: ViewType | null;
  map: Map | null;
}

// Re-export theme types
export type { Theme, ThemeMode, CalciteMode, ArcGISTheme } from './hooks/useTheme';
