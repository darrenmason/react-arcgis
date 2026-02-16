import { useEffect } from 'react';

/**
 * Hook to watch property changes on an ArcGIS object
 * 
 * @example
 * ```tsx
 * function ViewWatcher() {
 *   const { view } = useView();
 *   
 *   useWatchUtils(view, 'zoom', (newZoom, oldZoom) => {
 *     console.log(`Zoom changed from ${oldZoom} to ${newZoom}`);
 *   });
 *   
 *   useWatchUtils(view, ['center', 'extent'], () => {
 *     console.log('View changed');
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useWatchUtils<T extends { watch?: any }>(
  target: T | null,
  propertyOrProperties: string | string[],
  callback: (newValue: any, oldValue?: any, propertyName?: string, target?: T) => void,
  options?: { sync?: boolean; initial?: boolean }
) {
  useEffect(() => {
    if (!target || !target.watch) return;

    const properties = Array.isArray(propertyOrProperties) 
      ? propertyOrProperties 
      : [propertyOrProperties];

    const handles = properties.map(property => {
      return target.watch(property, callback, options?.sync);
    });

    // Call with initial values if requested
    if (options?.initial) {
      properties.forEach(property => {
        const value = (target as any)[property];
        callback(value, undefined, property, target);
      });
    }

    return () => {
      handles.forEach(handle => handle?.remove());
    };
  }, [target, propertyOrProperties, callback, options?.sync, options?.initial]);
}

/**
 * Hook to watch when a property becomes truthy/loaded
 * 
 * @example
 * ```tsx
 * function LayerLoader() {
 *   const [layer, setLayer] = useState(null);
 *   
 *   useWatchWhen(layer, 'loaded', (loaded) => {
 *     console.log('Layer is loaded:', loaded);
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function useWatchWhen<T extends { watch?: any }>(
  target: T | null,
  property: string,
  callback: (value: any) => void,
  options?: { once?: boolean }
) {
  useEffect(() => {
    if (!target || !target.watch) return;

    const handle = target.watch(property, (value: any) => {
      if (value) {
        callback(value);
        if (options?.once) {
          handle?.remove();
        }
      }
    });

    return () => {
      handle?.remove();
    };
  }, [target, property, callback, options?.once]);
}

export default useWatchUtils;
