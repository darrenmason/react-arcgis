import type EsriScaleBar from '@arcgis/core/widgets/ScaleBar';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface ScaleBarProps extends Omit<__esri.ScaleBarProperties, 'view'> {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
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
  onLoad,
  ...config
}: ScaleBarProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriScaleBar>(
    () => import('@arcgis/core/widgets/ScaleBar'),
    'ScaleBar'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: { ...config },
    position,
    onLoad
  });

  usePropertyUpdater(widget, {
    unit: { value: config.unit, condition: config.unit !== undefined },
    style: { value: config.style, condition: config.style !== undefined },
    label: { value: config.label, condition: config.label !== undefined },
    icon: { value: config.icon, condition: config.icon !== undefined }
  });

  return null;
}

export default ScaleBar;
