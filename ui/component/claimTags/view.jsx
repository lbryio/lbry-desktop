// @flow
import * as React from 'react';
import classnames from 'classnames';
import Tag from 'component/tag';

const SLIM_TAGS = 1;
const NORMAL_TAGS = 3;
const LARGE_TAGS = 6;

type Props = {
  tags: Array<string>,
  followedTags: Array<Tag>,
  type: string,
};

export default function ClaimTags(props: Props) {
  const { tags, followedTags, type } = props;
  const numberOfTags = type === 'small' ? SLIM_TAGS : type === 'large' ? LARGE_TAGS : NORMAL_TAGS;

  let tagsToDisplay = [];

  if (tags.includes('mature')) {
    tagsToDisplay.push('mature');
  }

  for (var i = 0; tagsToDisplay.length < numberOfTags - 2; i++) {
    const tag = followedTags[i];
    if (!tag) {
      break;
    }

    if (tags.includes(tag.name)) {
      tagsToDisplay.push(tag.name);
    }
  }

  const sortedTags = tags.sort((a, b) => a.localeCompare(b));

  for (var i = 0; i < sortedTags.length; i++) {
    const tag = sortedTags[i];
    if (!tag || tagsToDisplay.length === numberOfTags) {
      break;
    }

    if (!tagsToDisplay.includes(tag)) {
      tagsToDisplay.push(tag);
    }
  }

  if (!tagsToDisplay.length) {
    return null;
  }

  return (
    <div className={classnames('claim__tags', { 'claim__tags--large': type === 'large' })}>
      {tagsToDisplay.map((tag) => (
        <Tag key={tag} title={tag} name={tag} />
      ))}
    </div>
  );
}
