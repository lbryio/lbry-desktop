import * as React from 'react';

type Props = {
  text?: string | null | undefined,
  lines: number,
  showTooltip?: boolean,
  children?: React.ReactNode
};

const TruncatedText = (props: Props) => {
  const { text, children, lines, showTooltip } = props;
  const tooltip = showTooltip ? children || text : '';
  return (
// @ts-expect-error - TS2322 - Type '{}' is not assignable to type 'string'.
    <span title={tooltip} className="truncated-text" style={{ WebkitLineClamp: lines }}>
      {children || text}
    </span>
  );
};

TruncatedText.defaultProps = {
  showTooltip: true,
};

export default TruncatedText;
