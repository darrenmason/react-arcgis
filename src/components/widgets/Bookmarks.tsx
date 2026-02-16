import type EsriBookmarks from '@arcgis/core/widgets/Bookmarks';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface BookmarksProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  bookmarks?: __esri.Bookmark[];
  editingEnabled?: boolean;
  onLoad?: (widget: EsriBookmarks) => void;
}

/**
 * Bookmarks widget component - Saved viewpoints
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Bookmarks
 *     position="top-right"
 *     editingEnabled={true}
 *     bookmarks={[
 *       {
 *         name: "San Francisco",
 *         viewpoint: { targetGeometry: { x: -122.419, y: 37.775 } }
 *       }
 *     ]}
 *   />
 * </MapView>
 * ```
 */
export function Bookmarks({
  view: propView,
  position = 'top-right',
  bookmarks,
  editingEnabled = true,
  onLoad
}: BookmarksProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriBookmarks>(
    () => import('@arcgis/core/widgets/Bookmarks'),
    'Bookmarks'
  );

  useWidget({
    Module,
    view,
    config: {
      bookmarks,
      editingEnabled
    },
    position,
    onLoad
  });

  return null;
}

export default Bookmarks;
