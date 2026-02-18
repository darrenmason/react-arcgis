# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-02-18

### Added
- **WebMap & WebScene** components for loading portal items
- **Layer components**: TileLayer, VectorTileLayer, WebTileLayer, MapImageLayer, ImageryLayer, ImageryTileLayer, CSVLayer, GeoJSONLayer, KMLLayer, WMSLayer, WMTSLayer, WFSLayer, OGCFeatureLayer, SceneLayer, BuildingSceneLayer, IntegratedMeshLayer, PointCloudLayer, StreamLayer, ElevationLayer, GroupLayer, SubtypeGroupLayer
- **Widget components**: BasemapToggle, Compass, Expand, Home, LayerList, Legend, Locate, NavigationToggle, Popup, ScaleBar, Search, Sketch, Measurement, Swipe, Zoom, Attribution
- **Portal hooks**: usePortal, usePortalItem, usePortalUser, usePortalGroup, usePortalContent, usePortalSearch, useOAuthInfo
- **Analysis hooks**: useRouteAnalysis, useClosestFacility, useQueryFeatures, useSpatialQuery, useGeometryMeasurement, useBufferAnalysis, useGeocoding, useIdentify
- **Theme / mode**: useCalciteMode hook and theme support for Calcite
- **Docs app**: Vite + React docs app with live component examples, prop tables, and code samples (in `docs-app/`)

### Changed
- MapView and SceneView use a dedicated view container so widgets render correctly in the map UI overlay
- BaseMapProps: `ground` accepts `string | __esri.Ground | __esri.GroundProperties`; `children` supported
- useGraphic: options typed as `Pick<__esri.GraphicProperties, 'geometry' | 'symbol' | 'attributes' | 'popupTemplate'>` for proper geometry/symbol unions
- useEsriModule supports modules without default export (e.g. geometryEngine, locator)
- useWidget: position may be `null` (e.g. Swipe); proper DestroyableWidget typing
- KMLLayer: refreshInterval set in useEffect instead of usePropertyUpdater
- Rollup: moduleContext for `@esri/calcite-components-react` to fix "this has been rewritten to undefined"
- Documentation reorganized under `docs/` with guides and API reference

### Fixed
- Type errors for ground, useGraphic geometry/symbol, and related usage resolved at library level (no `any` in public API)
- Calcite CORS and asset loading in docs-app (Vite `server.fs.allow` for parent and node_modules)
- Portal and analysis hooks: nullish handling, API usage, and type casts where SDK types are incomplete

## [1.1.0] - 2026-02-12

### Added
- Full Calcite Design System integration via `@esri/calcite-components-react`
- All Calcite web components exported as React components
- CalciteExample demonstrating Calcite + ArcGIS integration
- CALCITE.md documentation with patterns and examples
- Automatic asset path configuration for Calcite icons

## [1.0.0] - 2026-02-12

### Added
- Initial release of React ArcGIS wrapper library
- Core components: Map, MapView, SceneView
- Layer components: FeatureLayer, GraphicsLayer, GeoJSONLayer
- Custom hooks: useView, useSearch, useBasemapGallery, useSketchViewModel, useGraphic
- Full TypeScript support with type definitions
- ViewContext for sharing view and map across components
- Comprehensive examples and documentation
- Proper React lifecycle management for all ArcGIS objects
- Props-based configuration for all components
- Automatic cleanup on component unmount
