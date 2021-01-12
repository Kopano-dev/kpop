TopBar example with all features enabled:

```js
<TopBar
	title="App title"
	forceAnchor
	position="static"
	user={{
		displayName: "Jonathan Smith",
		mail: "heyfromjonathan@kopano.com",
		signoutHandler: () => {},
	}}
	centerContent={<span>Center content</span>}
>
	<span>Extra content</span>
</TopBar>
```

TopBar example with primary color:

```js
<TopBar title="App title" color="primary" position="static"></TopBar>
```

TopBar example with secondary color:

```js
<TopBar title="App title" color="secondary" position="static"></TopBar>
```

TopBar example with custom anchor icon:

```js
const PersonIcon = require('@material-ui/icons/Person').default;

<TopBar title="App title" color="primary" position="static" forceAnchor anchorIcon={<PersonIcon/>}></TopBar>
```

TopBar example with app logo and default badge:
```js
const KopanoMeetIcon = require('../icons/KopanoMeetIcon').default;

<TopBar title="Meet" forceAnchor appLogo={<KopanoMeetIcon/>} position="static" BadgeProps={{invisible: false}}></TopBar>
```

TopBar example without app logo:
```js
const KopanoMeetIcon = require('../icons/KopanoMeetIcon').default;

<TopBar title="App title" forceAnchor appLogo={null} position="static"></TopBar>
```

TopBar minimal example with app logo as anchor and badge:
```js
const KopanoMeetIcon = require('../icons/KopanoMeetIcon').default;

<TopBar title={null} forceAnchor appLogo={null} forceAnchor anchorIcon={<KopanoMeetIcon/>} position="static" BadgeProps={{invisible: false}}></TopBar>
```
