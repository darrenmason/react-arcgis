import type EsriElevationProfile from '@arcgis/core/widgets/ElevationProfile';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface ElevationProfileProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  profiles?: __esri.ElevationProfileLineGround[];
  unit?: 'metric' | 'imperial';
  visibleElements?: {
    legend?: boolean;
    clearButton?: boolean;
    settingsButton?: boolean;
    sketchButton?: boolean;
    selectButton?: boolean;
    uniformChartScalingToggle?: boolean;
  };
  onLoad?: (widget: EsriElevationProfile) => void;
}

/**
 * ElevationProfile widget component - Display elevation profiles
 * 
 * @example
 * ```tsx
 * <SceneView>
 *   <ElevationProfile
 *     position="bottom"
 *     unit="metric"
 *     visibleElements={{
 *       legend: true,
 *       sketchButton: true
 *     }}
 *   />
 * </SceneView>
 * ```
 */
export function ElevationProfile({
  view: propView,
  position = 'bottom',
  profiles,
  unit = 'metric',
  visibleElements,
  onLoad
}: ElevationProfileProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriElevationProfile>(
    () => import('@arcgis/core/widgets/ElevationProfile'),
    'ElevationProfile'
  );

  useWidget({
    Module,
    view,
    config: {
      profiles,
      unit,
      visibleElements
    },
    position,
    onLoad
  });

  return null;
}

export default ElevationProfile;
