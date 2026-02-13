import { useState, useEffect } from 'react';
import type SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import type { ViewType } from '../types';

export interface UseSketchViewModelOptions {
  view: ViewType | null;
  layer: GraphicsLayer | null;
  onCreateComplete?: (event: __esri.SketchViewModelCreateEvent) => void;
  onUpdateComplete?: (event: __esri.SketchViewModelUpdateEvent) => void;
  onDeleteComplete?: (event: __esri.SketchViewModelDeleteEvent) => void;
}

export const useSketchViewModel = ({
  view,
  layer,
  onCreateComplete,
  onUpdateComplete,
  onDeleteComplete
}: UseSketchViewModelOptions) => {
  const [sketchVM, setSketchVM] = useState<SketchViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!view || !layer) return;

    let mounted = true;

    const initializeSketch = async () => {
      try {
        setLoading(true);
        const [SketchViewModel] = await Promise.all([
          import('@arcgis/core/widgets/Sketch/SketchViewModel')
        ]);

        if (!mounted || !view || !layer) return;

        const sketchViewModel = new SketchViewModel.default({
          view: view as any,
          layer: layer as any
        });

        // Setup event listeners
        if (onCreateComplete) {
          sketchViewModel.on('create', (event: any) => {
            if (event.state === 'complete') {
              onCreateComplete(event);
            }
          });
        }

        if (onUpdateComplete) {
          sketchViewModel.on('update', (event: any) => {
            if (event.state === 'complete') {
              onUpdateComplete(event);
            }
          });
        }

        if (onDeleteComplete) {
          sketchViewModel.on('delete', onDeleteComplete);
        }

        setSketchVM(sketchViewModel);
      } catch (error) {
        console.error('Error initializing sketch view model:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSketch();

    return () => {
      mounted = false;
      if (sketchVM) {
        sketchVM.destroy();
      }
    };
  }, [view, layer]);

  const create = (tool: 'point' | 'polyline' | 'polygon' | 'rectangle' | 'circle') => {
    if (sketchVM) {
      sketchVM.create(tool);
    }
  };

  const update = (graphics: __esri.Graphic | __esri.Graphic[]) => {
    if (sketchVM) {
      sketchVM.update(graphics as any);
    }
  };

  const cancel = () => {
    if (sketchVM) {
      sketchVM.cancel();
    }
  };

  return { sketchVM, loading, create, update, cancel };
};

export default useSketchViewModel;
