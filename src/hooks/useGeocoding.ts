import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface GeocodeOptions {
  address?: string | __esri.AddressCandidate;
  location?: __esri.Point;
  maxLocations?: number;
  outFields?: string[];
  categories?: string[];
}

/**
 * Hook for geocoding and reverse geocoding
 * 
 * @example
 * ```tsx
 * function AddressSearch() {
 *   const { geocode, reverseGeocode, results, loading } = useGeocoding();
 *   
 *   const handleSearch = async () => {
 *     const results = await geocode({
 *       address: "380 New York St, Redlands, CA",
 *       maxLocations: 5
 *     });
 *     console.log('Found:', results);
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={handleSearch}>Search</button>
 *       {loading && <p>Searching...</p>}
 *       {results && results.map(r => (
 *         <div key={r.address}>{r.address}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useGeocoding(serviceUrl: string = 'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer') {
  const [results, setResults] = useState<__esri.AddressCandidate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: locatorModule } = useEsriModule<any>(
    () => import('@arcgis/core/rest/locator'),
    'locator'
  );

  const geocode = useCallback(async (options: GeocodeOptions) => {
    if (!locatorModule) {
      throw new Error('Locator module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        address: options.address || {},
        maxLocations: options.maxLocations,
        outFields: options.outFields,
        categories: options.categories
      };

      const response = await locatorModule.addressToLocations(serviceUrl, params);
      setResults(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Geocoding error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [locatorModule, serviceUrl]);

  const reverseGeocode = useCallback(async (location: __esri.Point) => {
    if (!locatorModule) {
      throw new Error('Locator module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await locatorModule.locationToAddress(serviceUrl, {
        location
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Reverse geocoding error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [locatorModule, serviceUrl]);

  const suggest = useCallback(async (text: string, options?: { maxSuggestions?: number; location?: __esri.Point }) => {
    if (!locatorModule) {
      throw new Error('Locator module not loaded');
    }

    try {
      const response = await locatorModule.suggestLocations(serviceUrl, {
        text,
        ...options
      });
      return response;
    } catch (err) {
      console.error('Suggest error:', err);
      return [];
    }
  }, [locatorModule, serviceUrl]);

  return {
    geocode,
    reverseGeocode,
    suggest,
    results,
    loading,
    error
  };
}

export default useGeocoding;
