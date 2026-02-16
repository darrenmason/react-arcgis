import type { LayerProps } from '../../types';
import type EsriVectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface VectorTileLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  style?: any;
}

export function VectorTileLayer({
  url,
  portalItem,
  style,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: VectorTileLayerProps) {
  const { Module } = useEsriModule<EsriVectorTileLayer>(
    () => import('@arcgis/core/layers/VectorTileLayer'),
    'VectorTileLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      style,
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

export default VectorTileLayer;
