import type { LayerProps } from '../../types';
import type EsriWMSLayer from '@arcgis/core/layers/WMSLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface WMSLayerProps extends LayerProps {
  url?: string;
  sublayers?: __esri.WMSSublayer[];
  version?: string;
  imageFormat?: string;
  imageTransparency?: boolean;
  customLayerParameters?: Record<string, string>;
}

/**
 * WMSLayer component for OGC Web Map Service
 * 
 * @example
 * ```tsx
 * <WMSLayer
 *   url="https://example.com/wms"
 *   sublayers={[
 *     { name: 'layer1' },
 *     { name: 'layer2' }
 *   ]}
 *   version="1.3.0"
 *   imageFormat="image/png"
 * />
 * ```
 */
export function WMSLayer({
  url,
  sublayers,
  version,
  imageFormat,
  imageTransparency,
  customLayerParameters,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: WMSLayerProps) {
  const { Module } = useEsriModule<EsriWMSLayer>(
    () => import('@arcgis/core/layers/WMSLayer'),
    'WMSLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      sublayers,
      version,
      imageFormat,
      imageTransparency,
      customLayerParameters,
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

export default WMSLayer;
