SigninDialog example:

```js
initialState = { isOpen: false };

const onOpenClick = () => {
	setState({ isOpen: true});
}

const onSigninClick = () => {
	setState({ isOpen: false});
}

;<div>
	<button onClick={onOpenClick}>Open</button>

	<SigninDialog
		open={state.isOpen}
		fullWidth maxWidth="xs"
		PaperProps={{elevation: 0}}
		onSigninClick={onSigninClick}
	/>
</div>
```
