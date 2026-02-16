import type EsriZoom from '@arcgis/core/widgets/Zoom';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface ZoomProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  layout?: 'vertical' | 'horizontal';
  onLoad?: (widget: EsriZoom) => void;
}

/**
 * Zoom widget component - Zoom in/out buttons
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Zoom position="top-left" layout="vertical" />
 * </MapView>
 * ```
 */
export function Zoom({
  view: propView,
  position = 'top-left',
  layout = 'vertical',
  onLoad
}: ZoomProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriZoom>(
    () => import('@arcgis/core/widgets/Zoom'),
    'Zoom'
  );

  useWidget({
    Module,
    view,
    config: {
      layout
    },
    position,
    onLoad
  });

  return null;
}

export default Zoom;
