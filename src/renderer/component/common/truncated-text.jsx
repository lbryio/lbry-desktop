// @flow
import * as React from 'react';

type Props = {
  lines: ?number,
  children: React.Node,
};

const TruncatedText = (props: Props) => (
  <span className="truncated-text" style={{ WebkitLineClamp: props.lines }}>
    {props.children}
  </span>
);

export default TruncatedText;
