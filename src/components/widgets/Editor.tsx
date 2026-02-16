import type EsriEditor from '@arcgis/core/widgets/Editor';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface EditorProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  layerInfos?: __esri.LayerInfo[];
  snappingOptions?: __esri.SnappingOptions;
  allowedWorkflows?: ('create' | 'update')[];
  onLoad?: (widget: EsriEditor) => void;
}

/**
 * Editor widget component - Feature editing
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Editor
 *     position="top-right"
 *     layerInfos={[
 *       {
 *         layer: featureLayer,
 *         formTemplate: { ... }
 *       }
 *     ]}
 *     allowedWorkflows={["create", "update"]}
 *   />
 * </MapView>
 * ```
 */
export function Editor({
  view: propView,
  position = 'top-right',
  layerInfos,
  snappingOptions,
  allowedWorkflows,
  onLoad
}: EditorProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriEditor>(
    () => import('@arcgis/core/widgets/Editor'),
    'Editor'
  );

  useWidget({
    Module,
    view,
    config: {
      layerInfos,
      snappingOptions,
      allowedWorkflows
    },
    position,
    onLoad
  });

  return null;
}

export default Editor;
