// Core hooks
export { useView } from '../context/ViewContext';
export { useGraphic } from './useGraphic';

// Widget hooks
export { useSearch } from './useSearch';
export { useBasemapGallery } from './useBasemapGallery';
export { useBasemapToggle } from './useBasemapToggle';
export { useSketchViewModel } from './useSketchViewModel';
export { useLayerList } from './useLayerList';
export { useLegend } from './useLegend';
export { useScaleBar } from './useScaleBar';
export { usePopup } from './usePopup';

// Query and analysis hooks
export { useQuery } from './useQuery';
export { useGeocoding } from './useGeocoding';

// Portal and web maps
export { usePortal } from './usePortal';
export { useWebMap } from './useWebMap';
export { useWebScene } from './useWebScene';

// Query & Analysis hooks
export { useQueryFeatures } from './useQueryFeatures';
export { useStatistics } from './useStatistics';
export { useSpatialQuery } from './useSpatialQuery';
export { useIdentify } from './useIdentify';
export { useBufferAnalysis } from './useBufferAnalysis';
export { useGeometryMeasurement } from './useGeometryMeasurement';
export { useRouteAnalysis } from './useRouteAnalysis';
export { useClosestFacility } from './useClosestFacility';

// Utility hooks
export { useWatchUtils, useWatchWhen } from './useWatchUtils';

// Internal/advanced hooks
export { useEsriModule } from './useEsriModule';
export { usePropertyUpdater } from './usePropertyUpdater';
export { useEventHandlers } from './useEventHandlers';
export { useLayer } from './useLayer';
export { useEsriView } from './useView';
export { useWidget } from './useWidget';

// Theme hooks
export { useCalciteMode } from './useCalciteMode';
export { useArcGISTheme } from './useArcGISTheme';
export { useTheme, useSystemTheme, getSystemTheme } from './useTheme';
export type { CalciteMode, ArcGISTheme, Theme, ThemeMode } from './useTheme';
