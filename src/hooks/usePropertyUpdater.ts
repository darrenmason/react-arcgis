import { useEffect } from 'react';

type PropertyUpdates<T> = {
  [K in keyof T]?: {
    value: T[K] | undefined;
    condition?: boolean;
  };
};

export function usePropertyUpdater<T extends Record<string, any>>(
  instance: T | null,
  updates: PropertyUpdates<T>
) {
  useEffect(() => {
    if (!instance) return;

    Object.entries(updates).forEach(([key, config]) => {
      if (!config) return;
      const { value, condition = true } = config as { value: any; condition?: boolean };
      
      if (condition && value !== undefined) {
        instance[key as keyof T] = value;
      }
    });
  }, [instance, ...Object.values(updates).map(u => u?.value)]);
}
