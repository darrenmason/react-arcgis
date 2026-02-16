import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface BufferOptions {
  distance: number;
  unit: __esri.LinearUnits;
  geodesic?: boolean;
  unionResults?: boolean;
}

/**
 * Hook for buffer geometry analysis
 * 
 * @example
 * ```tsx
 * function BufferTool() {
 *   const { buffer, bufferMultiple, loading } = useBufferAnalysis();
 *   
 *   const createBuffer = async (point) => {
 *     const buffered = await buffer(point, {
 *       distance: 5,
 *       unit: 'miles',
 *       geodesic: true
 *     });
 *     
 *     // Add buffer to map
 *     graphicsLayer.add(new Graphic({
 *       geometry: buffered,
 *       symbol: { type: 'simple-fill', color: [255, 0, 0, 0.3] }
 *     }));
 *   };
 *   
 *   const createMultipleBuffers = async (points) => {
 *     const buffers = await bufferMultiple(points, {
 *       distance: 10,
 *       unit: 'kilometers',
 *       unionResults: false
 *     });
 *     
 *     buffers.forEach(buffer => {
 *       graphicsLayer.add(new Graphic({ geometry: buffer }));
 *     });
 *   };
 *   
 *   return <div>Buffer Analysis</div>;
 * }
 * ```
 */
export function useBufferAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: geometryEngineModule } = useEsriModule(
    () => import('@arcgis/core/geometry/geometryEngine'),
    'geometryEngine'
  );

  const buffer = useCallback(async (
    geometry: __esri.Geometry,
    options: BufferOptions
  ) => {
    if (!geometryEngineModule) {
      throw new Error('GeometryEngine module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const buffered = (geometryEngineModule as any).buffer(
        geometry,
        options.distance,
        options.unit,
        options.geodesic !== false
      );

      return buffered;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [geometryEngineModule]);

  const bufferMultiple = useCallback(async (
    geometries: __esri.Geometry[],
    options: BufferOptions
  ) => {
    if (!geometryEngineModule) {
      throw new Error('GeometryEngine module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const buffers = (geometryEngineModule as any).buffer(
        geometries,
        options.distance,
        options.unit,
        options.geodesic !== false
      );

      if (options.unionResults) {
        const union = (geometryEngineModule as any).union(buffers);
        return [union];
      }

      return buffers;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [geometryEngineModule]);

  return {
    buffer,
    bufferMultiple,
    loading,
    error
  };
}

export default useBufferAnalysis;
