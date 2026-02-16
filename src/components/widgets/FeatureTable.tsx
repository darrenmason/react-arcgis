import type EsriFeatureTable from '@arcgis/core/widgets/FeatureTable';
import type EsriFeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface FeatureTableProps {
  view?: __esri.MapView | __esri.SceneView;
  layer?: EsriFeatureLayer;
  position?: string | __esri.UIAddPosition;
  container?: HTMLElement | string;
  visibleElements?: {
    header?: boolean;
    menu?: boolean;
    menuItems?: {
      clearSelection?: boolean;
      refreshData?: boolean;
      toggleColumns?: boolean;
      selectedRecordsShowAllToggle?: boolean;
      selectedRecordsShowSelectedToggle?: boolean;
      zoomToSelection?: boolean;
    };
  };
  tableTemplate?: __esri.TableTemplate;
  multiSortEnabled?: boolean;
  onLoad?: (widget: EsriFeatureTable) => void;
}

/**
 * FeatureTable widget component - Tabular feature display
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <FeatureTable
 *     layer={featureLayer}
 *     container="tableDiv"
 *     multiSortEnabled={true}
 *     visibleElements={{
 *       menuItems: {
 *         clearSelection: true,
 *         refreshData: true
 *       }
 *     }}
 *   />
 * </MapView>
 * ```
 */
export function FeatureTable({
  view: propView,
  layer,
  position,
  container,
  visibleElements,
  tableTemplate,
  multiSortEnabled = true,
  onLoad
}: FeatureTableProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriFeatureTable>(
    () => import('@arcgis/core/widgets/FeatureTable'),
    'FeatureTable'
  );

  useWidget({
    Module,
    view,
    config: {
      layer,
      container,
      visibleElements,
      tableTemplate,
      multiSortEnabled
    },
    position,
    onLoad
  });

  return null;
}

export default FeatureTable;
