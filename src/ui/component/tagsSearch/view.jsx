// @flow
import React, { useState } from 'react';
import { useTransition, animated } from 'react-spring';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';

const unfollowedTagsAnimation = {
  from: { opacity: 0 },
  enter: { opacity: 1, maxWidth: 200 },
  leave: { opacity: 0, maxWidth: 0 },
};

type Props = {
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollow: string => void,
  doAddTag: string => void,
  onSelect?: Tag => void,
  suggestMature?: boolean,
};

export default function TagSelect(props: Props) {
  const { unfollowedTags = [], followedTags = [], doToggleTagFollow, doAddTag, onSelect, suggestMature } = props;
  const [newTag, setNewTag] = useState('');

  let tags = unfollowedTags.slice();
  if (newTag) {
    tags.unshift({ name: newTag });
  }

  const doesTagMatch = name => (newTag ? name.toLowerCase().includes(newTag.toLowerCase()) : true);
  // Make sure there are no duplicates, then trim
  const suggestedTagsSet = new Set(tags.map(tag => tag.name));
  const suggestedTags = Array.from(suggestedTagsSet)
    .filter(doesTagMatch)
    .slice(0, 5);

  if (!newTag && suggestMature) {
    suggestedTags.push('mature');
  }

  const suggestedTransitions = useTransition(suggestedTags, tag => tag, unfollowedTagsAnimation);

  function onChange(e) {
    setNewTag(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setNewTag('');

    if (onSelect) {
      onSelect({ name: newTag });
    } else {
      if (!unfollowedTags.map(({ name }) => name).includes(newTag)) {
        doAddTag(newTag);
      }

      if (!followedTags.map(({ name }) => name).includes(newTag)) {
        doToggleTagFollow(newTag);
      }
    }
  }

  function handleTagClick(tag) {
    if (onSelect) {
      onSelect({ name: tag });
    } else {
      doToggleTagFollow(tag);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormField
          label={__('Find New Tags')}
          onChange={onChange}
          placeholder={__('Search for more tags')}
          type="text"
          value={newTag}
        />
      </Form>
      <ul className="tags">
        {suggestedTransitions.map(({ item, key, props }) => (
          <animated.li key={key} style={props}>
            <Tag name={item} type="add" onClick={() => handleTagClick(item)} />
          </animated.li>
        ))}
        {!suggestedTransitions.length && <p className="empty tags__empty-message">No suggested tags</p>}
      </ul>
    </div>
  );
}
