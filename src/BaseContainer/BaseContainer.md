BaseContainer example:

```js
initialState = {
	ready: false,
	updateAvailable: false,
	a2HsAvailable: false,
	error: null,
};

const onToggleStateFlag = key => () => {
	setState({ [key]: !state[key] } );
}

;<div>
	<div>
		<button onClick={onToggleStateFlag('ready')}>Toggle ready</button> <button onClick={onToggleStateFlag('updateAvailable')}>Toggle update available</button> <button onClick={onToggleStateFlag('a2HsAvailable')}>Toggle a2hs available</button>
	</div>

	<BaseContainer
		dispatch={async () => {}}
		ready={state.ready}
		updateAvailable={state.updateAvailable}
		a2HsAvailable={state.a2HsAvailable}
	>
		<h3>Content will appear here</h3>
	</BaseContainer>
</div>
```
