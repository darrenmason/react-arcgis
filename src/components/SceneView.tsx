import React, { useEffect, useRef, useState } from 'react';
import type { SceneViewProps } from '../types';
import type EsriSceneView from '@arcgis/core/views/SceneView';
import { ViewProvider } from '../context/ViewContext';

export const SceneView: React.FC<SceneViewProps> = ({
  map,
  center,
  zoom = 10,
  scale,
  camera,
  viewingMode = 'global',
  onLoad,
  onViewReady,
  onClick,
  className,
  style,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EsriSceneView | null>(null);
  const [view, setView] = useState<EsriSceneView | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !map) return;

    let mounted = true;

    const initializeView = async () => {
      try {
        const [SceneView] = await Promise.all([
          import('@arcgis/core/views/SceneView')
        ]);

        if (!mounted || !containerRef.current) return;

        const viewInstance = new SceneView.default({
          container: containerRef.current,
          map: map as any,
          center: center as any,
          zoom,
          scale,
          camera: camera as any,
          viewingMode
        });

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
        console.error('Error initializing SceneView:', error);
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

  // Update camera
  useEffect(() => {
    if (view && camera && isReady) {
      view.camera = camera as any;
    }
  }, [view, camera, isReady]);

  // Handle click events
  useEffect(() => {
    if (!view || !onClick) return;

    const handle = view.on('click', onClick);
    return () => handle.remove();
  }, [view, onClick]);

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

export default SceneView;
