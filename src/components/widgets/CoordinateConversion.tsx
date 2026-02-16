import type EsriCoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface CoordinateConversionProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  formats?: __esri.Format[];
  conversions?: __esri.Conversion[];
  onLoad?: (widget: EsriCoordinateConversion) => void;
}

/**
 * CoordinateConversion widget component - Convert between coordinate systems
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <CoordinateConversion
 *     position="bottom-right"
 *     formats={[
 *       { name: "DD", conversionInfo: { reverseConvert: ... } },
 *       { name: "DMS", conversionInfo: { reverseConvert: ... } }
 *     ]}
 *   />
 * </MapView>
 * ```
 */
export function CoordinateConversion({
  view: propView,
  position = 'bottom-right',
  formats,
  conversions,
  onLoad
}: CoordinateConversionProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriCoordinateConversion>(
    () => import('@arcgis/core/widgets/CoordinateConversion'),
    'CoordinateConversion'
  );

  useWidget({
    Module,
    view,
    config: {
      formats,
      conversions
    },
    position,
    onLoad
  });

  return null;
}

export default CoordinateConversion;
