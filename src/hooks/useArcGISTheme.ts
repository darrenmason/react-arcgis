import { useEffect } from 'react';

export type ArcGISTheme = 'light' | 'dark';

/**
 * Hook to manage ArcGIS Maps SDK theme
 * 
 * @param theme - The theme: 'light' or 'dark'
 * 
 * @example
 * ```tsx
 * function App() {
 *   const [theme, setTheme] = useState<ArcGISTheme>('light');
 *   useArcGISTheme(theme);
 *   
 *   return (
 *     <Map basemap="topo-vector">
 *       <MapView center={[-118.805, 34.027]} zoom={13} />
 *     </Map>
 *   );
 * }
 * ```
 */
export function useArcGISTheme(theme: ArcGISTheme = 'light') {
  useEffect(() => {
    const linkId = 'arcgis-theme-link';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    // Create link element if it doesn't exist
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Update the href to the correct theme
    link.href = `https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/${theme}/main.css`;
    
    return () => {
      // Optional: Remove the link when component unmounts
      // Uncomment if you want to clean up on unmount
      // const existingLink = document.getElementById(linkId);
      // if (existingLink) {
      //   existingLink.remove();
      // }
    };
  }, [theme]);
}
