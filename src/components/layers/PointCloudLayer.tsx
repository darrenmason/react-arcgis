import type { LayerProps } from '../../types';
import type EsriPointCloudLayer from '@arcgis/core/layers/PointCloudLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface PointCloudLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  elevationInfo?: any;
  renderer?: __esri.PointCloudRendererProperties;
  filters?: __esri.PointCloudFilter[];
}

/**
 * PointCloudLayer component for LiDAR point cloud data
 * 
 * @example
 * ```tsx
 * <PointCloudLayer
 *   url="https://tiles.arcgis.com/tiles/pointcloud/SceneServer"
 *   renderer={{
 *     type: "point-cloud-rgb",
 *     field: "RGB"
 *   }}
 * />
 * ```
 */
export function PointCloudLayer({
  url,
  portalItem,
  elevationInfo,
  renderer,
  filters,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: PointCloudLayerProps) {
  const { Module } = useEsriModule<EsriPointCloudLayer>(
    () => import('@arcgis/core/layers/PointCloudLayer'),
    'PointCloudLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      elevationInfo,
      renderer,
      filters,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    renderer: { value: renderer as any, condition: !!renderer }
  });

  return null;
}

export default PointCloudLayer;
