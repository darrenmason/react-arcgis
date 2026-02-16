import type { LayerProps } from '../../types';
import type EsriStreamLayer from '@arcgis/core/layers/StreamLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface StreamLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  geometryType?: 'point' | 'polyline' | 'polygon';
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
  purgeOptions?: {
    displayCount?: number;
    age?: number;
  };
  maximumTrackPoints?: number;
  trackIdField?: string;
  updateInterval?: number;
}

/**
 * StreamLayer component for real-time data streams
 * 
 * @example
 * ```tsx
 * <StreamLayer
 *   url="https://service.arcgis.com/stream"
 *   purgeOptions={{
 *     displayCount: 10000,
 *     age: 5
 *   }}
 *   updateInterval={500}
 *   renderer={{
 *     type: 'simple',
 *     symbol: {
 *       type: 'simple-marker',
 *       color: 'red',
 *       size: 8
 *     }
 *   }}
 * />
 * ```
 */
export function StreamLayer({
  url,
  portalItem,
  geometryType,
  renderer,
  popupTemplate,
  purgeOptions,
  maximumTrackPoints,
  trackIdField,
  updateInterval,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: StreamLayerProps) {
  const { Module } = useEsriModule<EsriStreamLayer>(
    () => import('@arcgis/core/layers/StreamLayer'),
    'StreamLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      geometryType,
      renderer,
      popupTemplate,
      purgeOptions,
      maximumTrackPoints,
      trackIdField,
      updateInterval,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    renderer: { value: renderer as any, condition: !!renderer },
    popupTemplate: { value: popupTemplate as any, condition: !!popupTemplate }
  });

  return null;
}

export default StreamLayer;
