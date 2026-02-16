import type { LayerProps } from '../../types';
import type EsriIntegratedMeshLayer from '@arcgis/core/layers/IntegratedMeshLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface IntegratedMeshLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  elevationInfo?: any;
}

/**
 * IntegratedMeshLayer component for 3D mesh data
 * 
 * @example
 * ```tsx
 * <IntegratedMeshLayer
 *   portalItem={{ id: "mesh-id" }}
 *   elevationInfo={{
 *     mode: "on-the-ground"
 *   }}
 * />
 * ```
 */
export function IntegratedMeshLayer({
  url,
  portalItem,
  elevationInfo,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: IntegratedMeshLayerProps) {
  const { Module } = useEsriModule<EsriIntegratedMeshLayer>(
    () => import('@arcgis/core/layers/IntegratedMeshLayer'),
    'IntegratedMeshLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      elevationInfo,
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

export default IntegratedMeshLayer;
