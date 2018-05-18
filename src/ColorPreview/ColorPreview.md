ColorPreview from colors:

```jsx
const kopanoBlue = require('../colors/kopanoBlue').default
const lightGreen = require('material-ui/colors/lightGreen').default
const brown = require('material-ui/colors/brown').default
;<div>
	<ColorPreview title="kopanoBlue" color={kopanoBlue}/>
	<ColorPreview title="material-ui lightGreen" color={lightGreen}/>
	<ColorPreview title="material-ui brown" color={brown}/>
</div>
```

ColorPreview from kpop default theme:

```jsx
;<div>
	<div>
		<ColorPreview paletteColor="primary"/>
		<ColorPreview paletteColor="secondary"/>
		<ColorPreview paletteColor="error"/>
	</div>
	<div>
		<ColorPreview paletteColor="text"/>
		<ColorPreview paletteColor="grey"/>
		<ColorPreview paletteColor="common"/>
		<ColorPreview paletteColor="background"/>
	</div>
</div>
```
