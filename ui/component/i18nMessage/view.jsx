// @flow
import React from 'react';

type Props = {
  tokens: Object,
  children: string, // e.g. "Read %faq_link% for more detail"
};

function spacesCleaner(message) {
  const regExp = new RegExp('/%w+%/', 'm');
  const arrayMach = message.match(regExp);

  if (!arrayMach) {
    console.log('>> ' + message);
    console.log('>>>> No correspondances, nothing to clean.');
    return message;
  }

  console.log('Found ' + arrayMach.length + ' correspondance(s) to clean');
  console.log(arrayMach);

  for (let index = 0; index < arrayMach.length; index++) {
    arrayMach[index] = arrayMach[index].replace(' ', '');
  }

  message = arrayMach.join(' | ');

  console.log('>> ' + message);

  return message;
}

export default function I18nMessage(props: Props) {
  const message = __(props.children),
    regexp = /%\w+%/g,
    matchingGroups = message.match(regexp);

  // TEST
  console.log(spacesCleaner(__(props.children)));
  console.log(__(props.children));
  // ----

  if (!matchingGroups) {
    return message;
  }

  const messageSubstrings = props.children.split(regexp),
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
