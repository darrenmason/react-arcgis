import type BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import type { ViewType } from '../types';
import { useEsriModule } from './useEsriModule';
import { useWidget } from './useWidget';

export interface UseBasemapToggleOptions extends Omit<__esri.BasemapToggleProperties, 'view'> {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: BasemapToggle) => void;
}

/**
 * Hook to add a BasemapToggle widget to the view
 * 
 * @example
 * ```tsx
 * function BasemapToggleWidget() {
 *   const { view } = useView();
 *   const { widget, loading } = useBasemapToggle({
 *     view,
 *     position: 'bottom-left',
 *     nextBasemap: 'satellite'
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useBasemapToggle(options: UseBasemapToggleOptions) {
  const { view, position = 'bottom-left', onLoad, ...config } = options;

  const { Module } = useEsriModule<BasemapToggle>(
    () => import('@arcgis/core/widgets/BasemapToggle'),
    'BasemapToggle'
  );

  return useWidget({
    Module,
    view,
    config,
    position,
    onLoad
  });
}

export default useBasemapToggle;
