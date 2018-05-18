FatalErrorDialog example:

```js
initialState = { isOpen: false };

const onOpenClick = () => {
	setState({ isOpen: true});
}

const onReloadClick = () => {
	setState({ isOpen: false});
}

const error = {
	message: 'Error message',
	detail: 'Error detail',
}

;<div>
	<button onClick={onOpenClick}>Open</button>

	<FatalErrorDialog
		open={state.isOpen}
		onReloadClick={onReloadClick}
		error={error}
	/>
</div>
```
