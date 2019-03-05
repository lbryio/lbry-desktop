import React from 'react';

const Theme = props => {
  const { themePath } = props;

  if (!themePath) {
    return null;
  }

  return <link href={themePath} rel="stylesheet" type="text/css" media="screen,print" />;
};

export default Theme;
