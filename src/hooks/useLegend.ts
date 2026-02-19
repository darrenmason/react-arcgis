import type Legend from '@arcgis/core/widgets/Legend';
import type { ViewType } from '../types';
import { useEsriModule } from './useEsriModule';
import { useWidget } from './useWidget';

export interface UseLegendOptions extends Omit<__esri.LegendProperties, 'view'> {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: Legend) => void;
}

/**
 * Hook to add a Legend widget to the view
 * 
 * @example
 * ```tsx
 * function LegendWidget() {
 *   const { view } = useView();
 *   const { widget, loading } = useLegend({
 *     view,
 *     position: 'bottom-right',
 *     style: 'card'
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useLegend(options: UseLegendOptions) {
  const { view, position = 'bottom-right', onLoad, ...config } = options;

  const { Module } = useEsriModule<Legend>(
    () => import('@arcgis/core/widgets/Legend'),
    'Legend'
  );

  return useWidget({
    Module,
    view,
    config,
    position,
    onLoad
  });
}

export default useLegend;
