import type EsriPrint from '@arcgis/core/widgets/Print';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface PrintProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  printServiceUrl?: string;
  templateOptions?: __esri.PrintTemplateOptions;
  allowedFormats?: string[];
  allowedLayouts?: string[];
  onLoad?: (widget: EsriPrint) => void;
}

/**
 * Print widget component - Export/print maps
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Print
 *     position="top-right"
 *     printServiceUrl="https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
 *     allowedFormats={["pdf", "png32", "jpg"]}
 *   />
 * </MapView>
 * ```
 */
export function Print({
  view: propView,
  position = 'top-right',
  printServiceUrl,
  templateOptions,
  allowedFormats,
  allowedLayouts,
  onLoad
}: PrintProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriPrint>(
    () => import('@arcgis/core/widgets/Print'),
    'Print'
  );

  useWidget({
    Module,
    view,
    config: {
      printServiceUrl,
      templateOptions,
      allowedFormats,
      allowedLayouts
    },
    position,
    onLoad
  });

  return null;
}

export default Print;
