import type ScaleBar from '@arcgis/core/widgets/ScaleBar';
import type { ViewType } from '../types';
import { useEsriModule } from './useEsriModule';
import { useWidget } from './useWidget';

export interface UseScaleBarOptions {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  unit?: 'metric' | 'imperial' | 'dual';
  style?: 'ruler' | 'line';
  onLoad?: (widget: ScaleBar) => void;
}

/**
 * Hook to add a ScaleBar widget to the view
 * 
 * @example
 * ```tsx
 * function ScaleBarWidget() {
 *   const { view } = useView();
 *   const { widget, loading } = useScaleBar({
 *     view,
 *     position: 'bottom-left',
 *     unit: 'dual',
 *     style: 'ruler'
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useScaleBar(options: UseScaleBarOptions) {
  const { view, position = 'bottom-left', onLoad, ...config } = options;

  const { Module } = useEsriModule<ScaleBar>(
    () => import('@arcgis/core/widgets/ScaleBar'),
    'ScaleBar'
  );

  return useWidget({
    Module,
    view,
    config,
    position,
    onLoad
  });
}

export default useScaleBar;
