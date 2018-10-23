SigninDialog example:

```js
initialState = { isOpen: false };

const onOpenClick = () => {
	setState({ isOpen: true});
}

const onSignInClick = () => {
	setState({ isOpen: false});
}

;<div>
	<button onClick={onOpenClick}>Open</button>

	<SigninDialog
		open={state.isOpen}
		fullWidth maxWidth="xs"
		PaperProps={{elevation: 0}}
		onSignInClick={onSignInClick}
	/>
</div>
```
