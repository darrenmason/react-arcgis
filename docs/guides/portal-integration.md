# Portal Integration Guide

Complete guide to Portal integration with ArcGIS Online and ArcGIS Enterprise in React ArcGIS.

## Table of Contents

- [Overview](#overview)
- [Portal Hooks](#portal-hooks)
- [Authentication](#authentication)
- [Content Management](#content-management)
- [Search & Discovery](#search--discovery)
- [Complete Examples](#complete-examples)

---

## Overview

React ArcGIS provides **9 Portal hooks** for comprehensive Portal integration:

| Hook | Purpose | Use Case |
|------|---------|----------|
| **usePortal** | Connect to Portal | Basic portal connection |
| **useOAuthInfo** | OAuth authentication | Secure sign-in |
| **usePortalItem** | Load portal items | View item details |
| **usePortalSearch** | Search portal content | Find maps, layers, apps |
| **usePortalGroup** | Work with groups | Group content & members |
| **usePortalUser** | User profiles | User content & info |
| **usePortalContent** | Manage content | Add, update, delete items |
| **useWebMap** | Load web maps | 2D maps from Portal |
| **useWebScene** | Load web scenes | 3D scenes from Portal |

---

## Portal Hooks

### usePortal

Basic portal connection.

```tsx
import { usePortal } from 'react-arcgis';

function PortalConnection() {
  const { portal, user, loading, error, signIn, signOut } = usePortal({
    url: 'https://www.arcgis.com', // or your Enterprise Portal URL
    authMode: 'auto' // 'immediate', 'auto', or 'no-prompt'
  });
  
  if (loading) return <CalciteLoader />;
  if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
  
  return (
    <div>
      <h2>{portal.name}</h2>
      <p>{portal.description}</p>
      
      {user ? (
        <div>
          <p>Signed in as: {user.username}</p>
          <p>Organization: {user.orgId}</p>
          <CalciteButton onClick={signOut}>Sign Out</CalciteButton>
        </div>
      ) : (
        <CalciteButton onClick={signIn}>Sign In</CalciteButton>
      )}
    </div>
  );
}
```

**Options:**
- `url` - Portal URL (default: 'https://www.arcgis.com')
- `authMode` - Authentication mode:
  - `'immediate'` - Force sign-in immediately
  - `'auto'` - Sign in when accessing protected resources
  - `'no-prompt'` - Don't prompt for sign-in

---

### useOAuthInfo

OAuth 2.0 authentication for ArcGIS Online/Enterprise.

```tsx
import { useOAuthInfo } from 'react-arcgis';

function OAuthApp() {
  const { 
    credential, 
    loading, 
    error,
    checkSignInStatus, 
    signIn, 
    signOut 
  } = useOAuthInfo({
    appId: 'YOUR_APP_ID', // Register at developers.arcgis.com
    portalUrl: 'https://www.arcgis.com/sharing',
    popup: true, // Use popup for sign-in (vs redirect)
    flowType: 'auto' // 'auto', 'authorization-code', or 'implicit'
  });
  
  // Check if user is already signed in
  useEffect(() => {
    checkSignInStatus();
  }, []);
  
  if (loading) return <CalciteLoader />;
  
  return (
    <div>
      {credential ? (
        <div>
          <p>Signed in as: {credential.userId}</p>
          <p>Token expires: {new Date(credential.expires).toLocaleString()}</p>
          <CalciteButton onClick={signOut}>Sign Out</CalciteButton>
        </div>
      ) : (
        <CalciteButton onClick={signIn} loading={loading}>
          Sign In with ArcGIS
        </CalciteButton>
      )}
    </div>
  );
}
```

**Options:**
- `appId` - Application ID from developers.arcgis.com
- `portalUrl` - Portal URL (default: 'https://www.arcgis.com/sharing')
- `popup` - Use popup window for sign-in (default: true)
- `flowType` - OAuth flow type (default: 'auto')

**Methods:**
- `checkSignInStatus()` - Check if user is already signed in
- `signIn()` - Prompt user to sign in
- `signOut()` - Sign out and destroy credentials

---

### usePortalItem

Load and work with Portal items.

```tsx
import { usePortalItem } from 'react-arcgis';

function PortalItemView({ itemId }) {
  const { item, loading, error, reload, updateItem } = usePortalItem({
    id: itemId,
    portal: myPortal // optional, uses default if not provided
  });
  
  if (loading) return <CalciteLoader />;
  if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
  
  const handleUpdate = async () => {
    await updateItem({
      title: 'Updated Title',
      tags: ['updated', 'modified']
    });
  };
  
  return (
    <CalciteCard>
      <img slot="thumbnail" src={item.thumbnailUrl} alt={item.title} />
      
      <h3>{item.title}</h3>
      <p>{item.snippet}</p>
      
      <div>
        <strong>Type:</strong> {item.type}
      </div>
      <div>
        <strong>Owner:</strong> {item.owner}
      </div>
      <div>
        <strong>Views:</strong> {item.numViews?.toLocaleString()}
      </div>
      <div>
        <strong>Rating:</strong> {item.avgRating?.toFixed(1)}
      </div>
      <div>
        <strong>Created:</strong> {new Date(item.created).toLocaleDateString()}
      </div>
      <div>
        <strong>Modified:</strong> {new Date(item.modified).toLocaleDateString()}
      </div>
      
      <CalciteButton slot="footer-leading" onClick={reload}>
        Refresh
      </CalciteButton>
      <CalciteButton slot="footer-trailing" onClick={handleUpdate}>
        Update
      </CalciteButton>
    </CalciteCard>
  );
}
```

---

### usePortalSearch

Search Portal content.

```tsx
import { usePortalSearch } from 'react-arcgis';

function PortalSearchComponent() {
  const { search, loadMore, loading, results, hasMore } = usePortalSearch(portal);
  const [query, setQuery] = useState('');
  const [itemType, setItemType] = useState('Web Map');
  
  const handleSearch = async () => {
    await search({
      query: `title:${query} AND type:"${itemType}"`,
      sortField: 'modified',
      sortOrder: 'desc',
      num: 20
    });
  };
  
  return (
    <CalcitePanel heading="Portal Search">
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Search Query
          <CalciteInput
            value={query}
            onCalciteInputChange={(e) => setQuery(e.target.value)}
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
          </CalciteSelect>
        </CalciteLabel>
        
        <CalciteButton onClick={handleSearch} loading={loading} width="full">
          Search
        </CalciteButton>
        
        {results && (
          <div style={{ marginTop: '1rem' }}>
            <p>Found {results.total} items</p>
            
            <CalciteList>
              {results.results.map(item => (
                <CalciteListItem key={item.id}>
                  <div slot="content-start">
                    <img src={item.thumbnailUrl} width="80" height="80" />
                  </div>
                  
                  <h4>{item.title}</h4>
                  <p>{item.snippet}</p>
                  
                  <div slot="content-end">
                    <div style={{ fontSize: '0.875rem', color: 'var(--calcite-color-text-3)' }}>
                      <div>By {item.owner}</div>
                      <div>{item.numViews} views</div>
                      <div>{new Date(item.modified).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CalciteListItem>
              ))}
            </CalciteList>
            
            {hasMore && (
              <CalciteButton onClick={loadMore} loading={loading} width="full">
                Load More
              </CalciteButton>
            )}
          </div>
        )}
      </div>
    </CalcitePanel>
  );
}
```

**Search Query Syntax:**
```typescript
// Search by title
query: "title:San Francisco"

// Search by type
query: "type:Web Map"

// Search by owner
query: "owner:esri"

// Search by tags
query: "tags:basemap"

// Combine with AND/OR
query: "title:map AND type:Web Map"
query: "owner:esri OR owner:username"

// Exclude with NOT
query: "title:map NOT type:Feature Service"

// Date ranges
query: "modified:[2023-01-01 TO 2023-12-31]"

// Wildcards
query: "title:*map*"
```

---

### usePortalGroup

Work with Portal groups.

```tsx
import { usePortalGroup } from 'react-arcgis';

function PortalGroupView({ groupId }) {
  const { group, loading, error, queryItems, getMembers, items } = usePortalGroup({
    id: groupId,
    portal: myPortal
  });
  
  useEffect(() => {
    if (group) {
      queryItems({ num: 20, sortField: 'modified', sortOrder: 'desc' });
    }
  }, [group]);
  
  const handleGetMembers = async () => {
    const members = await getMembers();
    console.log('Group members:', members);
  };
  
  if (loading) return <CalciteLoader />;
  if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
  
  return (
    <div>
      <CalciteCard>
        <img slot="thumbnail" src={group.thumbnailUrl} alt={group.title} />
        
        <h2>{group.title}</h2>
        <p>{group.description}</p>
        
        <div>
          <strong>Owner:</strong> {group.owner}
        </div>
        <div>
          <strong>Access:</strong> {group.access}
        </div>
        <div>
          <strong>Members:</strong> {group.memberCount}
        </div>
        
        <CalciteButton slot="footer-trailing" onClick={handleGetMembers}>
          View Members
        </CalciteButton>
      </CalciteCard>
      
      {items && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Group Items ({items.total})</h3>
          <CalciteList>
            {items.results.map(item => (
              <CalciteListItem key={item.id}>
                {item.title} - {item.type}
              </CalciteListItem>
            ))}
          </CalciteList>
        </div>
      )}
    </div>
  );
}
```

---

### usePortalUser

Work with Portal users.

```tsx
import { usePortalUser } from 'react-arcgis';

function UserProfile({ username }) {
  const { user, loading, error, fetchContent, fetchFolders, fetchGroups, content } = usePortalUser({
    username: username, // or omit to use signed-in user
    portal: myPortal
  });
  
  useEffect(() => {
    if (user) {
      fetchContent({ num: 20, sortField: 'modified', sortOrder: 'desc' });
    }
  }, [user]);
  
  const handleFetchFolders = async () => {
    const folders = await fetchFolders();
    console.log('User folders:', folders);
  };
  
  const handleFetchGroups = async () => {
    const groups = await fetchGroups();
    console.log('User groups:', groups);
  };
  
  if (loading) return <CalciteLoader />;
  if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
  
  return (
    <div>
      <CalciteCard>
        <img slot="thumbnail" src={user.thumbnailUrl} alt={user.fullName} />
        
        <h2>{user.fullName}</h2>
        <p>{user.description}</p>
        
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Organization:</strong> {user.orgId}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>Member Since:</strong> {new Date(user.created).toLocaleDateString()}
        </div>
        
        <CalciteButton slot="footer-leading" onClick={handleFetchFolders}>
          View Folders
        </CalciteButton>
        <CalciteButton slot="footer-trailing" onClick={handleFetchGroups}>
          View Groups
        </CalciteButton>
      </CalciteCard>
      
      {content && (
        <div style={{ marginTop: '1rem' }}>
          <h3>User Content ({content.total})</h3>
          <CalciteList>
            {content.items.map(item => (
              <CalciteListItem key={item.id}>
                {item.title} - {item.type}
              </CalciteListItem>
            ))}
          </CalciteList>
        </div>
      )}
    </div>
  );
}
```

---

## Content Management

### usePortalContent

Manage Portal content (add, update, delete).

```tsx
import { usePortalContent } from 'react-arcgis';

function ContentManager() {
  const { addItem, updateItem, deleteItem, shareItem, loading, error } = usePortalContent(portal);
  const [itemId, setItemId] = useState('');
  
  const createWebMap = async () => {
    const item = await addItem({
      type: 'Web Map',
      title: 'My New Web Map',
      description: 'A custom web map created from React',
      snippet: 'Custom web map',
      tags: ['map', 'custom', 'react'],
      data: {
        baseMap: { 
          title: 'Topographic',
          baseMapLayers: []
        },
        operationalLayers: [],
        spatialReference: { wkid: 102100 }
      },
      access: 'private' // 'private', 'org', or 'public'
    });
    
    console.log('Created item:', item.id);
    setItemId(item.id);
  };
  
  const updateWebMap = async () => {
    if (!itemId) return;
    
    await updateItem(itemId, {
      title: 'Updated Web Map Title',
      description: 'Updated description',
      tags: ['map', 'custom', 'react', 'updated'],
      access: 'org' // Share with organization
    });
  };
  
  const shareToPublic = async () => {
    if (!itemId) return;
    
    await shareItem(itemId, {
      everyone: true, // Share publicly
      org: true       // Share with org
    });
  };
  
  const shareToGroups = async () => {
    if (!itemId) return;
    
    await shareItem(itemId, {
      groups: ['group-id-1', 'group-id-2']
    });
  };
  
  const removeItem = async () => {
    if (!itemId) return;
    
    await deleteItem(itemId);
    console.log('Item deleted');
    setItemId('');
  };
  
  return (
    <CalcitePanel heading="Content Management">
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <CalciteButton onClick={createWebMap} loading={loading} width="full">
          Create Web Map
        </CalciteButton>
        
        {itemId && (
          <>
            <CalciteInput value={itemId} disabled />
            
            <CalciteButton onClick={updateWebMap} loading={loading} width="full">
              Update Item
            </CalciteButton>
            
            <CalciteButton onClick={shareToPublic} loading={loading} width="full">
              Share Publicly
            </CalciteButton>
            
            <CalciteButton onClick={shareToGroups} loading={loading} width="full">
              Share to Groups
            </CalciteButton>
            
            <CalciteButton onClick={removeItem} loading={loading} width="full" kind="danger">
              Delete Item
            </CalciteButton>
          </>
        )}
        
        {error && (
          <CalciteNotice kind="danger" open>
            <div slot="message">{error.message}</div>
          </CalciteNotice>
        )}
      </div>
    </CalcitePanel>
  );
}
```

---

## Complete Examples

### Example 1: Portal Dashboard

```tsx
import {
  usePortal,
  usePortalSearch,
  usePortalUser
} from 'react-arcgis';

function PortalDashboard() {
  const { portal, user, loading: portalLoading, signIn, signOut } = usePortal({
    url: 'https://www.arcgis.com'
  });
  
  const { search, results: searchResults } = usePortalSearch(portal);
  const { user: userProfile, fetchContent, content } = usePortalUser({
    portal
  });
  
  useEffect(() => {
    if (user) {
      // Fetch user content
      fetchContent({ num: 10 });
      
      // Search for trending maps
      search({
        query: 'type:"Web Map" AND access:public',
        sortField: 'numViews',
        sortOrder: 'desc',
        num: 10
      });
    }
  }, [user]);
  
  if (portalLoading) return <CalciteLoader />;
  
  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Portal Dashboard">
          <CalciteBlock heading="Connection" open>
            <div style={{ padding: '0.5rem' }}>
              <div><strong>Portal:</strong> {portal?.name}</div>
              {user ? (
                <>
                  <div><strong>User:</strong> {user.username}</div>
                  <CalciteButton onClick={signOut} width="full">
                    Sign Out
                  </CalciteButton>
                </>
              ) : (
                <CalciteButton onClick={signIn} width="full">
                  Sign In
                </CalciteButton>
              )}
            </div>
          </CalciteBlock>
          
          {content && (
            <CalciteBlock heading="My Content" collapsible>
              <CalciteList>
                {content.items.slice(0, 5).map(item => (
                  <CalciteListItem key={item.id}>
                    {item.title}
                  </CalciteListItem>
                ))}
              </CalciteList>
            </CalciteBlock>
          )}
          
          {searchResults && (
            <CalciteBlock heading="Trending Maps" collapsible>
              <CalciteList>
                {searchResults.results.slice(0, 5).map(item => (
                  <CalciteListItem key={item.id}>
                    {item.title} ({item.numViews} views)
                  </CalciteListItem>
                ))}
              </CalciteList>
            </CalciteBlock>
          )}
        </CalcitePanel>
      </CalciteShellPanel>
    </CalciteShell>
  );
}
```

### Example 2: Content Browser

```tsx
import {
  usePortal,
  usePortalSearch,
  usePortalItem
} from 'react-arcgis';

function ContentBrowser() {
  const { portal } = usePortal();
  const { search, loading, results } = usePortalSearch(portal);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const { item } = usePortalItem({
    id: selectedItemId,
    portal
  });
  
  const handleSearch = async (query) => {
    await search({
      query,
      num: 20,
      sortField: 'modified',
      sortOrder: 'desc'
    });
  };
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', height: '100vh' }}>
      {/* Search Panel */}
      <CalcitePanel heading="Browse Content">
        <div style={{ padding: '1rem' }}>
          <CalciteInput
            placeholder="Search..."
            onCalciteInputChange={(e) => handleSearch(e.target.value)}
          />
          
          {loading && <CalciteLoader />}
          
          {results && (
            <CalciteList>
              {results.results.map(result => (
                <CalciteListItem
                  key={result.id}
                  onClick={() => setSelectedItemId(result.id)}
                >
                  <img
                    slot="content-start"
                    src={result.thumbnailUrl}
                    width="50"
                    height="50"
                  />
                  <div>{result.title}</div>
                  <div slot="content-end">{result.type}</div>
                </CalciteListItem>
              ))}
            </CalciteList>
          )}
        </div>
      </CalcitePanel>
      
      {/* Detail Panel */}
      <CalcitePanel heading="Details">
        {item ? (
          <div style={{ padding: '1rem' }}>
            <img src={item.thumbnailUrl} style={{ width: '100%', maxWidth: '400px' }} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div><strong>Type:</strong> {item.type}</div>
            <div><strong>Owner:</strong> {item.owner}</div>
            <div><strong>Views:</strong> {item.numViews}</div>
            <div><strong>Tags:</strong> {item.tags?.join(', ')}</div>
          </div>
        ) : (
          <div style={{ padding: '1rem' }}>
            Select an item to view details
          </div>
        )}
      </CalcitePanel>
    </div>
  );
}
```

---

## Best Practices

### 1. Authentication Flow

```tsx
function App() {
  const { 
    credential, 
    checkSignInStatus, 
    signIn 
  } = useOAuthInfo({
    appId: 'YOUR_APP_ID'
  });
  
  const { portal } = usePortal({
    url: 'https://www.arcgis.com'
  });
  
  useEffect(() => {
    // Check if already signed in on mount
    checkSignInStatus();
  }, []);
  
  if (!credential) {
    return (
      <div>
        <h1>Please sign in</h1>
        <CalciteButton onClick={signIn}>Sign In</CalciteButton>
      </div>
    );
  }
  
  return <YourApp portal={portal} />;
}
```

### 2. Error Handling

```tsx
const { search, loading, error } = usePortalSearch(portal);

try {
  await search({ query: '...' });
} catch (err) {
  console.error('Search failed:', err);
}

{error && (
  <CalciteNotice kind="danger" open>
    <div slot="message">{error.message}</div>
  </CalciteNotice>
)}
```

### 3. Loading States

```tsx
{loading && <CalciteLoader />}
<CalciteButton onClick={handleAction} loading={loading}>
  Action
</CalciteButton>
```

---

## Summary

**9 Portal Hooks for Complete Integration:**

✅ **usePortal** - Basic portal connection
✅ **useOAuthInfo** - OAuth authentication
✅ **usePortalItem** - Load portal items
✅ **usePortalSearch** - Search portal content
✅ **usePortalGroup** - Work with groups
✅ **usePortalUser** - User profiles
✅ **usePortalContent** - Manage content
✅ **useWebMap** - Load web maps
✅ **useWebScene** - Load web scenes

**Features:**
- ✅ Authentication (OAuth, Portal)
- ✅ Content search & discovery
- ✅ Item management (CRUD)
- ✅ Group management
- ✅ User profiles
- ✅ Content sharing
- ✅ Full TypeScript support

**Production ready for Portal-integrated applications!** 🌐
