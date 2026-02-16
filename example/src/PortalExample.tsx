import { useState, useEffect } from 'react';
import {
  usePortal,
  usePortalSearch,
  usePortalItem,
  usePortalUser,
  usePortalGroup,
  Map,
  MapView,
  WebMap
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
  CalciteCard,
  CalciteTabs,
  CalciteTabNav,
  CalciteTabTitle,
  CalciteTab,
  CalciteLabel
} from '@esri/calcite-components-react';

export function PortalExample() {
  const [activeTab, setActiveTab] = useState<'connection' | 'search' | 'item' | 'user' | 'group'>('connection');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  
  // Portal connection
  const { portal, user, loading: portalLoading, error: portalError, signIn, signOut } = usePortal({
    url: 'https://www.arcgis.com'
  });
  
  // Search
  const { search, loadMore, loading: searchLoading, results: searchResults, hasMore } = usePortalSearch(portal);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemType, setItemType] = useState('Web Map');
  
  // Item details
  const { item, loading: itemLoading, error: itemError, reload: reloadItem } = usePortalItem({
    id: selectedItemId || 'dummy-id',
    portal
  });
  
  // User profile
  const { user: userProfile, loading: userLoading, fetchContent, content } = usePortalUser({
    username: selectedUsername,
    portal
  });
  
  // Group
  const { group, loading: groupLoading, queryItems, items: groupItems } = usePortalGroup({
    id: selectedGroupId || 'dummy-id',
    portal
  });

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    await search({
      query: `title:${searchQuery} AND type:"${itemType}"`,
      sortField: 'modified',
      sortOrder: 'desc',
      num: 10
    });
  };

  const handleLoadMore = async () => {
    await loadMore();
  };

  const handleViewItem = (id: string) => {
    setSelectedItemId(id);
    setActiveTab('item');
  };

  useEffect(() => {
    if (userProfile && activeTab === 'user') {
      fetchContent({ num: 10, sortField: 'modified', sortOrder: 'desc' });
    }
  }, [userProfile, activeTab]);

  useEffect(() => {
    if (group && activeTab === 'group') {
      queryItems({ num: 10, sortField: 'modified', sortOrder: 'desc' });
    }
  }, [group, activeTab]);

  const renderConnectionTab = () => (
    <CalciteBlock heading="Portal Connection" open>
      <div style={{ padding: '1rem' }}>
        {portalLoading && <CalciteLoader />}
        
        {portalError && (
          <CalciteNotice kind="danger" open>
            <div slot="message">{portalError.message}</div>
          </CalciteNotice>
        )}
        
        {portal && (
          <div style={{ marginBottom: '1rem' }}>
            <h3>{portal.name}</h3>
            <p>{portal.description}</p>
            
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div><strong>URL:</strong> {portal.url}</div>
              <div><strong>Organization:</strong> {portal.id}</div>
              <div><strong>Culture:</strong> {portal.culture}</div>
              <div><strong>Region:</strong> {portal.region}</div>
            </div>
          </div>
        )}
        
        {user ? (
          <div>
            <CalciteCard>
              {user.thumbnailUrl && (
                <img slot="thumbnail" src={user.thumbnailUrl} alt={user.fullName} style={{ width: '100%' }} />
              )}
              
              <h4>{user.fullName}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--calcite-color-text-3)' }}>
                @{user.username}
              </p>
              
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Organization:</strong> {user.orgId}</div>
              </div>
              
              <CalciteButton slot="footer-trailing" onClick={signOut} width="full">
                Sign Out
              </CalciteButton>
            </CalciteCard>
          </div>
        ) : (
          <CalciteButton onClick={signIn} width="full">
            Sign In to Portal
          </CalciteButton>
        )}
      </div>
    </CalciteBlock>
  );

  const renderSearchTab = () => (
    <CalciteBlock heading="Portal Search" open>
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Search Query
          <CalciteInput
            value={searchQuery}
            onCalciteInputChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search terms..."
          />
        </CalciteLabel>
        
        <CalciteLabel>
          Item Type
          <CalciteSelect value={itemType} onCalciteSelectChange={(e) => setItemType(e.target.value)}>
            <CalciteOption value="Web Map">Web Map</CalciteOption>
            <CalciteOption value="Web Scene">Web Scene</CalciteOption>
            <CalciteOption value="Feature Service">Feature Service</CalciteOption>
            <CalciteOption value="Map Service">Map Service</CalciteOption>
            <CalciteOption value="Web Mapping Application">Web App</CalciteOption>
            <CalciteOption value="Dashboard">Dashboard</CalciteOption>
          </CalciteSelect>
        </CalciteLabel>
        
        <CalciteButton onClick={handleSearch} loading={searchLoading} width="full">
          Search
        </CalciteButton>
        
        {searchResults && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Found {searchResults.total} items</strong>
            </p>
            
            <CalciteList>
              {searchResults.results.map(result => (
                <CalciteListItem key={result.id} onClick={() => handleViewItem(result.id)}>
                  <div slot="content-start">
                    <img src={result.thumbnailUrl} width="60" height="60" style={{ borderRadius: '4px' }} />
                  </div>
                  
                  <div>
                    <strong>{result.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--calcite-color-text-3)' }}>
                      {result.snippet}
                    </div>
                  </div>
                  
                  <div slot="content-end" style={{ fontSize: '0.75rem', textAlign: 'right' }}>
                    <div>{result.type}</div>
                    <div>By {result.owner}</div>
                    <div>{result.numViews} views</div>
                  </div>
                </CalciteListItem>
              ))}
            </CalciteList>
            
            {hasMore && (
              <CalciteButton onClick={handleLoadMore} loading={searchLoading} width="full" style={{ marginTop: '0.5rem' }}>
                Load More
              </CalciteButton>
            )}
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  const renderItemTab = () => (
    <CalciteBlock heading="Item Details" open>
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Item ID
          <CalciteInput
            value={selectedItemId}
            onCalciteInputChange={(e) => setSelectedItemId(e.target.value)}
            placeholder="Enter item ID..."
          />
        </CalciteLabel>
        
        <CalciteButton onClick={reloadItem} loading={itemLoading} width="full">
          Load Item
        </CalciteButton>
        
        {itemLoading && <CalciteLoader />}
        
        {itemError && (
          <CalciteNotice kind="warning" open style={{ marginTop: '1rem' }}>
            <div slot="message">{itemError.message}</div>
          </CalciteNotice>
        )}
        
        {item && (
          <CalciteCard style={{ marginTop: '1rem' }}>
            {item.thumbnailUrl && (
              <img slot="thumbnail" src={item.thumbnailUrl} alt={item.title} style={{ width: '100%' }} />
            )}
            
            <h4>{item.title}</h4>
            <p style={{ fontSize: '0.875rem' }}>{item.snippet}</p>
            
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div><strong>Type:</strong> {item.type}</div>
              <div><strong>Owner:</strong> {item.owner}</div>
              <div><strong>Views:</strong> {item.numViews?.toLocaleString()}</div>
              <div><strong>Rating:</strong> {item.avgRating ? item.avgRating.toFixed(1) : 'N/A'}</div>
              <div><strong>Created:</strong> {new Date(item.created).toLocaleDateString()}</div>
              <div><strong>Modified:</strong> {new Date(item.modified).toLocaleDateString()}</div>
              {item.tags && item.tags.length > 0 && (
                <div><strong>Tags:</strong> {item.tags.join(', ')}</div>
              )}
            </div>
            
            {item.description && (
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Description:</strong>
                <p>{item.description}</p>
              </div>
            )}
          </CalciteCard>
        )}
      </div>
    </CalciteBlock>
  );

  const renderUserTab = () => (
    <CalciteBlock heading="User Profile" open>
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Username
          <CalciteInput
            value={selectedUsername}
            onCalciteInputChange={(e) => setSelectedUsername(e.target.value)}
            placeholder="Enter username..."
          />
        </CalciteLabel>
        
        {userLoading && <CalciteLoader />}
        
        {userProfile && (
          <CalciteCard style={{ marginTop: '1rem' }}>
            {userProfile.thumbnailUrl && (
              <img slot="thumbnail" src={userProfile.thumbnailUrl} alt={userProfile.fullName} style={{ width: '100%' }} />
            )}
            
            <h4>{userProfile.fullName}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--calcite-color-text-3)' }}>
              @{userProfile.username}
            </p>
            
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div><strong>Role:</strong> {userProfile.role}</div>
              <div><strong>Organization:</strong> {userProfile.orgId}</div>
              <div><strong>Member Since:</strong> {new Date(userProfile.created).toLocaleDateString()}</div>
            </div>
            
            {userProfile.description && (
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <p>{userProfile.description}</p>
              </div>
            )}
          </CalciteCard>
        )}
        
        {content && content.items && content.items.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>User Content ({content.total})</h4>
            <CalciteList>
              {content.items.map((item: any) => (
                <CalciteListItem key={item.id} onClick={() => handleViewItem(item.id)}>
                  <div>{item.title}</div>
                  <div slot="content-end" style={{ fontSize: '0.75rem' }}>
                    {item.type}
                  </div>
                </CalciteListItem>
              ))}
            </CalciteList>
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  const renderGroupTab = () => (
    <CalciteBlock heading="Group Details" open>
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Group ID
          <CalciteInput
            value={selectedGroupId}
            onCalciteInputChange={(e) => setSelectedGroupId(e.target.value)}
            placeholder="Enter group ID..."
          />
        </CalciteLabel>
        
        {groupLoading && <CalciteLoader />}
        
        {group && (
          <CalciteCard style={{ marginTop: '1rem' }}>
            {group.thumbnailUrl && (
              <img slot="thumbnail" src={group.thumbnailUrl} alt={group.title} style={{ width: '100%' }} />
            )}
            
            <h4>{group.title}</h4>
            <p style={{ fontSize: '0.875rem' }}>{group.snippet}</p>
            
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div><strong>Owner:</strong> {group.owner}</div>
              <div><strong>Access:</strong> {group.access}</div>
              {/* <div><strong>Members:</strong> {group.memberCount}</div> */}
            </div>
            
            {group.description && (
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Description:</strong>
                <p>{group.description}</p>
              </div>
            )}
          </CalciteCard>
        )}
        
        {groupItems && groupItems.results && groupItems.results.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Group Items ({groupItems.total})</h4>
            <CalciteList>
              {groupItems.results.map((item: any) => (
                <CalciteListItem key={item.id} onClick={() => handleViewItem(item.id)}>
                  <div>{item.title}</div>
                  <div slot="content-end" style={{ fontSize: '0.75rem' }}>
                    {item.type}
                  </div>
                </CalciteListItem>
              ))}
            </CalciteList>
          </div>
        )}
      </div>
    </CalciteBlock>
  );

  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start" width-scale="m">
        <CalcitePanel heading="Portal Integration">
          <CalciteTabs>
            <CalciteTabNav slot="title-group">
              <CalciteTabTitle selected={activeTab === 'connection'} onCalciteTabsActivate={() => setActiveTab('connection')}>
                Connection
              </CalciteTabTitle>
              <CalciteTabTitle selected={activeTab === 'search'} onCalciteTabsActivate={() => setActiveTab('search')}>
                Search
              </CalciteTabTitle>
              <CalciteTabTitle selected={activeTab === 'item'} onCalciteTabsActivate={() => setActiveTab('item')}>
                Item
              </CalciteTabTitle>
              <CalciteTabTitle selected={activeTab === 'user'} onCalciteTabsActivate={() => setActiveTab('user')}>
                User
              </CalciteTabTitle>
              <CalciteTabTitle selected={activeTab === 'group'} onCalciteTabsActivate={() => setActiveTab('group')}>
                Group
              </CalciteTabTitle>
            </CalciteTabNav>
            
            <CalciteTab selected={activeTab === 'connection'}>
              {renderConnectionTab()}
            </CalciteTab>
            
            <CalciteTab selected={activeTab === 'search'}>
              {renderSearchTab()}
            </CalciteTab>
            
            <CalciteTab selected={activeTab === 'item'}>
              {renderItemTab()}
            </CalciteTab>
            
            <CalciteTab selected={activeTab === 'user'}>
              {renderUserTab()}
            </CalciteTab>
            
            <CalciteTab selected={activeTab === 'group'}>
              {renderGroupTab()}
            </CalciteTab>
          </CalciteTabs>
        </CalcitePanel>
      </CalciteShellPanel>

      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--calcite-color-background)' }}>
        {selectedItemId && item && item.type === 'Web Map' ? (
          <WebMap portalItem={{ id: selectedItemId, portal }} />
        ) : (
          <Map basemap="topo-vector">
            <MapView center={[-98.5795, 39.8283]} zoom={4} />
          </Map>
        )}
      </div>
    </CalciteShell>
  );
}

export default PortalExample;
