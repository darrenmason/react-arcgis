import type EsriDirections from '@arcgis/core/widgets/Directions';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface DirectionsProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  routeServiceUrl?: string;
  maxStops?: number;
  searchProperties?: __esri.SearchProperties;
  onLoad?: (widget: EsriDirections) => void;
}

/**
 * Directions widget component - Turn-by-turn routing
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Directions
 *     position="top-left"
 *     routeServiceUrl="https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
 *     maxStops={10}
 *   />
 * </MapView>
 * ```
 */
export function Directions({
  view: propView,
  position = 'top-left',
  routeServiceUrl,
  maxStops,
  searchProperties,
  onLoad
}: DirectionsProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriDirections>(
    () => import('@arcgis/core/widgets/Directions'),
    'Directions'
  );

  useWidget({
    Module,
    view,
    config: {
      routeServiceUrl,
      maxStops,
      searchProperties
    },
    position,
    onLoad
  });

  return null;
}

export default Directions;
