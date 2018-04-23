import React from 'react';
import Loading from './Loading';

import createComponentWithIntl from '../utils/createComponentWithIntl';

test('Loading renders correctly', () => {
  const component = createComponentWithIntl(<Loading/>);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Loading renders correctly error=true', () => {
  const component =  createComponentWithIntl(<Loading error={true}/>);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Loading renders correctly timedOut=true', () => {
  const component = createComponentWithIntl(<Loading timedOut={true}/>);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Loading renders correctly pastDelay=true', () => {
  const component = createComponentWithIntl(<Loading pastDelay={true}/>);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
