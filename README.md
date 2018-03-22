# Kopano REACT UI component library

Kpop is a collection of React UI components and UI uitilites for Kopano Web
apps.

## Using kpop as dependency

Kpop should be added from a release tarball with a fixed version.

```
yarn add http://longsleep.lxd.kopano.lan/npm-packages/kpop-${KPOP_RELEASE}.tgz
```

As development of kpop continues, the download location might change.


## Versioning scheme

Kpop uses a simple major.minor.patch versioning scheme, which only guarantees
backwards compatibility on patch level changes until we reach version 1.0.0.
For this reason, it is essential that consumers of kpop pin the version number.

- Major increases on all changes affecting multiple components and/or other
  fundamental changes. On Major increase, all other digits are set to zero.

- Minor increases when a new component or utility function was added. Once kpop
  reaches version 1.0.0, minor increases are also backwards compatible. When
  minor increases, the patch digit is set to zero,

- Patch increases whenever something changes which does not change any
  functionality. It includes only fixes for defects.

## Development

### Add a new component

Adding components to kpop should follow the following simple guidelines.

1. Implement the component as a local component in your app and make the
   component feature complete.

2. Verify that the component works without the rest of the app and then check
   that the component is useful for other apps.

3. Check passed, so make a branch of kpop, and copy of the component to
   an appropriate folder inside the `src` tree of kpop.

4. Create a kpop branch of your app, where you remove the local component and
   let the app instead import the component from kpop.

5. App works, so create a pull request to kpop master branch with your
   component. Use one commit per new component and do not mix up.

6. Eventually the component gets merged into kpop master and released. Then
   update your kpop app branch with the correct dependency of the kpop release
   which contains the new component and create a pull request for your app.
