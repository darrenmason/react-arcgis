import type { FeatureLayerProps } from '../../types';
import type EsriFeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export function FeatureLayer({
  url,
  portalItem,
  fields,
  geometryType,
  objectIdField,
  renderer,
  popupTemplate,
  definitionExpression,
  outFields = ['*'],
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: FeatureLayerProps) {
  const { Module } = useEsriModule<EsriFeatureLayer>(
    () => import('@arcgis/core/layers/FeatureLayer'),
    'FeatureLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      fields,
      geometryType,
      objectIdField,
      renderer,
      popupTemplate,
      definitionExpression,
      outFields,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    definitionExpression: { value: definitionExpression },
    renderer: { value: renderer as any, condition: !!renderer },
    popupTemplate: { value: popupTemplate as any, condition: !!popupTemplate }
  });

  return null;
}

export default FeatureLayer;
