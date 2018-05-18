ColorPreview example:

```jsx
const kopanoBlue = require('../colors/kopanoBlue').default
const blueGrey = require('material-ui/colors/blueGrey').default
const red = require('material-ui/colors/red').default
;<div>
	<ColorPreview
		title="kopanoBlue contrast 2.4"
		color={kopanoBlue}
		contrastThreshold={2.4}
	/>
	<ColorPreview
		title="kopanoBlue default"
		color={kopanoBlue}
	/>
	<ColorPreview
		title="material blueGrey"
		color={blueGrey}
	/>
	<ColorPreview
		title="material red"
		color={red}
	/>
</div>
```
