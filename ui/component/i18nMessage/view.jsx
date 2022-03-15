// @flow
import React from 'react';

type Props = {
  tokens: Object,
  children: string, // e.g. "Read %faq_link% for more detail"
};

export default function I18nMessage(props: Props) {
  const message = __(props.children), // whole message string
    regexp = /%\w+%/g,
    interpolatedVariables = message.match(regexp);

  // if there's no variable to interpolate then just send message
  // otherwise algo to build the element below
  if (!interpolatedVariables) {
    return message;
  }

  // split string from variables
  const messageSubstrings = message.split(regexp),
    // interpolated variables
    tokens = props.tokens;

  return (
    <React.Fragment>
      {/* loop through substrings, interpolate tokens in between them */}
      {messageSubstrings.map((substring, index) => {
        // the algorithm is such that, there will always be a variable in between a message substring
        // so when you use the index you actually grab the proper token
        const matchingToken = interpolatedVariables.length && interpolatedVariables[index];

        // get token name without % on each side
        const tokenVariableName = matchingToken && matchingToken.substring(1, matchingToken.length - 1);

        // select token to use if it matches
        const tokenToUse = tokenVariableName && tokens[tokenVariableName];

        return (
          <React.Fragment key={index}>
            {substring}
            {tokenToUse}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}
