import type EsriLayerList from '@arcgis/core/widgets/LayerList';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface LayerListProps extends Omit<__esri.LayerListProperties, 'view'> {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: EsriLayerList) => void;
}

/**
 * LayerList widget component - Table of contents for layers
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <FeatureLayer url="..." />
 *   <LayerList position="top-right" selectionEnabled={true} />
 * </MapView>
 * ```
 */
export function LayerList({
  view: propView,
  position = 'top-right',
  onLoad,
  ...config
}: LayerListProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriLayerList>(
    () => import('@arcgis/core/widgets/LayerList'),
    'LayerList'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: { ...config },
    position,
    onLoad
  });

  usePropertyUpdater(widget, {
    listItemCreatedFunction: { value: config.listItemCreatedFunction as __esri.LayerListListItemCreatedHandler | null, condition: config.listItemCreatedFunction !== undefined },
    visibilityAppearance: { value: config.visibilityAppearance, condition: config.visibilityAppearance !== undefined },
    selectionMode: { value: config.selectionMode, condition: config.selectionMode !== undefined },
    collapsed: { value: config.collapsed, condition: config.collapsed !== undefined },
    dragEnabled: { value: config.dragEnabled, condition: config.dragEnabled !== undefined },
    filterPlaceholder: { value: config.filterPlaceholder, condition: config.filterPlaceholder !== undefined },
    filterText: { value: config.filterText, condition: config.filterText !== undefined },
    headingLevel: { value: config.headingLevel, condition: config.headingLevel !== undefined },
    label: { value: config.label, condition: config.label !== undefined },
    icon: { value: config.icon, condition: config.icon !== undefined },
    minDragEnabledItems: { value: config.minDragEnabledItems, condition: config.minDragEnabledItems !== undefined },
    minFilterItems: { value: config.minFilterItems, condition: config.minFilterItems !== undefined },
    visibleElements: { value: config.visibleElements as __esri.LayerListVisibleElements | undefined, condition: config.visibleElements !== undefined }
  });

  return null;
}

export default LayerList;
