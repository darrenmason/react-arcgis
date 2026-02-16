import { useEffect, useRef, useState } from 'react';

interface UseEsriViewOptions<T> {
  Module: (new (...args: any[]) => T) | null;
  container: HTMLDivElement | null;
  config: any;
  onLoad?: (view: T) => void;
  onViewReady?: (view: T) => void;
}

export function useEsriView<T extends { destroy: () => void; when: () => Promise<any> }>(
  options: UseEsriViewOptions<T>
) {
  const { Module, container, config, onLoad, onViewReady } = options;
  const viewRef = useRef<T | null>(null);
  const [view, setView] = useState<T | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!container || !Module || !config.map) return;

    let mounted = true;

    const initializeView = async () => {
      try {
        const viewInstance = new Module({
          container,
          ...config
        });

        viewRef.current = viewInstance;
        setView(viewInstance);
        onLoad?.(viewInstance);

        await viewInstance.when();
        if (mounted) {
          setIsReady(true);
          onViewReady?.(viewInstance);
        }
      } catch (error) {
        console.error('Error initializing view:', error);
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
  }, [Module, container, config.map]);

  return { view, isReady };
}
