import type { LayerProps } from '../../types';
import type EsriWFSLayer from '@arcgis/core/layers/WFSLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface WFSLayerProps extends LayerProps {
  url?: string;
  name?: string;
  customParameters?: Record<string, string>;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
  fields?: __esri.Field[];
  geometryType?: 'point' | 'polyline' | 'polygon' | 'multipoint';
}

/**
 * WFSLayer component for OGC Web Feature Service
 * 
 * @example
 * ```tsx
 * <WFSLayer
 *   url="https://example.com/wfs"
 *   name="my:featuretype"
 *   renderer={{
 *     type: 'simple',
 *     symbol: {
 *       type: 'simple-fill',
 *       color: [0, 100, 200, 0.5]
 *     }
 *   }}
 * />
 * ```
 */
export function WFSLayer({
  url,
  name,
  customParameters,
  renderer,
  popupTemplate,
  fields,
  geometryType,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: WFSLayerProps) {
  const { Module } = useEsriModule<EsriWFSLayer>(
    () => import('@arcgis/core/layers/WFSLayer'),
    'WFSLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      name,
      customParameters,
      renderer,
      popupTemplate,
      fields,
      geometryType,
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

export default WFSLayer;
