import { useState, useEffect } from 'react';

export function useEsriModule<T>(
  importFn: () => Promise<{ default: new (...args: any[]) => T }>,
  moduleName: string
) {
  const [Module, setModule] = useState<(new (...args: any[]) => T) | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadModule = async () => {
      try {
        const [module] = await Promise.all([importFn()]);
        if (mounted) {
          setModule(() => module.default);
        }
      } catch (err) {
        if (mounted) {
          console.error(`Error loading ${moduleName}:`, err);
          setError(err as Error);
        }
      }
    };

    loadModule();

    return () => {
      mounted = false;
    };
  }, []);

  return { Module, error };
}
