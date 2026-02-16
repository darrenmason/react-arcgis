import type { LayerProps } from '../../types';
import type EsriMapImageLayer from '@arcgis/core/layers/MapImageLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface MapImageLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  sublayers?: __esri.Collection<__esri.Sublayer> | __esri.SublayerProperties[];
  imageFormat?: 'png' | 'png8' | 'png24' | 'png32' | 'jpg' | 'pdf' | 'bmp' | 'gif' | 'svg';
  imageMaxWidth?: number;
  imageMaxHeight?: number;
  refreshInterval?: number;
}

export function MapImageLayer({
  url,
  portalItem,
  sublayers,
  imageFormat,
  imageMaxWidth,
  imageMaxHeight,
  refreshInterval,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: MapImageLayerProps) {
  const { Module } = useEsriModule<EsriMapImageLayer>(
    () => import('@arcgis/core/layers/MapImageLayer'),
    'MapImageLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      sublayers,
      imageFormat,
      imageMaxWidth,
      imageMaxHeight,
      refreshInterval,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    refreshInterval: { value: refreshInterval, condition: !!refreshInterval }
  });

  return null;
}

export default MapImageLayer;
