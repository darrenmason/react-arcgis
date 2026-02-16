import type EsriHistogramRangeSlider from '@arcgis/core/widgets/HistogramRangeSlider';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useEffect, useRef, useState } from 'react';

export interface HistogramRangeSliderProps {
  container?: HTMLElement | string;
  min?: number;
  max?: number;
  values?: number[];
  bins?: any[];
  labelFormatFunction?: (value: number) => string;
  rangeType?: 'equal' | 'greater-than' | 'less-than' | 'at-least' | 'at-most';
  standardDeviationCount?: number;
  onValueChange?: (values: number[]) => void;
  onLoad?: (widget: EsriHistogramRangeSlider) => void;
}

/**
 * HistogramRangeSlider widget component - Filter data with histogram
 * 
 * @example
 * ```tsx
 * <div id="slider-container" />
 * 
 * <HistogramRangeSlider
 *   container="slider-container"
 *   min={0}
 *   max={1000000}
 *   values={[100000, 900000]}
 *   onValueChange={(values) => {
 *     setDefinitionExpression(`POP BETWEEN ${values[0]} AND ${values[1]}`);
 *   }}
 * />
 * ```
 */
export function HistogramRangeSlider({
  container,
  min,
  max,
  values,
  bins,
  labelFormatFunction,
  rangeType,
  standardDeviationCount,
  onValueChange,
  onLoad
}: HistogramRangeSliderProps) {
  const [widget, setWidget] = useState<EsriHistogramRangeSlider | null>(null);
  const widgetRef = useRef<EsriHistogramRangeSlider | null>(null);

  const { Module } = useEsriModule<EsriHistogramRangeSlider>(
    () => import('@arcgis/core/widgets/HistogramRangeSlider'),
    'HistogramRangeSlider'
  );

  useEffect(() => {
    if (!Module || !container) return;

    let mounted = true;

    const initializeWidget = async () => {
      try {
        const sliderWidget = new Module({
          container,
          min,
          max,
          values,
          bins,
          labelFormatFunction,
          rangeType,
          standardDeviationCount
        } as any);

        if (!mounted) {
          sliderWidget.destroy();
          return;
        }

        widgetRef.current = sliderWidget;
        setWidget(sliderWidget);
        onLoad?.(sliderWidget);
      } catch (error) {
        console.error('Error initializing HistogramRangeSlider:', error);
      }
    };

    initializeWidget();

    return () => {
      mounted = false;
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, [Module, container]);

  // Watch for value changes
  useEffect(() => {
    if (!widget || !onValueChange) return;

    const handle = widget.watch('values', (newValues: number[]) => {
      onValueChange(newValues);
    });

    return () => {
      handle?.remove();
    };
  }, [widget, onValueChange]);

  return null;
}

export default HistogramRangeSlider;
