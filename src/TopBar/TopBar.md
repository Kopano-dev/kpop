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
