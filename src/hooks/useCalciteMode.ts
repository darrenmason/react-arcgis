import { useEffect } from 'react';

export type CalciteMode = 'light' | 'dark' | 'auto';

/**
 * Hook to manage Calcite Design System mode (light/dark/auto)
 * 
 * @param mode - The theme mode: 'light', 'dark', or 'auto' (follows system preference)
 * 
 * @example
 * ```tsx
 * function App() {
 *   const [mode, setMode] = useState<CalciteMode>('light');
 *   useCalciteMode(mode);
 *   
 *   return (
 *     <CalciteShell>
 *       <CalciteButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
 *         Toggle Theme
 *       </CalciteButton>
 *     </CalciteShell>
 *   );
 * }
 * ```
 */
export function useCalciteMode(mode: CalciteMode = 'light') {
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove existing mode classes
    html.classList.remove('calcite-mode-light', 'calcite-mode-dark', 'calcite-mode-auto');
    
    // Add the new mode class
    html.classList.add(`calcite-mode-${mode}`);
    
    // Also set as data attribute for easier CSS targeting
    html.setAttribute('data-calcite-mode', mode);
    
    return () => {
      html.classList.remove(`calcite-mode-${mode}`);
      html.removeAttribute('data-calcite-mode');
    };
  }, [mode]);
}
