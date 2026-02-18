import type EsriMeasurement from '@arcgis/core/widgets/Measurement';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface MeasurementProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  activeTool?: 'distance' | 'area' | null;
  areaUnit?: string;
  linearUnit?: string;
  onLoad?: (widget: EsriMeasurement) => void;
}

/**
 * Measurement widget component - Measure distance and area
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Measurement
 *     position="top-right"
 *     activeTool="distance"
 *     linearUnit="miles"
 *     areaUnit="square-miles"
 *   />
 * </MapView>
 * ```
 */
export function Measurement({
  view: propView,
  position = 'top-right',
  activeTool,
  areaUnit,
  linearUnit,
  onLoad
}: MeasurementProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriMeasurement>(
    () => import('@arcgis/core/widgets/Measurement'),
    'Measurement'
  );

  useWidget({
    Module,
    view,
    config: {
      activeTool,
      areaUnit,
      linearUnit
    },
    position,
    onLoad
  });

  return null;
}

export default Measurement;
