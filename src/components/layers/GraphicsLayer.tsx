import { useEffect } from 'react';
import type { GraphicsLayerProps } from '../../types';
import type EsriGraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export function GraphicsLayer({
  graphics = [],
  elevationInfo,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: GraphicsLayerProps) {
  const { Module } = useEsriModule<EsriGraphicsLayer>(
    () => import('@arcgis/core/layers/GraphicsLayer'),
    'GraphicsLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      graphics,
      elevationInfo,
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

  // Update graphics collection
  useEffect(() => {
    if (layer && graphics) {
      layer.removeAll();
      layer.addMany(graphics);
    }
  }, [layer, graphics]);

  return null;
}

export default GraphicsLayer;
