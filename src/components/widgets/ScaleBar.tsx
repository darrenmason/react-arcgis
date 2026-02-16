import type EsriScaleBar from '@arcgis/core/widgets/ScaleBar';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface ScaleBarProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  unit?: 'metric' | 'imperial' | 'dual';
  style?: 'ruler' | 'line';
  onLoad?: (widget: EsriScaleBar) => void;
}

/**
 * ScaleBar widget component - Display map scale
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <ScaleBar
 *     position="bottom-left"
 *     unit="dual"
 *     style="ruler"
 *   />
 * </MapView>
 * ```
 */
export function ScaleBar({
  view: propView,
  position = 'bottom-left',
  unit = 'metric',
  style = 'line',
  onLoad
}: ScaleBarProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriScaleBar>(
    () => import('@arcgis/core/widgets/ScaleBar'),
    'ScaleBar'
  );

  useWidget({
    Module,
    view,
    config: {
      unit,
      style
    },
    position,
    onLoad
  });

  return null;
}

export default ScaleBar;
