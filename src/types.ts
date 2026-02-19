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
  /** API key for the layer (appended to requests). */
  apiKey?: string | null;
  /** Attribute table template for the layer's FeatureTable. */
  attributeTableTemplate?: __esri.AttributeTableTemplateProperties | null;
  /** Blend mode for the layer. See FeatureLayer blendMode in the API. */
  blendMode?: __esri.FeatureLayerProperties['blendMode'];
  /** Copyright information for the layer. */
  copyright?: string | null;
  /** Custom parameters appended to all layer request URLs. */
  customParameters?: Record<string, string> | null;
  /** Time zone that dates are stored in (e.g. "America/New_York"). */
  dateFieldsTimeZone?: string | null;
  /** SQL where clause used to filter features on the client. */
  definitionExpression?: string | null;
  /** Name of the layer's primary display field. */
  displayField?: string | null;
  /** Whether the layer's displayFilterInfo is applied when rendering. */
  displayFilterEnabled?: boolean;
  /** Display filter (visibility) for the layer. */
  displayFilterInfo?: __esri.DisplayFilterInfoProperties | null;
  /** Dynamic data source for map service sublayers or workspace data. */
  dynamicDataSource?: __esri.DynamicDataLayer | null;
  /** CSS filter-like effect applied to the layer. */
  effect?: __esri.Effect | string | null;
  /** How features are placed on the vertical axis (z). SceneView only. */
  elevationInfo?: __esri.ElevationInfoProperties | null;
  /** Feature effect (filter + included/excluded effects). */
  featureEffect?: __esri.FeatureEffectProperties | null;
  /** Feature reduction (cluster, binning, selection). */
  featureReduction?: __esri.FeatureReductionBinning | __esri.FeatureReductionCluster | __esri.FeatureReductionSelection | null;
  /** Field configurations for popups and UI. */
  fieldConfigurations?: __esri.FieldConfigurationProperties[] | null;
  /** Array of field definitions for the layer. */
  fields?: __esri.Field[];
  /** Floor info for floor-aware layers. */
  floorInfo?: __esri.LayerFloorInfoProperties | null;
  /** Form template for FeatureForm. */
  formTemplate?: __esri.FormTemplateProperties | null;
  /** Geodatabase version for versioned services. */
  gdbVersion?: string | null;
  /** Geometry type of features; null for non-spatial tables. */
  geometryType?: __esri.FeatureLayerProperties['geometryType'];
  /** Name of the global ID field. */
  globalIdField?: string | null;
  /** Whether client-side features have M values. */
  hasM?: boolean;
  /** Whether client-side features have Z values. */
  hasZ?: boolean;
  /** Historic moment to query. */
  historicMoment?: Date | __esri.DateProperties | null;
  /** Unique ID for the layer. */
  id?: string;
  /** Label definition (array of LabelClass). */
  labelingInfo?: __esri.LabelClassProperties[] | null;
  /** Whether to display labels. */
  labelsVisible?: boolean;
  /** Layer ID / index when loading from portalItem or service URL. */
  layerId?: number | null;
  /** Whether the layer is included in the legend. */
  legendEnabled?: boolean;
  /** How the layer displays in the LayerList. */
  listMode?: 'show' | 'hide' | 'hide-children';
  /** Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum. */
  maxScale?: number;
  /** Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum. */
  minScale?: number;
  /** Name of the object ID field. */
  objectIdField?: string;
  /** Order in which features are drawn (e.g. by field). */
  orderBy?: __esri.OrderByInfoProperties[] | null;
  /** Field names to include with each feature (e.g. ["*"]). */
  outFields?: string[] | null;
  /** Whether the layer can be persisted in WebMap/WebScene. */
  persistenceEnabled?: boolean;
  /** Whether to display popups when features are clicked. */
  popupEnabled?: boolean;
  /** Popup template for the layer. */
  popupTemplate?: __esri.PopupTemplateProperties | null;
  /** Portal item (e.g. { id }) to load the layer from. */
  portalItem?: __esri.PortalItemProperties;
  /** Refresh interval in minutes. 0 = no refresh. */
  refreshInterval?: number;
  /** Renderer for styling features. */
  renderer?: __esri.RendererProperties | null;
  /** Whether M values will be returned. */
  returnM?: boolean | null;
  /** Whether Z values will be returned. */
  returnZ?: boolean | null;
  /** Apply perspective scaling to screen-size symbols in SceneView. */
  screenSizePerspectiveEnabled?: boolean;
  /** Client-side graphics to create the layer from (alternative to url/portalItem). */
  source?: __esri.Graphic[] | __esri.Collection<__esri.Graphic>;
  /** Time extent for the layer. */
  timeExtent?: __esri.TimeExtentProperties | null;
  /** Time info (start/end fields, fullTimeExtent). */
  timeInfo?: __esri.TimeInfoProperties | null;
  /** Temporary time offset for the layer. */
  timeOffset?: __esri.TimeIntervalProperties | null;
  /** Title for the layer (e.g. in Legend, LayerList). */
  title?: string | null;
  /** Track info for rendering track data. */
  trackInfo?: __esri.TrackInfoProperties | null;
  /** Name of the field holding the type ID for features. */
  typeIdField?: string | null;
  /** Array of feature types from the service. */
  types?: __esri.FeatureTypeProperties[] | null;
  /** URL of the REST endpoint of the layer or service. */
  url?: string | null;
  /** Whether temporal data follows the view's timeExtent. */
  useViewTime?: boolean;
  /** Time extent during which the layer is visible. */
  visibilityTimeExtent?: __esri.TimeExtentProperties | null;
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
