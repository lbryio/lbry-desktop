// @flow
import * as React from 'react';

type Props = {
  text: ?string,
  lines: number,
};

const TruncatedText = (props: Props) => (
  <span title={props.text} className="truncated-text" style={{ WebkitLineClamp: props.lines }}>
    {props.text}
  </span>
);

export default TruncatedText;
