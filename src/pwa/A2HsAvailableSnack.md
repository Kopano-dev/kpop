A2HsAvailableSnack example:

<em>Note that his snack can show only once.</em>

```js
initialState = { isOpen: false, disabled: false };

const onOpenClick = () => {
	setState({ isOpen: true, disabled: true});
}

const onAddClick = () => {
	setState({ isOpen: false});
}

;<div>
	<button onClick={onOpenClick} disabled={state.disabled}>Open</button>

	<A2HsAvailableSnack open={state.isOpen} onAddClick={onAddClick}/>
</div>
```
