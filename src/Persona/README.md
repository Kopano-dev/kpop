Basic Persona example:

```js
<Persona user={{givenName: 'John', surname: 'Doe', displayName: 'John Doe'}}/>
```

Different name shows a different.
```js
<Persona user={{givenName: 'John', surname: 'Doee', displayName: 'John Doee'}}/>
```

Non latin names shows an person icon instead of two letters.
```js
<Persona user={{givenName: '尾田', surname: '栄一郎', displayName: '尾田 栄一郎'}}/>
```
