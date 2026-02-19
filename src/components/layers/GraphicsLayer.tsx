import { useEffect } from 'react';
import type { GraphicsLayerProps } from '../../types';
import type EsriGraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export function GraphicsLayer({
  graphics = [],
  blendMode,
  effect,
  elevationInfo,
  id,
  listMode,
  maxScale,
  minScale,
  persistenceEnabled,
  screenSizePerspectiveEnabled,
  title,
  visibilityTimeExtent,
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
      blendMode,
      effect,
      elevationInfo,
      id,
      listMode,
      maxScale,
      minScale,
      persistenceEnabled,
      screenSizePerspectiveEnabled,
      title,
      visibilityTimeExtent,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    blendMode: { value: blendMode },
    effect: { value: effect as __esri.Effect | null, condition: effect !== undefined },
    elevationInfo: { value: elevationInfo as __esri.ElevationInfo | null, condition: elevationInfo !== undefined },
    listMode: { value: listMode },
    maxScale: { value: maxScale },
    minScale: { value: minScale },
    persistenceEnabled: { value: persistenceEnabled },
    screenSizePerspectiveEnabled: { value: screenSizePerspectiveEnabled },
    title: { value: title },
    visibilityTimeExtent: { value: visibilityTimeExtent as __esri.TimeExtent | null, condition: visibilityTimeExtent !== undefined },
    visible: { value: visible },
    opacity: { value: opacity }
  });

  // Update graphics collection when graphics array reference changes
  useEffect(() => {
    if (layer && graphics) {
      layer.removeAll();
      layer.addMany(graphics);
    }
  }, [layer, graphics]);

  return null;
}

export default GraphicsLayer;
