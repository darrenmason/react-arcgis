import type { LayerProps } from '../../types';
import type EsriSceneLayer from '@arcgis/core/layers/SceneLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface SceneLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  elevationInfo?: any;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
  definitionExpression?: string;
  outFields?: string[];
}

/**
 * SceneLayer component for 3D scene services
 * 
 * @example
 * ```tsx
 * <SceneLayer
 *   url="https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/3D_Buildings/SceneServer"
 *   popupTemplate={{
 *     title: "{NAME}",
 *     content: "Height: {HEIGHT_ROOF}m"
 *   }}
 * />
 * ```
 */
export function SceneLayer({
  url,
  portalItem,
  elevationInfo,
  renderer,
  popupTemplate,
  definitionExpression,
  outFields,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: SceneLayerProps) {
  const { Module } = useEsriModule<EsriSceneLayer>(
    () => import('@arcgis/core/layers/SceneLayer'),
    'SceneLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      elevationInfo,
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

export default SceneLayer;
