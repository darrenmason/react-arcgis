import type EsriSwipe from '@arcgis/core/widgets/Swipe';
import type Layer from '@arcgis/core/layers/Layer';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { useEffect } from 'react';

export interface SwipeProps {
  view?: __esri.MapView | __esri.SceneView;
  leadingLayers?: Layer[];
  trailingLayers?: Layer[];
  direction?: 'horizontal' | 'vertical';
  position?: number;
  disabled?: boolean;
  onPositionChange?: (position: number) => void;
  onLoad?: (widget: EsriSwipe) => void;
}

/**
 * Swipe widget component - Compare layers side-by-side
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <FeatureLayer url="..." onLoad={(layer) => setLayer1(layer)} />
 *   <FeatureLayer url="..." onLoad={(layer) => setLayer2(layer)} />
 *   
 *   <Swipe
 *     leadingLayers={[layer1]}
 *     trailingLayers={[layer2]}
 *     direction="horizontal"
 *     position={50}
 *   />
 * </MapView>
 * ```
 */
export function Swipe({
  view: propView,
  leadingLayers,
  trailingLayers,
  direction = 'horizontal',
  position: swipePosition = 50,
  disabled = false,
  onPositionChange,
  onLoad
}: SwipeProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriSwipe>(
    () => import('@arcgis/core/widgets/Swipe'),
    'Swipe'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: {
      leadingLayers,
      trailingLayers,
      direction,
      position: swipePosition,
      disabled
    },
    position: null, // Swipe doesn't use UI position
    onLoad
  });

  // Watch position changes
  useEffect(() => {
    if (!widget || !onPositionChange) return;

    const handle = (widget as any).watch('position', (newPosition: number) => {
      onPositionChange(newPosition);
    });

    return () => {
      handle?.remove();
    };
  }, [widget, onPositionChange]);

  return null;
}

export default Swipe;
