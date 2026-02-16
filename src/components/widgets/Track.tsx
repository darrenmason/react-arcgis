import type EsriTrack from '@arcgis/core/widgets/Track';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { useEffect } from 'react';

export interface TrackProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  graphic?: __esri.Graphic;
  scale?: number;
  useHeadingEnabled?: boolean;
  goToLocationEnabled?: boolean;
  rotationEnabled?: boolean;
  onTrack?: (event: any) => void;
  onTrackError?: (error: any) => void;
  onLoad?: (widget: EsriTrack) => void;
}

/**
 * Track widget component - Continuous GPS tracking
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Track
 *     position="top-left"
 *     useHeadingEnabled={true}
 *     rotationEnabled={true}
 *     onTrack={(event) => console.log('Position:', event.position)}
 *   />
 * </MapView>
 * ```
 */
export function Track({
  view: propView,
  position = 'top-left',
  graphic,
  scale,
  useHeadingEnabled = true,
  goToLocationEnabled = true,
  rotationEnabled = true,
  onTrack,
  onTrackError,
  onLoad
}: TrackProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriTrack>(
    () => import('@arcgis/core/widgets/Track'),
    'Track'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: {
      graphic,
      scale,
      useHeadingEnabled,
      goToLocationEnabled,
      rotationEnabled
    },
    position,
    onLoad
  });

  // Event handlers
  useEffect(() => {
    if (!widget) return;

    const handles: __esri.Handle[] = [];

    if (onTrack) {
      handles.push((widget as any).on('track', onTrack));
    }

    if (onTrackError) {
      handles.push((widget as any).on('track-error', onTrackError));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onTrack, onTrackError]);

  return null;
}

export default Track;
