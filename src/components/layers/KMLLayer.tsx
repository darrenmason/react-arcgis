import type { LayerProps } from '../../types';
import type EsriKMLLayer from '@arcgis/core/layers/KMLLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface KMLLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  refreshInterval?: number;
}

export function KMLLayer({
  url,
  portalItem,
  refreshInterval,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: KMLLayerProps) {
  const { Module } = useEsriModule<EsriKMLLayer>(
    () => import('@arcgis/core/layers/KMLLayer'),
    'KMLLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
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

export default KMLLayer;
