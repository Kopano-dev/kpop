AppsSwitcherListItem example:

```jsx
const List = require('@material-ui/core/List').default;
const ListItem = require('@material-ui/core/ListItem').default;
const ListItemIcon = require('@material-ui/core/ListItemIcon').default;
const ListItemText = require('@material-ui/core/ListItemText').default;
const SettingsIcon = require('@material-ui/icons/Settings').default;
const HelpIcon = require('@material-ui/icons/Help').default;
const WhateverIcon = require('@material-ui/icons/Exposure').default;

<List style={{width: 300}}>
  <ListItem button>
    <ListItemIcon>
      <SettingsIcon />
    </ListItemIcon>
    <ListItemText inset primary="Settings" />
  </ListItem>
  <ListItem button>
    <ListItemIcon>
      <WhateverIcon />
    </ListItemIcon>
    <ListItemText inset primary="Whatever" />
  </ListItem>
  <AppsSwitcherListItem/>
  <ListItem button>
	<ListItemIcon>
	  <HelpIcon />
	</ListItemIcon>
	<ListItemText inset primary="Help" />
  </ListItem>
</List>
```
