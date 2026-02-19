import type EsriLegend from '@arcgis/core/widgets/Legend';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface LegendProps extends Omit<__esri.LegendProperties, 'view'> {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
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
  onLoad,
  ...config
}: LegendProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriLegend>(
    () => import('@arcgis/core/widgets/Legend'),
    'Legend'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: { ...config },
    position,
    onLoad
  });

  usePropertyUpdater(widget, {
    style: { value: config.style, condition: config.style !== undefined },
    respectLayerVisibility: { value: config.respectLayerVisibility, condition: config.respectLayerVisibility !== undefined },
    respectLayerDefinitionExpression: { value: config.respectLayerDefinitionExpression, condition: config.respectLayerDefinitionExpression !== undefined },
    layerInfos: { value: config.layerInfos as __esri.LegendViewModelLayerInfo[] | undefined, condition: config.layerInfos !== undefined },
    basemapLegendVisible: { value: config.basemapLegendVisible, condition: config.basemapLegendVisible !== undefined },
    hideLayersNotInCurrentView: { value: config.hideLayersNotInCurrentView, condition: config.hideLayersNotInCurrentView !== undefined },
    headingLevel: { value: config.headingLevel, condition: config.headingLevel !== undefined },
    label: { value: config.label, condition: config.label !== undefined },
    icon: { value: config.icon, condition: config.icon !== undefined }
  });

  return null;
}

export default Legend;
