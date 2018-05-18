UpdateAvailableSnack example:

```js
initialState = { isOpen: false };

const onOpenClick = () => {
	setState({ isOpen: true});
}

const onReloadClick = () => {
	setState({ isOpen: false});
}

;<div>
	<button onClick={onOpenClick}>Open</button>

	<UpdateAvailableSnack open={state.isOpen} onReloadClick={onReloadClick}/>
</div>
```
