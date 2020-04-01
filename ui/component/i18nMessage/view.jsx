// @flow
import React from 'react';

type Props = {
  tokens: Object,
  children: String, // e.g. "Read %faq_link% for more detail"
};

function replaceAll(withSpaces, withoutSpaces, stringToclean) {
  return stringToclean.split(withSpaces).join(withoutSpaces);
}

function spacesCleaner(message) {
  const regExp = /%\w+\s\w+%|%\s\w+%|%\w+\s%/g; // are there spaces in tokens ?
  let arrayMach = message.match(regExp); // e.g. "Read %fa q_link% for more detail", "% faq_link%", "%faq_link %"

  if (!arrayMach) {
    return message;
  }

  var arrayWithSpaces = arrayMach.slice(0, arrayMach.length);

  for (let index = 0; index < arrayMach.length; index++) {
    arrayMach[index] = arrayMach[index].replace(' ', '');
  }

  for (let index = 0; index < arrayMach.length; index++) {
    message = replaceAll(arrayWithSpaces[index], arrayMach[index], message);
  }
  return message;
}

export default function I18nMessage(props: Props) {
  const msg = __(props.children);
  var message = spacesCleaner(msg);

  const regexp = /%\w+%/g,
    matchingGroups = message.match(regexp);

  if (!matchingGroups) {
    return message;
  }

  const messageSubstrings = message.split(regexp),
    tokens = props.tokens;

  return (
    <React.Fragment>
      {messageSubstrings.map((substring, index) => {
        const token =
          index < matchingGroups.length ? matchingGroups[index].substring(1, matchingGroups[index].length - 1) : null; // get token without % on each side
        return (
          <React.Fragment key={index}>
            {substring}
            {token && tokens[token]}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}
