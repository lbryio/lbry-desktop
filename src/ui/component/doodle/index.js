/* eslint react/display-name: 0 */

import React from 'react';
import 'css-doodle';

export default ([rule = '']) => () => <css-doodle use="var(--rule)">{rule}</css-doodle>;
