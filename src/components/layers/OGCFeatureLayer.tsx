import type { LayerProps } from '../../types';
import type EsriOGCFeatureLayer from '@arcgis/core/layers/OGCFeatureLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface OGCFeatureLayerProps extends LayerProps {
  url?: string;
  collectionId?: string;
  fields?: __esri.Field[];
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
  customParameters?: Record<string, string>;
}

/**
 * OGCFeatureLayer component for OGC API - Features
 * 
 * @example
 * ```tsx
 * <OGCFeatureLayer
 *   url="https://example.com/ogcapi/collections"
 *   collectionId="my-collection"
 *   renderer={{
 *     type: 'simple',
 *     symbol: {
 *       type: 'simple-marker',
 *       color: 'blue',
 *       size: 8
 *     }
 *   }}
 * />
 * ```
 */
export function OGCFeatureLayer({
  url,
  collectionId,
  fields,
  renderer,
  popupTemplate,
  customParameters,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: OGCFeatureLayerProps) {
  const { Module } = useEsriModule<EsriOGCFeatureLayer>(
    () => import('@arcgis/core/layers/OGCFeatureLayer'),
    'OGCFeatureLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      collectionId,
      fields,
      renderer,
      popupTemplate,
      customParameters,
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

export default OGCFeatureLayer;
