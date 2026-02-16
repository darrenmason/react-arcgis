import type EsriSketch from '@arcgis/core/widgets/Sketch';
import type EsriGraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';
import { useEffect } from 'react';

export interface SketchProps {
  view?: __esri.MapView | __esri.SceneView;
  layer?: EsriGraphicsLayer;
  position?: string | __esri.UIAddPosition;
  creationMode?: 'update' | 'single';
  availableCreateTools?: ('point' | 'polyline' | 'polygon' | 'rectangle' | 'circle')[];
  defaultCreateOptions?: any;
  defaultUpdateOptions?: any;
  snappingOptions?: __esri.SnappingOptions;
  onCreate?: (event: any) => void;
  onUpdate?: (event: any) => void;
  onDelete?: (event: any) => void;
  onLoad?: (widget: EsriSketch) => void;
}

/**
 * Sketch widget component - Drawing and editing tools
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <GraphicsLayer onLoad={setGraphicsLayer} />
 *   <Sketch
 *     layer={graphicsLayer}
 *     position="top-right"
 *     availableCreateTools={["point", "polyline", "polygon", "rectangle"]}
 *     onCreate={(event) => {
 *       if (event.state === 'complete') {
 *         console.log('Created:', event.graphic);
 *       }
 *     }}
 *   />
 * </MapView>
 * ```
 */
export function Sketch({
  view: propView,
  layer,
  position = 'top-right',
  creationMode = 'update',
  availableCreateTools,
  defaultCreateOptions,
  defaultUpdateOptions,
  snappingOptions,
  onCreate,
  onUpdate,
  onDelete,
  onLoad
}: SketchProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriSketch>(
    () => import('@arcgis/core/widgets/Sketch'),
    'Sketch'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: {
      layer,
      creationMode,
      availableCreateTools,
      defaultCreateOptions,
      defaultUpdateOptions,
      snappingOptions
    },
    position,
    onLoad
  });

  // Event handlers
  useEffect(() => {
    if (!widget) return;

    const handles: __esri.Handle[] = [];

    if (onCreate) {
      handles.push((widget as any).on('create', onCreate));
    }

    if (onUpdate) {
      handles.push((widget as any).on('update', onUpdate));
    }

    if (onDelete) {
      handles.push((widget as any).on('delete', onDelete));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onCreate, onUpdate, onDelete]);

  return null;
}

export default Sketch;
