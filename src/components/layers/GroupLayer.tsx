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
  /** Unique ID for the layer. */
  id?: string;
  /** How the layer displays in the LayerList. */
  listMode?: 'show' | 'hide' | 'hide-children';
  /** Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum. */
  maxScale?: number;
  /** Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum. */
  minScale?: number;
  /** Title for the layer (e.g. in Legend, LayerList). */
  title?: string | null;
}

export function GroupLayer({
  layers,
  visibilityMode = 'independent',
  id,
  listMode,
  maxScale,
  minScale,
  title,
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
      id,
      listMode,
      maxScale,
      minScale,
      title,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    visibilityMode: { value: visibilityMode },
    listMode: { value: listMode },
    maxScale: { value: maxScale },
    minScale: { value: minScale },
    title: { value: title }
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
