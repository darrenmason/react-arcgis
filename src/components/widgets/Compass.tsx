import type EsriCompass from '@arcgis/core/widgets/Compass';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface CompassProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: EsriCompass) => void;
}

/**
 * Compass widget component - Shows map rotation
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Compass position="top-left" />
 * </MapView>
 * ```
 */
export function Compass({
  view: propView,
  position = 'top-left',
  onLoad
}: CompassProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriCompass>(
    () => import('@arcgis/core/widgets/Compass'),
    'Compass'
  );

  useWidget({
    Module,
    view,
    config: {},
    position,
    onLoad
  });

  return null;
}

export default Compass;
