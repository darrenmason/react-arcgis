import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface MeasurementResult {
  value: number;
  unit: string | number;
}

/**
 * Hook for measuring geometry (distance, area, length)
 * 
 * @example
 * ```tsx
 * function MeasurementTool() {
 *   const { 
 *     measureDistance, 
 *     measureArea, 
 *     measureLength,
 *     loading 
 *   } = useGeometryMeasurement();
 *   
 *   const measureLine = async (polyline) => {
 *     const distance = await measureDistance(polyline, 'miles');
 *     console.log(`Distance: ${distance.value} ${distance.unit}`);
 *   };
 *   
 *   const measurePolygon = async (polygon) => {
 *     const area = await measureArea(polygon, 'square-miles');
 *     const perimeter = await measureLength(polygon, 'miles');
 *     
 *     console.log(`Area: ${area.value} ${area.unit}`);
 *     console.log(`Perimeter: ${perimeter.value} ${perimeter.unit}`);
 *   };
 *   
 *   return <div>Measurement Tools</div>;
 * }
 * ```
 */
export function useGeometryMeasurement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: geometryEngineModule } = useEsriModule(
    () => import('@arcgis/core/geometry/geometryEngine'),
    'geometryEngine'
  );

  const measureDistance = useCallback(async (
    geometry1: __esri.Geometry,
    geometry2: __esri.Geometry | null,
    unit: __esri.LinearUnits = 'meters'
  ): Promise<MeasurementResult> => {
    if (!geometryEngineModule) {
      throw new Error('GeometryEngine module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      let distance: number;
      
      if (geometry2) {
        distance = (geometryEngineModule as any).distance(geometry1, geometry2, unit);
      } else {
        // If only one geometry, measure its length
        distance = (geometryEngineModule as any).geodesicLength(geometry1, unit);
      }

      return { value: distance, unit };
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [geometryEngineModule]);

  const measureArea = useCallback(async (
    geometry: __esri.Polygon,
    unit: __esri.AreaUnits = 'square-meters'
  ): Promise<MeasurementResult> => {
    if (!geometryEngineModule) {
      throw new Error('GeometryEngine module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const area = (geometryEngineModule as any).geodesicArea(geometry, unit);
      return { value: Math.abs(area), unit };
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [geometryEngineModule]);

  const measureLength = useCallback(async (
    geometry: __esri.Polyline | __esri.Polygon,
    unit: __esri.LinearUnits = 'meters'
  ): Promise<MeasurementResult> => {
    if (!geometryEngineModule) {
      throw new Error('GeometryEngine module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const length = (geometryEngineModule as any).geodesicLength(geometry, unit);
      return { value: Math.abs(length), unit };
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [geometryEngineModule]);

  return {
    measureDistance,
    measureArea,
    measureLength,
    loading,
    error
  };
}

export default useGeometryMeasurement;
