import type EsriTimeSlider from '@arcgis/core/widgets/TimeSlider';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { useEffect } from 'react';

export interface TimeSliderProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  fullTimeExtent?: __esri.TimeExtent;
  mode?: 'instant' | 'time-window' | 'cumulative-from-start' | 'cumulative-from-end';
  playRate?: number;
  stops?: __esri.TimeSliderStops;
  loop?: boolean;
  onTimeExtentChange?: (event: any) => void;
  onLoad?: (widget: EsriTimeSlider) => void;
}

/**
 * TimeSlider widget component - Temporal data visualization
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <TimeSlider
 *     position="bottom"
 *     mode="time-window"
 *     playRate={1000}
 *     loop={true}
 *     onTimeExtentChange={(event) => {
 *       console.log('Time changed:', event.timeExtent);
 *     }}
 *   />
 * </MapView>
 * ```
 */
export function TimeSlider({
  view: propView,
  position = 'bottom',
  fullTimeExtent,
  mode = 'time-window',
  playRate = 1000,
  stops,
  loop = true,
  onTimeExtentChange,
  onLoad
}: TimeSliderProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriTimeSlider>(
    () => import('@arcgis/core/widgets/TimeSlider'),
    'TimeSlider'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: {
      fullTimeExtent,
      mode,
      playRate,
      stops,
      loop
    },
    position,
    onLoad
  });

  // Event handlers
  useEffect(() => {
    if (!widget || !onTimeExtentChange) return;

    const handle = (widget as any).watch('timeExtent', (newValue: any) => {
      onTimeExtentChange({ timeExtent: newValue });
    });

    return () => {
      handle?.remove();
    };
  }, [widget, onTimeExtentChange]);

  return null;
}

export default TimeSlider;
