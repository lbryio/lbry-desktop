import React from 'react';
import 'css-doodle';

export default ([rule = '']) => () => (
  // eslint-disable-line
  <css-doodle use="var(--rule)">{rule}</css-doodle>
);
