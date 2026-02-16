/**
 * Remove undefined properties from an object
 */
export const cleanConfig = <T extends Record<string, any>>(config: T): Partial<T> => {
  const cleaned = { ...config };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

/**
 * Initialize a layer with common logic
 */
export const initializeLayer = async <T>(
  LayerClass: any,
  config: Record<string, any>,
  mountedRef: React.MutableRefObject<boolean>,
  targetMap: any,
  onLoad?: (layer: T) => void
): Promise<T | null> => {
  if (!mountedRef.current) return null;

  const cleanedConfig = cleanConfig(config);
  const layer = new LayerClass.default(cleanedConfig);

  if (targetMap) {
    targetMap.add(layer);
  }

  onLoad?.(layer);
  return layer;
};
