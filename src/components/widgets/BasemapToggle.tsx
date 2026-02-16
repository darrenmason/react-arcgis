import type EsriBasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface BasemapToggleProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  nextBasemap?: string | __esri.Basemap;
  onLoad?: (widget: EsriBasemapToggle) => void;
}

/**
 * BasemapToggle widget component - Toggle between two basemaps
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <BasemapToggle
 *     position="bottom-left"
 *     nextBasemap="satellite"
 *   />
 * </MapView>
 * ```
 */
export function BasemapToggle({
  view: propView,
  position = 'bottom-left',
  nextBasemap,
  onLoad
}: BasemapToggleProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriBasemapToggle>(
    () => import('@arcgis/core/widgets/BasemapToggle'),
    'BasemapToggle'
  );

  useWidget({
    Module,
    view,
    config: {
      nextBasemap
    },
    position,
    onLoad
  });

  return null;
}

export default BasemapToggle;
