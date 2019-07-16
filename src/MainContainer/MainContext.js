import React from 'react';

export const MainContext = React.createContext(
  {
    aside: null,
  }
);

export function withMain(Component) {
  return function ComponentWithBase(props) {
    return (
      <MainContext.Consumer>
        {m => <Component aside={m.aside} {...props}/>}
      </MainContext.Consumer>
    );
  };
}
