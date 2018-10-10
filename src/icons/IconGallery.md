Apps icons:

```jsx
const Typography = require('@material-ui/core/Typography').default;
const PersonIcon = require('@material-ui/icons/Person').default;
const ThreeDRotationIcon = require('@material-ui/icons/ThreeDRotation').default;

const KopanoCalendarIcon = require('../icons/KopanoCalendarIcon').default;
const KopanoContactsIcon = require('../icons/KopanoContactsIcon').default;
const KopanoKonnectIcon = require('../icons/KopanoKonnectIcon').default;
const KopanoMailIcon = require('../icons/KopanoMailIcon').default;
const KopanoMeetIcon = require('../icons/KopanoMeetIcon').default;
const KopanoWebappIcon = require('../icons/KopanoWebappIcon').default;

;<div>
	<h3>Gallery</h3>
	<div>
		<IconGallery/>
	</div>

	<h3>Various alignments with text</h3>
	<div style={{fontSize: '60px', lineHeight: '1.6em', background: '#ffccff', display: 'inline-block'}}>
		AÁq <KopanoCalendarIcon fontSize="inherit"/>
		<KopanoContactsIcon style={{verticalAlign: 'middle'}} fontSize="inherit"/>
		<KopanoKonnectIcon style={{verticalAlign: 'bottom'}} fontSize="inherit"/>
		<KopanoMailIcon style={{verticalAlign: 'top'}} fontSize="inherit"/>
		<KopanoMeetIcon style={{verticalAlign: 'text-bottom'}} fontSize="inherit"/>
		<KopanoWebappIcon fontSize="inherit"/> ZÜÇy
	</div>
	<h3>In Typography with line-height and alignment</h3>
	<div>
		<Typography style={{lineHeight: '1.6em'}}>Sed ut perspiciatis unde omnis <KopanoMailIcon style={{verticalAlign: 'middle'}}/> iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae <PersonIcon style={{verticalAlign: 'middle'}}/> vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt <KopanoCalendarIcon style={{verticalAlign: 'middle'}}/>. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil <KopanoWebappIcon style={{verticalAlign: 'middle'}}/> molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</Typography>
	</div>
	<h3>Compare with Material-UI icons</h3>
	<div style={{fontSize: '60px', lineHeight: '1.6em', background: '#ffccff', display: 'inline-block'}}>
		<KopanoCalendarIcon fontSize="inherit"/>
		<KopanoContactsIcon fontSize="inherit"/>
		<PersonIcon fontSize="inherit"/>
		<KopanoKonnectIcon fontSize="inherit"/>
		<KopanoMailIcon fontSize="inherit"/>
		<KopanoMeetIcon fontSize="inherit"/>
		<KopanoWebappIcon fontSize="inherit"/>
		<ThreeDRotationIcon fontSize="inherit"/>
	</div>
</div>
```
