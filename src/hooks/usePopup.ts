import { useEffect } from 'react';
import type { ViewType } from '../types';

export interface UsePopupOptions extends Omit<__esri.PopupProperties, 'view'> {
  view: ViewType | null;
}

/**
 * Hook to configure the view's popup
 * 
 * @example
 * ```tsx
 * function ConfigurePopup() {
 *   const { view } = useView();
 *   
 *   usePopup({
 *     view,
 *     title: "Feature Information",
 *     dockEnabled: true,
 *     dockOptions: {
 *       position: 'top-right',
 *       breakpoint: false
 *     }
 *   });
 *   
 *   return null;
 * }
 * ```
 */
export function usePopup(options: UsePopupOptions) {
  const { view, ...config } = options;

  useEffect(() => {
    if (!view?.popup) return;

    const popup = view.popup;

    (Object.keys(config) as (keyof typeof config)[]).forEach((key) => {
      const value = config[key];
      if (value === undefined) return;
      try {
        (popup as any).set(key, value);
      } catch {
        // ignore read-only or invalid keys
      }
    });
  }, [view, options]);

  return view?.popup ?? null;
}

export default usePopup;
