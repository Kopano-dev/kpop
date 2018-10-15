import React from 'react';

export const ConfigContext = React.createContext(
  {} // default value, empty config.
);

export function withConfig(Component) {
  return function ComponentWithConfig(props) {
    return (
      <ConfigContext.Consumer>
        {config => <Component {...props} config={config}/>}
      </ConfigContext.Consumer>
    );
  };
}
