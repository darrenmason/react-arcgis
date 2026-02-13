import React, { useEffect, useRef, useState } from 'react';
import type { MapViewProps } from '../types';
import type EsriMapView from '@arcgis/core/views/MapView';
import { ViewProvider } from '../context/ViewContext';

export const MapView: React.FC<MapViewProps> = ({
  map,
  center,
  zoom = 10,
  scale,
  extent,
  rotation,
  ui,
  constraints,
  onLoad,
  onViewReady,
  onClick,
  onPointerMove,
  className,
  style,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EsriMapView | null>(null);
  const [view, setView] = useState<EsriMapView | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !map) return;

    let mounted = true;

    const initializeView = async () => {
      try {
        const [MapView] = await Promise.all([
          import('@arcgis/core/views/MapView')
        ]);

        if (!mounted || !containerRef.current) return;

        const viewInstance = new MapView.default({
          container: containerRef.current,
          map: map as any,
          center: center as any,
          zoom,
          scale,
          extent: extent as any,
          rotation,
          constraints: constraints as any
        });

        // Configure UI components
        if (ui?.components) {
          ui.components.forEach((component) => {
            if (component.startsWith('-')) {
              viewInstance.ui.remove(component.substring(1));
            }
          });
        }

        viewRef.current = viewInstance;
        setView(viewInstance);
        onLoad?.(viewInstance);

        // Wait for view to be ready
        await viewInstance.when();
        if (mounted) {
          setIsReady(true);
          onViewReady?.(viewInstance);
        }
      } catch (error) {
        console.error('Error initializing MapView:', error);
      }
    };

    initializeView();

    return () => {
      mounted = false;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [map]);

  // Update center
  useEffect(() => {
    if (view && center && isReady) {
      view.center = center as any;
    }
  }, [view, center, isReady]);

  // Update zoom
  useEffect(() => {
    if (view && zoom !== undefined && isReady) {
      view.zoom = zoom;
    }
  }, [view, zoom, isReady]);

  // Update scale
  useEffect(() => {
    if (view && scale !== undefined && isReady) {
      view.scale = scale;
    }
  }, [view, scale, isReady]);

  // Update rotation
  useEffect(() => {
    if (view && rotation !== undefined && isReady) {
      view.rotation = rotation;
    }
  }, [view, rotation, isReady]);

  // Handle click events
  useEffect(() => {
    if (!view || !onClick) return;

    const handle = view.on('click', onClick);
    return () => handle.remove();
  }, [view, onClick]);

  // Handle pointer move events
  useEffect(() => {
    if (!view || !onPointerMove) return;

    const handle = view.on('pointer-move', onPointerMove);
    return () => handle.remove();
  }, [view, onPointerMove]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      {view && (
        <ViewProvider value={{ view, map: map || null }}>
          {children}
        </ViewProvider>
      )}
    </div>
  );
};

export default MapView;
