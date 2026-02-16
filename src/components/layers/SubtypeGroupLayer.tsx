import type { LayerProps } from '../../types';
import type EsriSubtypeGroupLayer from '@arcgis/core/layers/SubtypeGroupLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface SubtypeGroupLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  sublayers?: __esri.Collection<__esri.SubtypeSublayer>;
}

/**
 * SubtypeGroupLayer component for feature layers with subtypes
 * 
 * @example
 * ```tsx
 * <SubtypeGroupLayer
 *   url="https://services.arcgis.com/.../FeatureServer/0"
 *   onLoad={(layer) => {
 *     console.log('Subtypes:', layer.sublayers);
 *   }}
 * />
 * ```
 */
export function SubtypeGroupLayer({
  url,
  portalItem,
  sublayers,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: SubtypeGroupLayerProps) {
  const { Module } = useEsriModule<EsriSubtypeGroupLayer>(
    () => import('@arcgis/core/layers/SubtypeGroupLayer'),
    'SubtypeGroupLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      sublayers,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity }
  });

  return null;
}

export default SubtypeGroupLayer;
