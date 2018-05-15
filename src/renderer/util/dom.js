// @flow
import * as React from 'react';

// is a child component being rendered?
export const isShowingChildren = (children: React.Node): boolean => {
  if (Array.isArray(children)) {
    const firstChildIndex = children.findIndex(child => child);
    return firstChildIndex > -1;
  }

  return !!children;
};
