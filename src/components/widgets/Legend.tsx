import type EsriLegend from '@arcgis/core/widgets/Legend';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface LegendProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  style?: 'classic' | 'card';
  respectLayerVisibility?: boolean;
  layerInfos?: any[]; // LegendLayerInfos type not exported
  onLoad?: (widget: EsriLegend) => void;
}

/**
 * Legend widget component - Map legend
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <FeatureLayer url="..." />
 *   <Legend position="bottom-right" style="card" />
 * </MapView>
 * ```
 */
export function Legend({
  view: propView,
  position = 'bottom-right',
  style,
  respectLayerVisibility,
  layerInfos,
  onLoad
}: LegendProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriLegend>(
    () => import('@arcgis/core/widgets/Legend'),
    'Legend'
  );

  useWidget({
    Module,
    view,
    config: {
      style,
      respectLayerVisibility,
      layerInfos
    },
    position,
    onLoad
  });

  return null;
}

export default Legend;
