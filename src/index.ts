// Core Components
export { Map } from './components/Map';
export { MapView } from './components/MapView';
export { SceneView } from './components/SceneView';
export { WebMap } from './components/WebMap';
export { WebScene } from './components/WebScene';

// Layer Components
export {
  FeatureLayer,
  GraphicsLayer,
  GeoJSONLayer,
  TileLayer,
  VectorTileLayer,
  MapImageLayer,
  ImageryLayer,
  CSVLayer,
  KMLLayer,
  GroupLayer
} from './components/layers';

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
export type { MapImageLayerProps } from './components/layers/MapImageLayer';
export type { ImageryLayerProps } from './components/layers/ImageryLayer';
export type { CSVLayerProps } from './components/layers/CSVLayer';
export type { KMLLayerProps } from './components/layers/KMLLayer';
export type { GroupLayerProps } from './components/layers/GroupLayer';
export type { GeoJSONLayerProps } from './components/layers/GeoJSONLayer';
