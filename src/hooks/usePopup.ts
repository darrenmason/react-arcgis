import { useEffect } from 'react';
import type { ViewType } from '../types';

export interface UsePopupOptions {
  view: ViewType | null;
  title?: string;
  content?: string | HTMLElement | ((feature: __esri.Graphic) => string | HTMLElement);
  actions?: __esri.ActionButton[] | __esri.ActionToggle[];
  dockEnabled?: boolean;
  dockOptions?: __esri.PopupDockOptions;
  autoOpenEnabled?: boolean;
  highlightEnabled?: boolean;
  visibleElements?: __esri.PopupVisibleElements;
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
    if (!view || !view.popup) return;

    const popup = view.popup;

    // Configure popup properties
    if (config.title !== undefined) popup.title = config.title;
    if (config.content !== undefined) popup.content = config.content as any;
    if (config.actions !== undefined) popup.actions = config.actions as any;
    if (config.dockEnabled !== undefined) popup.dockEnabled = config.dockEnabled;
    if (config.dockOptions !== undefined) popup.dockOptions = config.dockOptions as any;
    if (config.autoOpenEnabled !== undefined) (popup as any).autoOpenEnabled = config.autoOpenEnabled;
    if (config.highlightEnabled !== undefined) popup.highlightEnabled = config.highlightEnabled;
    if (config.visibleElements !== undefined) popup.visibleElements = config.visibleElements as any;

  }, [view, config]);

  return view?.popup || null;
}

export default usePopup;
