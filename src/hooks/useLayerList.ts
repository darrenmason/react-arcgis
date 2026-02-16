import type LayerList from '@arcgis/core/widgets/LayerList';
import type { ViewType } from '../types';
import { useEsriModule } from './useEsriModule';
import { useWidget } from './useWidget';

export interface UseLayerListOptions {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  listItemCreatedFunction?: (event: any) => void;
  selectionEnabled?: boolean;
  visibilityAppearance?: 'default' | 'checkbox';
  onLoad?: (widget: LayerList) => void;
}

/**
 * Hook to add a LayerList widget to the view
 * 
 * @example
 * ```tsx
 * function LayerListWidget() {
 *   const { view } = useView();
 *   const { widget, loading } = useLayerList({
 *     view,
 *     position: 'top-right',
 *     selectionEnabled: true
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useLayerList(options: UseLayerListOptions) {
  const { view, position = 'top-right', onLoad, ...config } = options;

  const { Module } = useEsriModule<LayerList>(
    () => import('@arcgis/core/widgets/LayerList'),
    'LayerList'
  );

  return useWidget({
    Module,
    view,
    config,
    position,
    onLoad
  });
}

export default useLayerList;
