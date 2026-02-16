import type EsriHome from '@arcgis/core/widgets/Home';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface HomeProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  viewpoint?: __esri.Viewpoint;
  onLoad?: (widget: EsriHome) => void;
}

/**
 * Home widget component - Return to initial viewpoint
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Home position="top-left" />
 * </MapView>
 * ```
 */
export function Home({
  view: propView,
  position = 'top-left',
  viewpoint,
  onLoad
}: HomeProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriHome>(
    () => import('@arcgis/core/widgets/Home'),
    'Home'
  );

  useWidget({
    Module,
    view,
    config: {
      viewpoint
    },
    position,
    onLoad
  });

  return null;
}

export default Home;
