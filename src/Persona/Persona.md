Persona examples:

```jsx
const withStyles = require('material-ui/styles').withStyles;
const GroupIcon = require('material-ui-icons/Group').default;

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'left',
	'& > *': {
		margin: 5,
	}
  },
};

function Personas(props) {
  const { classes } = props;
  return (
    <div className={classes.row}>
      <Persona user={{givenName: 'John', surname: 'Doe', displayName: 'John Doe'}}/>
	  <Persona user={{givenName: 'John', surname: 'Doee', displayName: 'John Doee'}}/>
	  <Persona user={{givenName: '尾田', surname: '栄一郎', displayName: '尾田 栄一郎'}}/>
	  <Persona user={{displayName: 'Hans Meiser'}}/>
	  <Persona user={{displayName: 'Hans Meiser'}} forceIcon />
	  <Persona user={{displayName: 'Hans Meiser', guid: '1'}}/>
	  <Persona user={{givenName: 'Max', surname: 'Mustermann'}}/>
	  <Persona user={{displayName: '+31 (0) 15 750 4712'}}/>
	  <Persona user={{displayName: '+31 (0) 15 750 4712'}} allowPhoneInitials/>
	  <Persona user={{displayName: 'Some group'}} forceIcon icon={<GroupIcon/>}/>
    </div>
  );
}

const StyledPersonas = withStyles(styles)(Personas);

;<StyledPersonas/>
```
