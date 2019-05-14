MasterButton:

```jsx
const AddIcon = require('@material-ui/icons/Add').default;
const CallIcon = require('@material-ui/icons/Call').default;

;<div>
<MasterButton icon={<AddIcon/>}>Add entry</MasterButton>
<MasterButton icon={<AddIcon/>} disabled>Disabled</MasterButton>
<MasterButton icon={<CallIcon/>} color="secondary">New call</MasterButton>
</div>
```
