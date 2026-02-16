import { useState } from 'react';
import {
  Map,
  MapView,
  FeatureLayer,
  useTheme,
  useSystemTheme,
  type ThemeMode,
  // Calcite Components
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteBlock,
  CalciteButton,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteChip
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function ThemeExample() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const systemTheme = useSystemTheme();
  
  // Apply theme to both Calcite and ArcGIS
  useTheme(themeMode);

  const effectiveTheme = themeMode === 'auto' ? systemTheme : themeMode;

  return (
    <CalciteShell style={{ height: '100vh' }}>
      {/* Left Panel with Theme Controls */}
      <CalciteShellPanel
        slot="panel-start"
        position="start"
        style={{ width: '320px' }}
      >
        <CalcitePanel heading="Theme Settings" description="Control light and dark mode">
          <CalciteBlock heading="Theme Mode" collapsible>
            <div style={{ padding: '1rem' }}>
              <CalciteSegmentedControl
                width="full"
                onCalciteSegmentedControlChange={(e: any) => {
                  setThemeMode(e.target.selectedItem.value as ThemeMode);
                }}
              >
                <CalciteSegmentedControlItem
                  value="light"
                  checked={themeMode === 'light'}
                >
                  Light
                </CalciteSegmentedControlItem>
                <CalciteSegmentedControlItem
                  value="dark"
                  checked={themeMode === 'dark'}
                >
                  Dark
                </CalciteSegmentedControlItem>
                <CalciteSegmentedControlItem
                  value="auto"
                  checked={themeMode === 'auto'}
                >
                  Auto
                </CalciteSegmentedControlItem>
              </CalciteSegmentedControl>

              <div style={{ marginTop: '1rem' }}>
                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                  <strong>Current Mode:</strong> {themeMode}
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                  <strong>System Preference:</strong> {systemTheme}
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                  <strong>Effective Theme:</strong> {effectiveTheme}
                </p>
              </div>

              {themeMode === 'auto' && (
                <CalciteChip
                  kind="brand"
                  icon="lightbulb"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  Following system preference
                </CalciteChip>
              )}
            </div>
          </CalciteBlock>

          <CalciteBlock heading="About Themes" collapsible>
            <div style={{ padding: '1rem', fontSize: '0.875rem' }}>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li><strong>Light:</strong> Light mode for Calcite and ArcGIS</li>
                <li><strong>Dark:</strong> Dark mode for both</li>
                <li><strong>Auto:</strong> Follows your system preference</li>
              </ul>
              <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Theme is applied to both Calcite components and ArcGIS map widgets automatically.
              </p>
            </div>
          </CalciteBlock>

          <CalciteBlock heading="Quick Actions" collapsible>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <CalciteButton
                width="full"
                iconStart="brightness"
                onClick={() => setThemeMode('light')}
                kind={themeMode === 'light' ? 'brand' : undefined}
              >
                Light Mode
              </CalciteButton>
              <CalciteButton
                width="full"
                iconStart="moon"
                onClick={() => setThemeMode('dark')}
                kind={themeMode === 'dark' ? 'brand' : undefined}
              >
                Dark Mode
              </CalciteButton>
              <CalciteButton
                width="full"
                iconStart="まvariable"
                onClick={() => setThemeMode('auto')}
                kind={themeMode === 'auto' ? 'brand' : undefined}
              >
                Auto Mode
              </CalciteButton>
            </div>
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>

      {/* Map Content */}
      <div style={{ height: '100%', width: '100%' }}>
        <Map basemap={effectiveTheme === 'dark' ? 'dark-gray-vector' : 'topo-vector'}>
          <MapView center={[-98.5795, 39.8283]} zoom={4}>
            <FeatureLayer
              url="https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
              popupTemplate={{
                title: '{STATE_NAME}',
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'STATE_NAME',
                        label: 'State Name'
                      },
                      {
                        fieldName: 'POP2010',
                        label: 'Population (2010)',
                        format: {
                          digitSeparator: true,
                          places: 0
                        }
                      }
                    ]
                  }
                ]
              }}
            />
          </MapView>
        </Map>
      </div>
    </CalciteShell>
  );
}

export default ThemeExample;
