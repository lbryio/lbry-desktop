// @flow
import * as React from 'react';
import Button from 'component/button';

const MAX_TAGS = 4;

type Props = {
  tags: Array<string>,
  followedTags: Array<Tag>,
};

export default function FileTags(props: Props) {
  const { tags, followedTags } = props;

  let tagsToDisplay = [];
  for (var i = 0; tagsToDisplay.length < MAX_TAGS - 2; i++) {
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
    if (!tag || tagsToDisplay.length === MAX_TAGS) {
      break;
    }

    if (!tagsToDisplay.includes(tag)) {
      tagsToDisplay.push(tag);
    }
  }

  return (
    <div className="file-properties">
      {tagsToDisplay.map(tag => (
        <Button key={tag} navigate={`$/tags?t=${tag}`} className="tag">
          {tag}
        </Button>
      ))}
    </div>
  );
}
