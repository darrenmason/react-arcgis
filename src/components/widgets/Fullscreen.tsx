import type EsriFullscreen from '@arcgis/core/widgets/Fullscreen';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface FullscreenProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  element?: HTMLElement;
  onLoad?: (widget: EsriFullscreen) => void;
}

/**
 * Fullscreen widget component - Toggle fullscreen mode
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Fullscreen position="top-right" />
 * </MapView>
 * ```
 */
export function Fullscreen({
  view: propView,
  position = 'top-right',
  element,
  onLoad
}: FullscreenProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriFullscreen>(
    () => import('@arcgis/core/widgets/Fullscreen'),
    'Fullscreen'
  );

  useWidget({
    Module,
    view,
    config: {
      element
    },
    position,
    onLoad
  });

  return null;
}

export default Fullscreen;
