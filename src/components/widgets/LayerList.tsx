import type EsriLayerList from '@arcgis/core/widgets/LayerList';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface LayerListProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  listItemCreatedFunction?: (event: any) => void;
  selectionEnabled?: boolean;
  visibilityAppearance?: 'default' | 'checkbox';
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
  listItemCreatedFunction,
  selectionEnabled,
  visibilityAppearance,
  onLoad
}: LayerListProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriLayerList>(
    () => import('@arcgis/core/widgets/LayerList'),
    'LayerList'
  );

  useWidget({
    Module,
    view,
    config: {
      listItemCreatedFunction,
      selectionEnabled,
      visibilityAppearance
    },
    position,
    onLoad
  });

  return null;
}

export default LayerList;
