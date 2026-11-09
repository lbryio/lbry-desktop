import * as React from 'react';
import classnames from 'classnames';
import Tag from 'component/tag';

const SLIM_TAGS = 1;
const NORMAL_TAGS = 3;
const LARGE_TAGS = 6;

type Props = {
  tags: Array<string>,
  followedTags: Array<Tag>,
  type: string
};

export default function ClaimTags(props: Props) {
  const { tags, followedTags, type } = props;
  const numberOfTags = type === 'small' ? SLIM_TAGS : type === 'large' ? LARGE_TAGS : NORMAL_TAGS;

  let tagsToDisplay: unknown = [];

  if (tags.includes('mature')) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    tagsToDisplay.push('mature');
  }

// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
  for (var i = 0; tagsToDisplay.length < numberOfTags - 2; i++) {
    const tag = followedTags[i];
    if (!tag) {
      break;
    }

    if (tags.includes(tag.name)) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      tagsToDisplay.push(tag.name);
    }
  }

  const sortedTags = tags.sort((a, b) => a.localeCompare(b));

  for (var i = 0; i < sortedTags.length; i++) {
    const tag = sortedTags[i];
// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
    if (!tag || tagsToDisplay.length === numberOfTags) {
      break;
    }

// @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
    if (!tagsToDisplay.includes(tag)) {
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      tagsToDisplay.push(tag);
    }
  }

// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
  if (!tagsToDisplay.length) {
    return null;
  }

  return (
    <div className={classnames('claim__tags', { 'claim__tags--large': type === 'large' })}>
{ /* @ts-expect-error - TS2339 - Property 'map' does not exist on type 'unknown'. */}
      {tagsToDisplay.map((tag) => (
        // @ts-expect-error - TS2322 (ts-migration)
        <Tag key={tag} title={tag} name={tag} />
      ))}
    </div>
  );
}
