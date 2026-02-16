# Analysis Hooks Guide

Complete guide to specialized query and analysis hooks for advanced GIS operations in React ArcGIS.

## Table of Contents

- [Overview](#overview)
- [Query Hooks](#query-hooks)
- [Spatial Analysis](#spatial-analysis)
- [Geometry Operations](#geometry-operations)
- [Network Analysis](#network-analysis)
- [Complete Examples](#complete-examples)

---

## Overview

React ArcGIS provides **8 specialized analysis hooks** for advanced GIS operations:

| Hook | Purpose | Use Case |
|------|---------|----------|
| **useQueryFeatures** | Advanced feature queries | Attribute + spatial filtering |
| **useStatistics** | Statistical calculations | Sum, avg, min, max, count |
| **useSpatialQuery** | Spatial operations | Nearby, within, intersects |
| **useIdentify** | Identify features | MapImageLayer identification |
| **useBufferAnalysis** | Buffer geometries | Distance analysis |
| **useGeometryMeasurement** | Measure geometries | Distance, area, length |
| **useRouteAnalysis** | Routing & service areas | Navigation, accessibility |
| **useClosestFacility** | Find nearest facilities | Proximity analysis |

---

## Query Hooks

### useQueryFeatures

Advanced feature queries with spatial and attribute filters.

```tsx
import { useQueryFeatures } from 'react-arcgis';

function AdvancedQuery() {
  const { query, queryExtent, queryCount, loading, results } = useQueryFeatures(featureLayer);
  
  const searchFeatures = async () => {
    const features = await query({
      where: "POP > 1000000",
      geometry: point,
      spatialRelationship: 'intersects',
      distance: 50,
      units: 'miles',
      outFields: ['NAME', 'POP', 'STATE'],
      returnGeometry: true,
      maxRecordCount: 100,
      orderByFields: ['POP DESC']
    });
    
    console.log('Found:', features.length);
  };
  
  const getExtent = async () => {
    const extent = await queryExtent({
      where: "STATE = 'CA'"
    });
    
    // Zoom to extent
    view.goTo(extent);
  };
  
  const getCount = async () => {
    const count = await queryCount({
      where: "POP > 500000",
      geometry: polygon
    });
    
    console.log('Count:', count);
  };
  
  return (
    <div>
      <CalciteButton onClick={searchFeatures} loading={loading}>
        Search Features
      </CalciteButton>
      
      {results && (
        <CalciteList>
          {results.map((feature, i) => (
            <CalciteListItem key={i}>
              {feature.attributes.NAME} - Population: {feature.attributes.POP}
            </CalciteListItem>
          ))}
        </CalciteList>
      )}
    </div>
  );
}
```

**Options:**
- `where` - SQL where clause
- `geometry` - Spatial filter geometry
- `spatialRelationship` - intersects, contains, within, etc.
- `distance` - Buffer distance
- `units` - Distance units
- `outFields` - Fields to return
- `returnGeometry` - Include geometry
- `maxRecordCount` - Limit results
- `orderByFields` - Sort order

---

### useStatistics

Calculate statistics on feature attributes.

```tsx
import { useStatistics } from 'react-arcgis';

function PopulationStatistics() {
  const { calculateStatistics, loading, results } = useStatistics(featureLayer);
  
  const getStats = async () => {
    const stats = await calculateStatistics({
      where: "STATE = 'CA'",
      statisticDefinitions: [
        {
          statisticType: 'sum',
          onStatisticField: 'POP2020',
          outStatisticFieldName: 'totalPop'
        },
        {
          statisticType: 'avg',
          onStatisticField: 'POP2020',
          outStatisticFieldName: 'avgPop'
        },
        {
          statisticType: 'max',
          onStatisticField: 'POP2020',
          outStatisticFieldName: 'maxPop'
        },
        {
          statisticType: 'min',
          onStatisticField: 'POP2020',
          outStatisticFieldName: 'minPop'
        },
        {
          statisticType: 'count',
          onStatisticField: 'OBJECTID',
          outStatisticFieldName: 'count'
        }
      ]
    });
    
    const attrs = stats[0].attributes;
    console.log('Total Population:', attrs.totalPop);
    console.log('Average Population:', attrs.avgPop);
    console.log('Max Population:', attrs.maxPop);
    console.log('Min Population:', attrs.minPop);
    console.log('City Count:', attrs.count);
  };
  
  const getGroupedStats = async () => {
    const stats = await calculateStatistics({
      statisticDefinitions: [
        {
          statisticType: 'sum',
          onStatisticField: 'POP2020',
          outStatisticFieldName: 'totalPop'
        }
      ],
      groupByFieldsForStatistics: ['STATE'],
      orderByFields: ['totalPop DESC']
    });
    
    stats.forEach(stat => {
      console.log(`${stat.attributes.STATE}: ${stat.attributes.totalPop}`);
    });
  };
  
  return (
    <CalciteButton onClick={getStats} loading={loading}>
      Calculate Statistics
    </CalciteButton>
  );
}
```

**Statistic Types:**
- `count` - Count features
- `sum` - Sum values
- `min` - Minimum value
- `max` - Maximum value
- `avg` - Average value
- `stddev` - Standard deviation
- `var` - Variance

---

## Spatial Analysis

### useSpatialQuery

Spatial query operations.

```tsx
import { useSpatialQuery } from 'react-arcgis';

function SpatialSearch() {
  const { findNearby, findWithin, findIntersecting, loading, results } = useSpatialQuery(featureLayer);
  
  const searchNearby = async (clickPoint) => {
    const features = await findNearby(clickPoint, {
      distance: 10,
      units: 'miles',
      where: "TYPE = 'Restaurant'",
      outFields: ['NAME', 'ADDRESS', 'RATING']
    });
    
    console.log(`Found ${features.length} restaurants within 10 miles`);
    
    // Add to map
    features.forEach(feature => {
      graphicsLayer.add(new Graphic({
        geometry: feature.geometry,
        attributes: feature.attributes,
        symbol: { type: 'simple-marker', color: 'red', size: 10 }
      }));
    });
  };
  
  const searchWithin = async (polygon) => {
    const features = await findWithin(polygon, {
      where: "POP > 50000",
      outFields: ['NAME', 'POP']
    });
    
    console.log(`Found ${features.length} cities in polygon`);
  };
  
  const searchIntersecting = async (line) => {
    const features = await findIntersecting(line, {
      where: "HIGHWAY = 'Interstate'",
      outFields: ['*']
    });
    
    console.log(`Intersecting ${features.length} highways`);
  };
  
  return (
    <CalciteShell>
      <CalcitePanel heading="Spatial Search">
        <CalciteButton onClick={() => searchNearby(point)}>
          Find Nearby
        </CalciteButton>
        <CalciteButton onClick={() => searchWithin(polygon)}>
          Find Within
        </CalciteButton>
        <CalciteButton onClick={() => searchIntersecting(line)}>
          Find Intersecting
        </CalciteButton>
      </CalcitePanel>
    </CalciteShell>
  );
}
```

---

### useIdentify

Identify features on MapImageLayer.

```tsx
import { useIdentify } from 'react-arcgis';

function IdentifyTool() {
  const { identify, loading, results } = useIdentify(mapImageLayer);
  
  const handleMapClick = async (event) => {
    const response = await identify({
      geometry: event.mapPoint,
      mapExtent: view.extent,
      width: view.width,
      height: view.height,
      tolerance: 3,
      layerOption: 'visible', // 'all', 'visible', or 'top'
      returnGeometry: true
    });
    
    response.forEach(result => {
      console.log('Layer:', result.layerName);
      console.log('Feature:', result.feature);
      
      // Show popup
      view.popup.open({
        title: result.layerName,
        location: event.mapPoint,
        content: createPopupContent(result.feature.attributes)
      });
    });
  };
  
  useEffect(() => {
    if (view) {
      view.on('click', handleMapClick);
    }
  }, [view]);
  
  return <div>Click map to identify features</div>;
}
```

---

## Geometry Operations

### useBufferAnalysis

Buffer geometry analysis.

```tsx
import { useBufferAnalysis } from 'react-arcgis';

function BufferTool() {
  const { buffer, bufferMultiple, loading } = useBufferAnalysis();
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  const createBuffer = async (point) => {
    const buffered = await buffer(point, {
      distance: 5,
      unit: 'miles',
      geodesic: true
    });
    
    // Add buffer to map
    graphicsLayer.add(new Graphic({
      geometry: buffered,
      symbol: {
        type: 'simple-fill',
        color: [255, 0, 0, 0.3],
        outline: { color: [255, 0, 0], width: 2 }
      }
    }));
    
    // Query features within buffer
    const features = await queryLayer(buffered);
    console.log(`Found ${features.length} features in buffer`);
  };
  
  const createMultipleBuffers = async (points) => {
    const buffers = await bufferMultiple(points, {
      distance: 10,
      unit: 'kilometers',
      geodesic: true,
      unionResults: false // Keep separate buffers
    });
    
    buffers.forEach((buffer, i) => {
      graphicsLayer.add(new Graphic({
        geometry: buffer,
        symbol: {
          type: 'simple-fill',
          color: [0, 0, 255, 0.2],
          outline: { color: [0, 0, 255], width: 1 }
        }
      }));
    });
  };
  
  const createUnionBuffer = async (points) => {
    const buffers = await bufferMultiple(points, {
      distance: 5,
      unit: 'miles',
      geodesic: true,
      unionResults: true // Merge overlapping buffers
    });
    
    // Will return single merged polygon
    graphicsLayer.add(new Graphic({ geometry: buffers[0] }));
  };
  
  return (
    <div>
      <GraphicsLayer onLoad={setGraphicsLayer} />
      <CalciteButton onClick={() => createBuffer(clickPoint)}>
        Create Buffer
      </CalciteButton>
    </div>
  );
}
```

---

### useGeometryMeasurement

Measure distance, area, and length.

```tsx
import { useGeometryMeasurement } from 'react-arcgis';

function MeasurementTool() {
  const { measureDistance, measureArea, measureLength, loading } = useGeometryMeasurement();
  const [measurements, setMeasurements] = useState({});
  
  const measurePolyline = async (polyline) => {
    const distance = await measureDistance(polyline, null, 'miles');
    setMeasurements({
      type: 'distance',
      value: distance.value.toFixed(2),
      unit: distance.unit
    });
  };
  
  const measurePolygon = async (polygon) => {
    const area = await measureArea(polygon, 'square-miles');
    const perimeter = await measureLength(polygon, 'miles');
    
    setMeasurements({
      type: 'polygon',
      area: area.value.toFixed(2),
      areaUnit: area.unit,
      perimeter: perimeter.value.toFixed(2),
      perimeterUnit: perimeter.unit
    });
  };
  
  const measureBetweenPoints = async (point1, point2) => {
    const distance = await measureDistance(point1, point2, 'kilometers');
    setMeasurements({
      type: 'point-to-point',
      value: distance.value.toFixed(2),
      unit: distance.unit
    });
  };
  
  return (
    <CalcitePanel heading="Measurements">
      {measurements.type === 'distance' && (
        <div>Distance: {measurements.value} {measurements.unit}</div>
      )}
      
      {measurements.type === 'polygon' && (
        <div>
          <div>Area: {measurements.area} {measurements.areaUnit}</div>
          <div>Perimeter: {measurements.perimeter} {measurements.perimeterUnit}</div>
        </div>
      )}
      
      {measurements.type === 'point-to-point' && (
        <div>Distance: {measurements.value} {measurements.unit}</div>
      )}
    </CalcitePanel>
  );
}
```

---

## Network Analysis

### useRouteAnalysis

Routing and service area analysis.

```tsx
import { useRouteAnalysis } from 'react-arcgis';

function RoutingTool() {
  const { solveRoute, calculateServiceArea, loading } = useRouteAnalysis(
    'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World'
  );
  
  const findRoute = async (start, end) => {
    const result = await solveRoute({
      stops: [
        new Graphic({ geometry: start }),
        new Graphic({ geometry: end })
      ],
      returnDirections: true,
      directionsLanguage: 'en',
      directionsLengthUnits: 'miles'
    });
    
    // Display route
    const route = result.routeResults[0].route;
    graphicsLayer.add(new Graphic({
      geometry: route.geometry,
      symbol: {
        type: 'simple-line',
        color: [0, 0, 255],
        width: 4
      }
    }));
    
    // Display directions
    const directions = result.routeResults[0].directions;
    console.log('Total Distance:', directions.totalLength, 'miles');
    console.log('Total Time:', directions.totalTime, 'minutes');
    
    directions.features.forEach((feature, i) => {
      console.log(`${i + 1}. ${feature.attributes.text}`);
    });
  };
  
  const findServiceAreas = async (facility) => {
    const result = await calculateServiceArea({
      facilities: [new Graphic({ geometry: facility })],
      defaultBreaks: [5, 10, 15], // 5, 10, 15 minute drive times
      travelDirection: 'from-facility'
    });
    
    // Display service area polygons
    result.serviceAreaPolygons.forEach((polygon, i) => {
      graphicsLayer.add(new Graphic({
        geometry: polygon.geometry,
        symbol: {
          type: 'simple-fill',
          color: [255, 0, 0, 0.3 - i * 0.1],
          outline: { color: [255, 0, 0], width: 2 }
        },
        attributes: { minutes: [5, 10, 15][i] }
      }));
    });
  };
  
  return (
    <div>
      <CalciteButton onClick={() => findRoute(startPoint, endPoint)} loading={loading}>
        Calculate Route
      </CalciteButton>
      <CalciteButton onClick={() => findServiceAreas(facilityPoint)} loading={loading}>
        Service Area
      </CalciteButton>
    </div>
  );
}
```

---

### useClosestFacility

Find nearest facilities from incidents.

```tsx
import { useClosestFacility } from 'react-arcgis';

function ClosestFacilityTool() {
  const { findClosestFacility, loading, results } = useClosestFacility(
    'https://route-api.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World'
  );
  
  const findNearest = async (incidentPoint, facilityPoints) => {
    const result = await findClosestFacility({
      incidents: [new Graphic({ geometry: incidentPoint })],
      facilities: facilityPoints.map(p => new Graphic({ geometry: p })),
      defaultTargetFacilityCount: 3, // Find 3 nearest
      returnRoutes: true,
      returnDirections: true,
      directionsLengthUnits: 'miles',
      travelDirection: 'to-facility' // or 'from-facility'
    });
    
    // Display routes to 3 nearest facilities
    result.routes.forEach((route, i) => {
      graphicsLayer.add(new Graphic({
        geometry: route.geometry,
        symbol: {
          type: 'simple-line',
          color: i === 0 ? [0, 255, 0] : [255, 165, 0],
          width: i === 0 ? 4 : 2
        }
      }));
      
      console.log(`Route ${i + 1}:`);
      console.log('  Distance:', route.attributes.Total_Miles, 'miles');
      console.log('  Time:', route.attributes.Total_TravelTime, 'minutes');
    });
  };
  
  return (
    <CalciteButton onClick={() => findNearest(incident, facilities)} loading={loading}>
      Find Nearest Facilities
    </CalciteButton>
  );
}
```

---

## Complete Examples

### Example 1: Interactive Query Dashboard

```tsx
import {
  useQueryFeatures,
  useStatistics,
  useSpatialQuery
} from 'react-arcgis';

function QueryDashboard() {
  const [featureLayer, setFeatureLayer] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  const { query, loading: queryLoading, results: queryResults } = useQueryFeatures(featureLayer);
  const { calculateStatistics, loading: statsLoading, results: statsResults } = useStatistics(featureLayer);
  const { findNearby, loading: spatialLoading, results: nearbyResults } = useSpatialQuery(featureLayer);
  
  const runQuery = async () => {
    await query({
      where: "POP > 1000000",
      outFields: ['*'],
      orderByFields: ['POP DESC']
    });
  };
  
  const runStats = async () => {
    await calculateStatistics({
      statisticDefinitions: [
        { statisticType: 'sum', onStatisticField: 'POP', outStatisticFieldName: 'totalPop' },
        { statisticType: 'avg', onStatisticField: 'POP', outStatisticFieldName: 'avgPop' },
        { statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'count' }
      ]
    });
  };
  
  const runSpatialQuery = async () => {
    if (selectedPoint) {
      await findNearby(selectedPoint, {
        distance: 50,
        units: 'miles',
        outFields: ['*']
      });
    }
  };
  
  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Query Tools">
          <CalciteButton onClick={runQuery} loading={queryLoading} width="full">
            Run Attribute Query
          </CalciteButton>
          <CalciteButton onClick={runStats} loading={statsLoading} width="full">
            Calculate Statistics
          </CalciteButton>
          <CalciteButton onClick={runSpatialQuery} loading={spatialLoading} width="full">
            Find Nearby
          </CalciteButton>
        </CalcitePanel>
      </CalciteShellPanel>
      
      <MapView>
        <FeatureLayer url="..." onLoad={setFeatureLayer} />
      </MapView>
    </CalciteShell>
  );
}
```

### Example 2: Advanced Spatial Analysis

```tsx
import {
  useBufferAnalysis,
  useSpatialQuery,
  useGeometryMeasurement
} from 'react-arcgis';

function SpatialAnalysisTool() {
  const { buffer } = useBufferAnalysis();
  const { findWithin } = useSpatialQuery(featureLayer);
  const { measureArea } = useGeometryMeasurement();
  
  const analyzeArea = async (point, distance) => {
    // 1. Create buffer
    const buffered = await buffer(point, {
      distance,
      unit: 'miles',
      geodesic: true
    });
    
    // 2. Measure buffer area
    const area = await measureArea(buffered, 'square-miles');
    console.log('Buffer area:', area.value, area.unit);
    
    // 3. Find features within buffer
    const features = await findWithin(buffered, {
      where: "TYPE = 'Park'",
      outFields: ['NAME', 'ACRES']
    });
    
    console.log(`Found ${features.length} parks within ${distance} miles`);
    
    // 4. Calculate total park acreage
    const totalAcres = features.reduce((sum, f) => sum + f.attributes.ACRES, 0);
    console.log('Total park acres:', totalAcres);
    
    return {
      bufferArea: area.value,
      parkCount: features.length,
      totalAcres
    };
  };
  
  return <div>Spatial Analysis Tool</div>;
}
```

### Example 3: Route Planning Dashboard

```tsx
import {
  useRouteAnalysis,
  useClosestFacility,
  useGeometryMeasurement
} from 'react-arcgis';

function RoutePlanningDashboard() {
  const { solveRoute } = useRouteAnalysis(routeServiceUrl);
  const { findClosestFacility } = useClosestFacility(closestFacilityServiceUrl);
  const { measureDistance } = useGeometryMeasurement();
  
  const planRoute = async (stops) => {
    // Calculate route
    const result = await solveRoute({
      stops: stops.map(s => new Graphic({ geometry: s })),
      returnDirections: true,
      directionsLengthUnits: 'miles'
    });
    
    const route = result.routeResults[0].route;
    const directions = result.routeResults[0].directions;
    
    // Measure straight-line distance
    const straightLine = await measureDistance(stops[0], stops[stops.length - 1], 'miles');
    
    return {
      routeDistance: directions.totalLength,
      routeTime: directions.totalTime,
      straightDistance: straightLine.value,
      directions: directions.features.map(f => f.attributes.text)
    };
  };
  
  const findNearestHospital = async (emergencyLocation, hospitals) => {
    const result = await findClosestFacility({
      incidents: [new Graphic({ geometry: emergencyLocation })],
      facilities: hospitals.map(h => new Graphic({ geometry: h })),
      defaultTargetFacilityCount: 1,
      returnRoutes: true,
      travelDirection: 'to-facility'
    });
    
    const nearestRoute = result.routes[0];
    return {
      distance: nearestRoute.attributes.Total_Miles,
      time: nearestRoute.attributes.Total_TravelTime
    };
  };
  
  return <div>Route Planning</div>;
}
```

---

## TypeScript Support

All hooks include full TypeScript definitions:

```tsx
import type {
  QueryFeaturesOptions,
  StatisticDefinition,
  StatisticsOptions,
  NearbyOptions,
  WithinOptions,
  BufferOptions,
  MeasurementResult,
  RouteOptions,
  ServiceAreaOptions,
  ClosestFacilityOptions
} from 'react-arcgis';
```

---

## Best Practices

### 1. Loading States

Always handle loading states for better UX:

```tsx
const { query, loading } = useQueryFeatures(layer);

<CalciteButton onClick={handleQuery} loading={loading}>
  Search
</CalciteButton>
```

### 2. Error Handling

Catch and display errors gracefully:

```tsx
const { query, error } = useQueryFeatures(layer);

try {
  await query(options);
} catch (err) {
  console.error('Query failed:', err);
}

{error && (
  <CalciteNotice kind="danger" open>
    <div slot="message">{error.message}</div>
  </CalciteNotice>
)}
```

### 3. Layer References

Pass layer references properly:

```tsx
// ✅ Good - Pass layer instance
const [layer, setLayer] = useState(null);
const { query } = useQueryFeatures(layer);

<FeatureLayer url="..." onLoad={setLayer} />

// ❌ Bad - Don't pass undefined
const { query } = useQueryFeatures(undefined);
```

### 4. Cleanup

Hooks automatically clean up, but manage state properly:

```tsx
useEffect(() => {
  let mounted = true;
  
  const fetchData = async () => {
    const features = await query(options);
    if (mounted) {
      setResults(features);
    }
  };
  
  fetchData();
  
  return () => {
    mounted = false;
  };
}, [query]);
```

---

## Summary

**8 Analysis Hooks for Advanced GIS:**

✅ **useQueryFeatures** - Advanced queries
✅ **useStatistics** - Statistical calculations
✅ **useSpatialQuery** - Spatial operations
✅ **useIdentify** - Feature identification
✅ **useBufferAnalysis** - Buffer analysis
✅ **useGeometryMeasurement** - Measurements
✅ **useRouteAnalysis** - Routing & service areas
✅ **useClosestFacility** - Nearest facility

**Ready for production GIS applications!** 🗺️
