import React from 'react';

const Theme = props => {
  const { themePath } = props;

  // Force light mode while until dark mode is ready
  // This is so we don't have to change users settings for them
  return null;

  // if (!themePath) {
  //   return null;
  // }
  //
  // return <link href={themePath} rel="stylesheet" type="text/css" media="screen,print" />;
};

export default Theme;
