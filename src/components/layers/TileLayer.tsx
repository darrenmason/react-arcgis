import type { LayerProps } from '../../types';
import type EsriTileLayer from '@arcgis/core/layers/TileLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface TileLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  tileInfo?: __esri.TileInfo;
  refreshInterval?: number;
}

export function TileLayer({
  url,
  portalItem,
  tileInfo,
  refreshInterval,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: TileLayerProps) {
  const { Module } = useEsriModule<EsriTileLayer>(
    () => import('@arcgis/core/layers/TileLayer'),
    'TileLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      tileInfo,
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

export default TileLayer;
