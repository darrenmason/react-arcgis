import { useEffect, useRef } from 'react';

/**
 * Hook for managing mounted state in async operations
 */
export const useMountedState = () => {
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  return mountedRef;
};

/**
 * Hook for updating a view property when it changes
 */
export const useViewProperty = <T extends any>(
  view: any,
  property: string,
  value: T | undefined,
  isReady: boolean = true
) => {
  useEffect(() => {
    if (view && value !== undefined && isReady) {
      view[property] = value;
    }
  }, [view, value, isReady, property]);
};

/**
 * Hook for managing view event handlers
 */
export const useViewEvent = (
  view: any,
  eventName: string,
  handler: ((event: any) => void) | undefined
) => {
  useEffect(() => {
    if (!view || !handler) return;
    
    const handle = view.on(eventName, handler);
    return () => handle.remove();
  }, [view, eventName, handler]);
};

/**
 * Generic layer initialization cleanup
 */
export const useLayerCleanup = (
  layerRef: React.MutableRefObject<any>,
  targetMap: any
) => {
  useEffect(() => {
    return () => {
      if (layerRef.current && targetMap) {
        targetMap.remove(layerRef.current);
        layerRef.current.destroy();
        layerRef.current = null;
      }
    };
  }, [layerRef, targetMap]);
};

/**
 * Hook for updating layer property
 */
export const useLayerProperty = <T extends any>(
  layerRef: React.MutableRefObject<any>,
  property: string,
  value: T
) => {
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current[property] = value;
    }
  }, [layerRef, property, value]);
};
