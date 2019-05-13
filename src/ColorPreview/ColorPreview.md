ColorPreview from colors:

```jsx
const kopanoBlue = require('../colors/kopanoBlue').default
const kopanoGreen = require('../colors/kopanoGreen').default
const kopanoOrange = require('../colors/kopanoOrange').default
const kopanoRed = require('../colors/kopanoRed').default
const lightGreen = require('@material-ui/core/colors/lightGreen').default
const brown = require('@material-ui/core/colors/brown').default


initialState = {
	colorType: 'light',
	contrastThreshold: 3,
	tonalOffset: 0.2
};

function update(field) {
	return function(event) {
		let value = event.target.value;
		switch (field) {
			case 'colorType':
				break;
			case 'contrastThreshold':
				value = parseInt(value, 10) / 10;
				break;
			case 'tonalOffset':
				value = parseInt(value, 10) / 10;
				break;
		}
		setState({
			[field]: value
		});
	}
}

;<div>
	<p>
		Type: <select value={state.colorType} onChange={update('colorType')}>
			<option>light</option>
			<option>dark</option>
		</select><br/>
		contrastThreshold: <input type="range" min="0" max="100" value={state.contrastThreshold * 10} onChange={update('contrastThreshold')} /> {state.contrastThreshold}<br/>
		tonalOffset: <input type="range" min="-100" max="100" value={state.tonalOffset * 10} onChange={update('tonalOffset')} /> {state.tonalOffset}<br />
	</p>
	<div>

		<ColorPreview title="kopanoBlue" color={kopanoBlue} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>
		<ColorPreview title="kopanoGreen" color={kopanoGreen} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>
		<ColorPreview title="kopanoOrange" color={kopanoOrange} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>
		<ColorPreview title="kopanoRed" color={kopanoRed} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>

	</div>

	<hr/>

	<ColorPreview title="material-ui lightGreen" color={lightGreen} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>
	<ColorPreview title="material-ui brown" color={brown} type={state.colorType} contrastThreshold={state.contrastThreshold} tonakOffset={state.tonalOffset}/>
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
