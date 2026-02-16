import type { LayerProps } from '../../types';
import type EsriElevationLayer from '@arcgis/core/layers/ElevationLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface ElevationLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
}

/**
 * ElevationLayer component for terrain elevation data
 * 
 * Note: ElevationLayer is typically added to the ground surface, not as a map layer.
 * Use with Map's ground property.
 * 
 * @example
 * ```tsx
 * // Add to ground instead of as a layer
 * const elevationLayer = new ElevationLayer({
 *   url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
 * });
 * 
 * map.ground.layers.add(elevationLayer);
 * ```
 */
export function ElevationLayer({
  url,
  portalItem,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: ElevationLayerProps) {
  const { Module } = useEsriModule<EsriElevationLayer>(
    () => import('@arcgis/core/layers/ElevationLayer'),
    'ElevationLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
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

export default ElevationLayer;
