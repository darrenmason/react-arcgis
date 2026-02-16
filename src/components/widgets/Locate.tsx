import type EsriLocate from '@arcgis/core/widgets/Locate';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { useEffect } from 'react';

export interface LocateProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  graphic?: __esri.Graphic;
  scale?: number;
  useHeadingEnabled?: boolean;
  goToLocationEnabled?: boolean;
  rotationEnabled?: boolean;
  onLocate?: (event: any) => void;
  onLocateError?: (error: any) => void;
  onLoad?: (widget: EsriLocate) => void;
}

/**
 * Locate widget component - Geolocation
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Locate
 *     position="top-left"
 *     useHeadingEnabled={true}
 *     onLocate={(event) => console.log('Location:', event.position)}
 *   />
 * </MapView>
 * ```
 */
export function Locate({
  view: propView,
  position = 'top-left',
  graphic,
  scale,
  useHeadingEnabled = true,
  goToLocationEnabled = true,
  rotationEnabled = true,
  onLocate,
  onLocateError,
  onLoad
}: LocateProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriLocate>(
    () => import('@arcgis/core/widgets/Locate'),
    'Locate'
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

    if (onLocate) {
      handles.push((widget as any).on('locate', onLocate));
    }

    if (onLocateError) {
      handles.push((widget as any).on('locate-error', onLocateError));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onLocate, onLocateError]);

  return null;
}

export default Locate;
