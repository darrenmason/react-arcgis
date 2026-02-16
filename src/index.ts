// Core Components
export { Map } from './components/Map';
export { MapView } from './components/MapView';
export { SceneView } from './components/SceneView';
export { WebMap } from './components/WebMap';
export { WebScene } from './components/WebScene';

// Layer Components (23 total)
export {
  // Vector & Feature Layers
  FeatureLayer,
  GraphicsLayer,
  GeoJSONLayer,
  CSVLayer,
  StreamLayer,
  
  // Tile Layers
  TileLayer,
  VectorTileLayer,
  WebTileLayer,
  ImageryTileLayer,
  
  // Dynamic & Imagery Layers
  MapImageLayer,
  ImageryLayer,
  
  // 3D Layers
  SceneLayer,
  BuildingSceneLayer,
  IntegratedMeshLayer,
  PointCloudLayer,
  ElevationLayer,
  
  // OGC & Standards
  WMSLayer,
  WMTSLayer,
  WFSLayer,
  OGCFeatureLayer,
  KMLLayer,
  
  // Organization
  GroupLayer,
  SubtypeGroupLayer
} from './components/layers';

// Widget Components (18 total)
export {
  // Navigation & View Control
  Zoom,
  Home,
  Compass,
  Locate,
  Track,
  Fullscreen,
  
  // Information & Display
  LayerList,
  Legend,
  ScaleBar,
  
  // Search & Location
  Search,
  
  // Basemap Control
  BasemapGallery,
  BasemapToggle,
  
  // Editing & Drawing
  Editor,
  Sketch,
  
  // Data & Analysis
  FeatureTable,
  TimeSlider,
  Measurement,
  HistogramRangeSlider,
  ElevationProfile,
  
  // Advanced Tools
  Print,
  Directions,
  CoordinateConversion,
  Swipe,
  
  // Utility
  Expand
} from './components/widgets';

// All Hooks
export {
  // Core hooks
  useView,
  useGraphic,
  
  // Widget hooks
  useSearch,
  useBasemapGallery,
  useBasemapToggle,
  useSketchViewModel,
  useLayerList,
  useLegend,
  useScaleBar,
  usePopup,
  
  // Query and analysis
  useQuery,
  useGeocoding,
  
  // Portal and web maps
  usePortal,
  useWebMap,
  useWebScene,
  
  // Utility hooks
  useWatchUtils,
  useWatchWhen,
  
  // Theme hooks
  useTheme,
  useSystemTheme,
  getSystemTheme,
  useCalciteMode,
  useArcGISTheme,
  
  // Advanced/internal hooks
  useEsriModule,
  usePropertyUpdater,
  useEventHandlers,
  useLayer,
  useEsriView,
  useWidget
} from './hooks';

// Context
export { ViewProvider } from './context/ViewContext';

// Calcite Components (re-exported from @esri/calcite-components-react)
export * from './calcite';

// Types
export type {
  BaseMapProps,
  MapViewProps,
  SceneViewProps,
  LayerProps,
  FeatureLayerProps,
  GraphicsLayerProps,
  ViewContext,
  ViewType,
  Theme,
  ThemeMode,
  CalciteMode,
  ArcGISTheme
} from './types';

// Re-export layer prop types
export type { TileLayerProps } from './components/layers/TileLayer';
export type { VectorTileLayerProps } from './components/layers/VectorTileLayer';
export type { WebTileLayerProps } from './components/layers/WebTileLayer';
export type { ImageryTileLayerProps } from './components/layers/ImageryTileLayer';
export type { MapImageLayerProps } from './components/layers/MapImageLayer';
export type { ImageryLayerProps } from './components/layers/ImageryLayer';
export type { CSVLayerProps } from './components/layers/CSVLayer';
export type { StreamLayerProps } from './components/layers/StreamLayer';
export type { KMLLayerProps } from './components/layers/KMLLayer';
export type { GroupLayerProps } from './components/layers/GroupLayer';
export type { GeoJSONLayerProps } from './components/layers/GeoJSONLayer';
export type { WMSLayerProps } from './components/layers/WMSLayer';
export type { WMTSLayerProps } from './components/layers/WMTSLayer';
export type { WFSLayerProps } from './components/layers/WFSLayer';
export type { OGCFeatureLayerProps } from './components/layers/OGCFeatureLayer';
export type { SceneLayerProps } from './components/layers/SceneLayer';
export type { BuildingSceneLayerProps } from './components/layers/BuildingSceneLayer';
export type { IntegratedMeshLayerProps } from './components/layers/IntegratedMeshLayer';
export type { PointCloudLayerProps } from './components/layers/PointCloudLayer';
export type { ElevationLayerProps } from './components/layers/ElevationLayer';
export type { SubtypeGroupLayerProps } from './components/layers/SubtypeGroupLayer';
