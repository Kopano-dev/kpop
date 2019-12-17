import React from 'react';

import Slide from '@material-ui/core/Slide';

export const SlideUpTransition = React.forwardRef(function SlideUpTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
