import type { LayerProps } from '../../types';
import type EsriImageryLayer from '@arcgis/core/layers/ImageryLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface ImageryLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  rasterFunction?: any;
  mosaicRule?: __esri.MosaicRule;
  renderingRule?: __esri.RasterFunction;
  pixelFilter?: (pixelData: any) => void;
  format?: 'jpgpng' | 'png' | 'png8' | 'png24' | 'png32' | 'jpg' | 'bmp' | 'gif' | 'lerc';
}

export function ImageryLayer({
  url,
  portalItem,
  rasterFunction,
  mosaicRule,
  renderingRule,
  pixelFilter,
  format,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: ImageryLayerProps) {
  const { Module } = useEsriModule<EsriImageryLayer>(
    () => import('@arcgis/core/layers/ImageryLayer'),
    'ImageryLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      rasterFunction,
      mosaicRule,
      renderingRule,
      pixelFilter,
      format,
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

export default ImageryLayer;
