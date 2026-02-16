import { useCalciteMode } from './useCalciteMode';
import { useArcGISTheme } from './useArcGISTheme';
import type { CalciteMode } from './useCalciteMode';
import type { ArcGISTheme } from './useArcGISTheme';

export type Theme = 'light' | 'dark';
export type ThemeMode = Theme | 'auto';

export type { CalciteMode, ArcGISTheme };

/**
 * Unified hook to manage both Calcite and ArcGIS themes together
 * 
 * This hook synchronizes the theme across both Calcite components and ArcGIS maps.
 * When mode is 'auto', it follows the system preference for Calcite, but uses
 * the resolved theme for ArcGIS (since ArcGIS doesn't support auto mode).
 * 
 * @param mode - The theme mode: 'light', 'dark', or 'auto' (auto follows system preference)
 * @param options - Optional configuration
 * @param options.syncArcGIS - Whether to sync ArcGIS theme (default: true)
 * 
 * @example
 * ```tsx
 * function App() {
 *   const [theme, setTheme] = useState<ThemeMode>('light');
 *   useTheme(theme);
 *   
 *   return (
 *     <CalciteShell>
 *       <CalciteShellPanel slot="panel-start">
 *         <CalcitePanel heading="Settings">
 *           <CalciteButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *             Toggle Theme
 *           </CalciteButton>
 *         </CalcitePanel>
 *       </CalciteShellPanel>
 *       
 *       <Map basemap="topo-vector">
 *         <MapView center={[-118.805, 34.027]} zoom={13} />
 *       </Map>
 *     </CalciteShell>
 *   );
 * }
 * ```
 */
export function useTheme(
  mode: ThemeMode = 'light',
  options?: { syncArcGIS?: boolean }
) {
  const { syncArcGIS = true } = options || {};
  
  // Set Calcite mode (supports 'auto')
  useCalciteMode(mode as CalciteMode);
  
  // For ArcGIS, resolve 'auto' to the actual theme
  if (syncArcGIS) {
    let arcgisTheme: ArcGISTheme = 'light';
    
    if (mode === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      arcgisTheme = prefersDark ? 'dark' : 'light';
    } else {
      arcgisTheme = mode as ArcGISTheme;
    }
    
    useArcGISTheme(arcgisTheme);
  }
}

/**
 * Gets the current system theme preference
 * 
 * @returns 'light' or 'dark' based on system preference
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Hook that returns the current system theme and listens for changes
 * 
 * @returns The current system theme preference
 * 
 * @example
 * ```tsx
 * function App() {
 *   const systemTheme = useSystemTheme();
 *   const [mode, setMode] = useState<ThemeMode>('auto');
 *   
 *   useTheme(mode);
 *   
 *   return (
 *     <div>
 *       <p>System preference: {systemTheme}</p>
 *       <CalciteButton onClick={() => setMode('auto')}>Use System</CalciteButton>
 *       <CalciteButton onClick={() => setMode('light')}>Light</CalciteButton>
 *       <CalciteButton onClick={() => setMode('dark')}>Dark</CalciteButton>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSystemTheme(): Theme {
  const [theme, setTheme] = React.useState<Theme>(getSystemTheme);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  return theme;
}

// Need to import React for the hooks
import React from 'react';
