// @flow
import * as React from 'react';
import twemoji from 'twemoji';
const emojiList = require('node-emoji');

function escapeHtmlProperty(property) {
  return property
    ? String(property)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    : '';
}

type Props = {
  text: ?string,
  lines: number,
  showTooltip?: boolean,
  style?: any,
  emoji?: any,
};

const TruncatedText = (props: Props) => {
  const { text, lines, showTooltip, style } = props;
  const tooltip = showTooltip ? text : '';

  const RE_EMOJI = /:\+1:|:-1:|:[\w-]+:/g;

  const Twemoji = ({ text }) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: twemoji.parse(escapeHtmlProperty(text || '').replace(RE_EMOJI, getEmoji)),
        }}
      />
    );
  };

  function getEmoji(match) {
    const got = emojiList.get(match);
    if (got === match) {
      return got;
    }

    return got + ' ';
  }

  return (
    <span title={tooltip} className="truncated-text" style={{ WebkitLineClamp: lines, ...style }}>
      <Twemoji text={text} />
    </span>
  );
};

TruncatedText.defaultProps = {
  showTooltip: true,
};

export default TruncatedText;
