BaseContainer example:

```js
initialState = { isReady: false };

const onToggleReadyClick = () => {
	setState({ isReady: !state.isReady} );
}

;<div>
	<div>
		<button onClick={onToggleReadyClick}>Toggle ready</button>
	</div>

	<BaseContainer
		ready={state.isReady}
	>
		<h3>Content will appear here</h3>
	</BaseContainer>
</div>
```
