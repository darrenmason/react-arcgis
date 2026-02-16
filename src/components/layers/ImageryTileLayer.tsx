import type { LayerProps } from '../../types';
import type EsriImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface ImageryTileLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  rasterFunction?: any;
  multidimensionalDefinition?: __esri.DimensionalDefinition[];
}

/**
 * ImageryTileLayer component for tiled imagery services
 * 
 * @example
 * ```tsx
 * <ImageryTileLayer
 *   url="https://tiledimageservices.arcgis.com/service/ImageServer"
 *   rasterFunction={{
 *     functionName: "Hillshade"
 *   }}
 * />
 * ```
 */
export function ImageryTileLayer({
  url,
  portalItem,
  rasterFunction,
  multidimensionalDefinition,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: ImageryTileLayerProps) {
  const { Module } = useEsriModule<EsriImageryTileLayer>(
    () => import('@arcgis/core/layers/ImageryTileLayer'),
    'ImageryTileLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      rasterFunction,
      multidimensionalDefinition,
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

export default ImageryTileLayer;
