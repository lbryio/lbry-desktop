// @flow
import * as React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

const SLIM_TAGS = 2;
const NORMAL_TAGS = 4;
const LARGE_TAGS = 10;

type Props = {
  tags: Array<string>,
  followedTags: Array<Tag>,
  large: boolean,
  slim: boolean,
};

export default function FileTags(props: Props) {
  const { tags, followedTags, large, slim } = props;
  const numberOfTags = slim ? SLIM_TAGS : large ? LARGE_TAGS : NORMAL_TAGS;

  let tagsToDisplay = [];
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

  return (
    <div className={classnames('file-properties', { 'file-properties--large': large })}>
      {tagsToDisplay.map(tag => (
        <Button key={tag} title={tag} navigate={`$/tags?t=${tag}`} className="tag" label={tag} />
      ))}
    </div>
  );
}
