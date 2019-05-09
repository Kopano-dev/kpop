import React from 'react';

export const BaseContext = React.createContext(
  {
    config: {}, // default value, empty config.
  }
);

export function withBase(Component) {
  return function ComponentWithBase(props) {
    return (
      <BaseContext.Consumer>
        {b => <Component {...props} config={b.config}/>}
      </BaseContext.Consumer>
    );
  };
}
