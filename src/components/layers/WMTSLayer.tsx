import type { LayerProps } from '../../types';
import type EsriWMTSLayer from '@arcgis/core/layers/WMTSLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface WMTSLayerProps extends LayerProps {
  url?: string;
  activeLayer?: __esri.WMTSSublayer;
  customLayerParameters?: Record<string, string>;
  customParameters?: Record<string, string>;
  serviceMode?: 'KVP' | 'RESTful';
}

/**
 * WMTSLayer component for OGC Web Map Tile Service
 * 
 * @example
 * ```tsx
 * <WMTSLayer
 *   url="https://example.com/wmts"
 *   activeLayer={{ id: 'layer1' }}
 *   serviceMode="RESTful"
 * />
 * ```
 */
export function WMTSLayer({
  url,
  activeLayer,
  customLayerParameters,
  customParameters,
  serviceMode,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: WMTSLayerProps) {
  const { Module } = useEsriModule<EsriWMTSLayer>(
    () => import('@arcgis/core/layers/WMTSLayer'),
    'WMTSLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      activeLayer,
      customLayerParameters,
      customParameters,
      serviceMode,
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

export default WMTSLayer;
