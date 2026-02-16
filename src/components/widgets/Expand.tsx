import React, { useEffect, useRef, useState } from 'react';
import type EsriExpand from '@arcgis/core/widgets/Expand';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';

export interface ExpandProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  content: HTMLElement | __esri.Widget | string | React.ReactNode;
  expanded?: boolean;
  expandIcon?: string;
  expandTooltip?: string;
  mode?: 'floating' | 'drawer' | 'auto';
  group?: string;
  onExpand?: () => void;
  onCollapse?: () => void;
  onLoad?: (widget: EsriExpand) => void;
  children?: React.ReactNode;
}

/**
 * Expand widget component - Expandable container for other widgets
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Expand
 *     position="top-right"
 *     expandIcon="layers"
 *     expandTooltip="Layers"
 *   >
 *     <div>
 *       <h3>Custom Content</h3>
 *       <LayerList />
 *     </div>
 *   </Expand>
 * </MapView>
 * ```
 */
export function Expand({
  view: propView,
  position = 'top-right',
  content,
  expanded = false,
  expandIcon = 'chevrons-right',
  expandTooltip,
  mode = 'auto',
  group,
  onExpand,
  onCollapse,
  onLoad,
  children
}: ExpandProps) {
  const contextView = useView();
  const view = propView || contextView.view;
  const containerRef = useRef<HTMLDivElement>(null);
  const [widget, setWidget] = useState<EsriExpand | null>(null);

  const { Module } = useEsriModule<EsriExpand>(
    () => import('@arcgis/core/widgets/Expand'),
    'Expand'
  );

  useEffect(() => {
    if (!view || !Module) return;

    let mounted = true;

    const initializeWidget = async () => {
      try {
        // Determine content
        let widgetContent = content;
        if (children && containerRef.current) {
          widgetContent = containerRef.current;
        }

        const expandWidget = new Module({
          view: view as any,
          content: widgetContent as any,
          expanded,
          expandIcon,
          expandTooltip,
          mode,
          group
        });

        if (!mounted) {
          expandWidget.destroy();
          return;
        }

        setWidget(expandWidget);
        view.ui.add(expandWidget, position);
        onLoad?.(expandWidget);
      } catch (error) {
        console.error('Error initializing Expand widget:', error);
      }
    };

    initializeWidget();

    return () => {
      mounted = false;
      if (widget) {
        if (view.ui) {
          view.ui.remove(widget);
        }
        widget.destroy();
      }
    };
  }, [view, Module, position]);

  // Event handlers
  useEffect(() => {
    if (!widget) return;

    const handles: __esri.Handle[] = [];

    if (onExpand) {
      handles.push((widget as any).watch('expanded', (expanded: boolean) => {
        if (expanded) onExpand();
      }));
    }

    if (onCollapse) {
      handles.push((widget as any).watch('expanded', (expanded: boolean) => {
        if (!expanded) onCollapse();
      }));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onExpand, onCollapse]);

  return children ? (
    <div ref={containerRef} style={{ display: 'none' }}>
      {children}
    </div>
  ) : null;
}

export default Expand;
