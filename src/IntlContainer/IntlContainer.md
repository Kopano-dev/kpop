Intl:

```jsx
const FormattedTime = require('react-intl').FormattedTime;
const FormattedRelative = require('react-intl').FormattedRelative;
const FormattedDate = require('react-intl').FormattedDate;

const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
;<div>
<h3>Time formatting</h3>
<ul>
	<li><FormattedTime value={date}/></li>
	<li><FormattedRelative value={date}/></li>
	<li><FormattedRelative value={Date.now()}/></li>
</ul>

<h3>Date formatting</h3>
<ul>
	<li><FormattedDate value={new Date(date)}/></li>
	<li><FormattedDate
			value={date}
			year="numeric"
			month="long"
			day="2-digit"
		/>
	</li>
</ul>
</div>
```
