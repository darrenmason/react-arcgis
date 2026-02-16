import type { LayerProps } from '../../types';
import type EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface GeoJSONLayerProps extends LayerProps {
  url?: string;
  copyright?: string;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
}

export function GeoJSONLayer({
  url,
  copyright,
  renderer,
  popupTemplate,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: GeoJSONLayerProps) {
  const { Module } = useEsriModule<EsriGeoJSONLayer>(
    () => import('@arcgis/core/layers/GeoJSONLayer'),
    'GeoJSONLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      copyright,
      renderer,
      popupTemplate,
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

export default GeoJSONLayer;
