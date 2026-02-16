import type { LayerProps } from '../../types';
import type EsriGroupLayer from '@arcgis/core/layers/GroupLayer';
import type Layer from '@arcgis/core/layers/Layer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';
import { useEffect } from 'react';

export interface GroupLayerProps extends LayerProps {
  layers?: Layer[];
  visibilityMode?: 'independent' | 'inherited' | 'exclusive';
}

export function GroupLayer({
  layers,
  visibilityMode = 'independent',
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: GroupLayerProps) {
  const { Module } = useEsriModule<EsriGroupLayer>(
    () => import('@arcgis/core/layers/GroupLayer'),
    'GroupLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      layers,
      visibilityMode,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    visibilityMode: { value: visibilityMode }
  });

  // Update layers collection
  useEffect(() => {
    if (layer && layers) {
      layer.removeAll();
      layer.addMany(layers);
    }
  }, [layer, layers]);

  return null;
}

export default GroupLayer;
