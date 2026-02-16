import type { LayerProps } from '../../types';
import type EsriBuildingSceneLayer from '@arcgis/core/layers/BuildingSceneLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface BuildingSceneLayerProps extends LayerProps {
  url?: string;
  portalItem?: __esri.PortalItemProperties;
  allSublayers?: __esri.Collection<__esri.BuildingComponentSublayer>;
  activeFilterId?: string;
  filters?: __esri.BuildingFilter[];
}

/**
 * BuildingSceneLayer component for 3D building models
 * 
 * @example
 * ```tsx
 * <BuildingSceneLayer
 *   portalItem={{ id: "building-id" }}
 *   activeFilterId="floors-1-to-5"
 *   filters={[
 *     {
 *       id: "floors-1-to-5",
 *       name: "Floors 1-5",
 *       where: "FLOOR_LEVEL >= 1 AND FLOOR_LEVEL <= 5"
 *     }
 *   ]}
 * />
 * ```
 */
export function BuildingSceneLayer({
  url,
  portalItem,
  allSublayers,
  activeFilterId,
  filters,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: BuildingSceneLayerProps) {
  const { Module } = useEsriModule<EsriBuildingSceneLayer>(
    () => import('@arcgis/core/layers/BuildingSceneLayer'),
    'BuildingSceneLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      url,
      portalItem,
      allSublayers,
      activeFilterId,
      filters,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    visible: { value: visible },
    opacity: { value: opacity },
    activeFilterId: { value: activeFilterId, condition: !!activeFilterId }
  });

  return null;
}

export default BuildingSceneLayer;
