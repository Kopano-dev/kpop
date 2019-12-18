import React from 'react';

export const BaseContext = React.createContext(
  {
    // default values are empty.
    config: {},
    embedded: {},
  }
);

export function withBase(Component) {
  return function ComponentWithBase(props) {
    return (
      <BaseContext.Consumer>
        {b => <Component {...props} config={b.config} embedded={b.embedded}/>}
      </BaseContext.Consumer>
    );
  };
}

export default BaseContext;
