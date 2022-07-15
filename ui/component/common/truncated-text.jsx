// @flow
import * as React from 'react';

type Props = {
  text?: ?string,
  lines: number,
  showTooltip?: boolean,
  children?: React.Node,
  style?: any,
};

const TruncatedText = (props: Props) => {
  const { text, children, lines, showTooltip, style } = props;
  const tooltip = showTooltip ? children || text : '';
  return (
    <span title={tooltip} className="truncated-text" style={{ WebkitLineClamp: lines, ...style }}>
      {children || text}
    </span>
  );
};

TruncatedText.defaultProps = {
  showTooltip: true,
};

export default TruncatedText;
