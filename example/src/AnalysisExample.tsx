import { useState, useEffect } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer,
  useQueryFeatures,
  useStatistics,
  useSpatialQuery,
  useBufferAnalysis,
  useGeometryMeasurement
} from '../../src';
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteButton,
  CalciteInput,
  CalciteSelect,
  CalciteOption,
  CalciteLoader,
  CalciteNotice,
  CalciteList,
  CalciteListItem,
  CalciteLabel
} from '@esri/calcite-components-react';

export function AnalysisExample() {
  const [featureLayer, setFeatureLayer] = useState<any>(null);
  const [graphicsLayer, setGraphicsLayer] = useState<any>(null);
  const [view, setView] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'query' | 'stats' | 'spatial' | 'buffer' | 'measure'>('query');
  
  // Query hooks
  const { query, queryCount, loading: queryLoading, results: queryResults } = useQueryFeatures(featureLayer);
  const { calculateStatistics, loading: statsLoading, results: statsResults } = useStatistics(featureLayer);
  const { findNearby, loading: spatialLoading, results: spatialResults } = useSpatialQuery(featureLayer);
  const { buffer, loading: bufferLoading } = useBufferAnalysis();
  const { measureDistance, measureArea, loading: measureLoading } = useGeometryMeasurement();
  
  // Query state
  const [whereClause, setWhereClause] = useState('POP2020 > 1000000');
  const [queryResultCount, setQueryResultCount] = useState<number | null>(null);
  
  // Spatial query state
  const [bufferDistance, setBufferDistance] = useState('50');
  const [bufferUnit, setBufferUnit] = useState<'miles' | 'kilometers'>('miles');
  
  // Statistics
  const [statsInfo, setStatsInfo] = useState<any>(null);
  
  // Measurement
  const [measurement, setMeasurement] = useState<any>(null);

  const runAttributeQuery = async () => {
    try {
      const features = await query({
        where: whereClause,
        outFields: ['NAME', 'STATE_NAME', 'POP2020'],
        orderByFields: ['POP2020 DESC'],
        maxRecordCount: 10
      });
      
      console.log('Query results:', features);
    } catch (err) {
      console.error('Query failed:', err);
    }
  };

  const runCountQuery = async () => {
    try {
      const count = await queryCount({
        where: whereClause
      });
      
      setQueryResultCount(count);
      console.log('Count:', count);
    } catch (err) {
      console.error('Count failed:', err);
    }
  };

  const runStatistics = async () => {
    try {
      const stats = await calculateStatistics({
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
      
      if (stats && stats.length > 0) {
        setStatsInfo(stats[0].attributes);
      }
    } catch (err) {
      console.error('Statistics failed:', err);
    }
  };

  const runGroupedStatistics = async () => {
    try {
      const stats = await calculateStatistics({
        statisticDefinitions: [
          {
            statisticType: 'sum',
            onStatisticField: 'POP2020',
            outStatisticFieldName: 'totalPop'
          },
          {
            statisticType: 'count',
            onStatisticField: 'OBJECTID',
            outStatisticFieldName: 'cityCount'
          }
        ],
        groupByFieldsForStatistics: ['STATE_NAME'],
        orderByFields: ['totalPop DESC']
      });
      
      console.log('Grouped statistics:', stats);
    } catch (err) {
      console.error('Grouped statistics failed:', err);
    }
  };

  const handleMapClick = async (event: any) => {
    if (activeTab === 'spatial' && featureLayer) {
      try {
        const distance = parseInt(bufferDistance) || 50;
        const features = await findNearby(event.mapPoint, {
          distance,
          units: bufferUnit,
          outFields: ['NAME', 'STATE_NAME', 'POP2020'],
          where: '1=1'
        });
        
        console.log(`Found ${features.length} features within ${distance} ${bufferUnit}`);
        
        // Add click point graphic
        if (graphicsLayer) {
          const { Graphic } = await import('@arcgis/core');
          graphicsLayer.removeAll();
          graphicsLayer.add(new Graphic({
            geometry: event.mapPoint,
            symbol: {
              type: 'simple-marker',
              color: [255, 0, 0],
              size: 10,
              outline: { color: [255, 255, 255], width: 2 }
            }
          }));
        }
      } catch (err) {
        console.error('Spatial query failed:', err);
      }
    }
    
    if (activeTab === 'buffer' && featureLayer) {
      try {
        const distance = parseInt(bufferDistance) || 50;
        const buffered = await buffer(event.mapPoint, {
          distance,
          unit: bufferUnit,
          geodesic: true
        });
        
        // Add buffer graphic
        if (graphicsLayer) {
          const { Graphic } = await import('@arcgis/core');
          graphicsLayer.removeAll();
          
          graphicsLayer.add(new Graphic({
            geometry: buffered,
            symbol: {
              type: 'simple-fill',
              color: [255, 0, 0, 0.2],
              outline: { color: [255, 0, 0], width: 2 }
            }
          }));
          
          graphicsLayer.add(new Graphic({
            geometry: event.mapPoint,
            symbol: {
              type: 'simple-marker',
              color: [255, 0, 0],
              size: 10
            }
          }));
          
          // Measure buffer area
          const area = await measureArea(buffered, 'square-miles');
          setMeasurement({
            type: 'Buffer Area',
            value: area.value.toFixed(2),
            unit: area.unit
          });
        }
      } catch (err) {
        console.error('Buffer failed:', err);
      }
    }
  };

  useEffect(() => {
    if (view) {
      const handle = view.on('click', handleMapClick);
      return () => handle.remove();
    }
  }, [view, activeTab, featureLayer, graphicsLayer, bufferDistance, bufferUnit]);

  const renderQueryTab = () => (
    <CalciteBlock heading="Attribute Query" open>
      <div style={{ padding: '0.5rem' }}>
        <CalciteLabel>
          Where Clause
          <CalciteInput
            value={whereClause}
            onCalciteInputChange={(e) => setWhereClause(e.target.value)}
            placeholder="e.g., POP2020 > 1000000"
          />
        </CalciteLabel>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <CalciteButton onClick={runAttributeQuery} loading={queryLoading} width="full">
            Run Query
          </CalciteButton>
          <CalciteButton onClick={runCountQuery} loading={queryLoading} width="full" appearance="outline">
            Get Count
          </CalciteButton>
        </div>
        
        {queryResultCount !== null && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'var(--calcite-color-background)' }}>
            <strong>Count:</strong> {queryResultCount} features
          </div>
        )}
        
        {queryResults && queryResults.length > 0 && (
          <CalciteList style={{ marginTop: '1rem' }}>
            {queryResults.map((feature, i) => (
              <CalciteListItem key={i}>
                <div>
                  <strong>{feature.attributes.NAME}</strong>
                  <div style={{ fontSize: '0.875rem', color: 'var(--calcite-color-text-3)' }}>
                    {feature.attributes.STATE_NAME} - Pop: {feature.attributes.POP2020?.toLocaleString()}
                  </div>
                </div>
              </CalciteListItem>
            ))}
          </CalciteList>
        )}
      </div>
    </CalciteBlock>
  );

  const renderStatsTab = () => (
    <CalciteBlock heading="Statistics" open>
      <div style={{ padding: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <CalciteButton onClick={runStatistics} loading={statsLoading} width="full">
            Calculate Statistics
          </CalciteButton>
          <CalciteButton onClick={runGroupedStatistics} loading={statsLoading} width="full" appearance="outline">
            Grouped by State
          </CalciteButton>
        </div>
        
        {statsInfo && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Total Population:</strong> {statsInfo.totalPop?.toLocaleString()}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Average Population:</strong> {statsInfo.avgPop?.toLocaleString()}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Max Population:</strong> {statsInfo.maxPop?.toLocaleString()}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Min Population:</strong> {statsInfo.minPop?.toLocaleString()}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>City Count:</strong> {statsInfo.count}
            </div>
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  const renderSpatialTab = () => (
    <CalciteBlock heading="Spatial Query" open>
      <div style={{ padding: '0.5rem' }}>
        <CalciteLabel>
          Buffer Distance
          <CalciteInput
            type="number"
            value={bufferDistance}
            onCalciteInputChange={(e) => setBufferDistance(e.target.value)}
          />
        </CalciteLabel>
        
        <CalciteLabel>
          Units
          <CalciteSelect value={bufferUnit} onCalciteSelectChange={(e) => setBufferUnit(e.target.value as any)}>
            <CalciteOption value="miles">Miles</CalciteOption>
            <CalciteOption value="kilometers">Kilometers</CalciteOption>
          </CalciteSelect>
        </CalciteLabel>
        
        <CalciteNotice kind="info" open style={{ marginTop: '1rem' }}>
          <div slot="message">
            Click on the map to find features within {bufferDistance} {bufferUnit}
          </div>
        </CalciteNotice>
        
        {spatialResults && spatialResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong>Found {spatialResults.length} features</strong>
            <CalciteList>
              {spatialResults.slice(0, 5).map((feature, i) => (
                <CalciteListItem key={i}>
                  {feature.attributes.NAME} ({feature.attributes.STATE_NAME})
                </CalciteListItem>
              ))}
            </CalciteList>
            {spatialResults.length > 5 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--calcite-color-text-3)' }}>
                ...and {spatialResults.length - 5} more
              </div>
            )}
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  const renderBufferTab = () => (
    <CalciteBlock heading="Buffer Analysis" open>
      <div style={{ padding: '0.5rem' }}>
        <CalciteLabel>
          Buffer Distance
          <CalciteInput
            type="number"
            value={bufferDistance}
            onCalciteInputChange={(e) => setBufferDistance(e.target.value)}
          />
        </CalciteLabel>
        
        <CalciteLabel>
          Units
          <CalciteSelect value={bufferUnit} onCalciteSelectChange={(e) => setBufferUnit(e.target.value as any)}>
            <CalciteOption value="miles">Miles</CalciteOption>
            <CalciteOption value="kilometers">Kilometers</CalciteOption>
          </CalciteSelect>
        </CalciteLabel>
        
        <CalciteNotice kind="info" open style={{ marginTop: '1rem' }}>
          <div slot="message">
            Click on the map to create a {bufferDistance} {bufferUnit} buffer
          </div>
        </CalciteNotice>
        
        {measurement && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'var(--calcite-color-background)' }}>
            <strong>{measurement.type}:</strong> {measurement.value} {measurement.unit}
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start" width-scale="m">
        <CalcitePanel heading="Analysis Tools">
          <CalciteBlock heading="Analysis Type" open>
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <CalciteButton
                width="full"
                appearance={activeTab === 'query' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('query')}
              >
                Attribute Query
              </CalciteButton>
              <CalciteButton
                width="full"
                appearance={activeTab === 'stats' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('stats')}
              >
                Statistics
              </CalciteButton>
              <CalciteButton
                width="full"
                appearance={activeTab === 'spatial' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('spatial')}
              >
                Spatial Query
              </CalciteButton>
              <CalciteButton
                width="full"
                appearance={activeTab === 'buffer' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('buffer')}
              >
                Buffer Analysis
              </CalciteButton>
            </div>
          </CalciteBlock>
          
          {activeTab === 'query' && renderQueryTab()}
          {activeTab === 'stats' && renderStatsTab()}
          {activeTab === 'spatial' && renderSpatialTab()}
          {activeTab === 'buffer' && renderBufferTab()}
        </CalcitePanel>
      </CalciteShellPanel>

      <Map basemap="gray-vector">
        <MapView
          center={[-98.5795, 39.8283]}
          zoom={4}
          onViewReady={setView}
        >
          <FeatureLayer
            url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0"
            outFields={['*']}
            onLoad={setFeatureLayer}
          />
          <GraphicsLayer onLoad={setGraphicsLayer} />
        </MapView>
      </Map>
    </CalciteShell>
  );
}

export default AnalysisExample;
