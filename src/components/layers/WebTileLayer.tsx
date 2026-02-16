import type { LayerProps } from '../../types';
import type EsriWebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface WebTileLayerProps extends LayerProps {
  urlTemplate?: string;
  subDomains?: string[];
  copyright?: string;
  tileInfo?: __esri.TileInfo;
}

/**
 * WebTileLayer component for custom tile services (OpenStreetMap, etc.)
 * 
 * @example
 * ```tsx
 * <WebTileLayer
 *   urlTemplate="https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png"
 *   subDomains={["a", "b", "c"]}
 *   copyright="© OpenStreetMap contributors"
 * />
 * ```
 */
export function WebTileLayer({
  urlTemplate,
  subDomains,
  copyright,
  tileInfo,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: WebTileLayerProps) {
  const { Module } = useEsriModule<EsriWebTileLayer>(
    () => import('@arcgis/core/layers/WebTileLayer'),
    'WebTileLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      urlTemplate,
      subDomains,
      copyright,
      tileInfo,
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

export default WebTileLayer;
