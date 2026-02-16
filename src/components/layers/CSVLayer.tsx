import type { LayerProps } from '../../types';
import type EsriCSVLayer from '@arcgis/core/layers/CSVLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface CSVLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  fields?: __esri.Field[];
  latitudeField?: string;
  longitudeField?: string;
  delimiter?: string;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
}

export function CSVLayer({
  url,
  portalItem,
  fields,
  latitudeField,
  longitudeField,
  delimiter,
  renderer,
  popupTemplate,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: CSVLayerProps) {
  const { Module } = useEsriModule<EsriCSVLayer>(
    () => import('@arcgis/core/layers/CSVLayer'),
    'CSVLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      fields,
      latitudeField,
      longitudeField,
      delimiter,
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
    opacity: { value: opacity },
    renderer: { value: renderer as any, condition: !!renderer },
    popupTemplate: { value: popupTemplate as any, condition: !!popupTemplate }
  });

  return null;
}

export default CSVLayer;
