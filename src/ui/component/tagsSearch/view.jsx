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
};

export default function TagSelect(props: Props) {
  const { unfollowedTags, followedTags, doToggleTagFollow, doAddTag, onSelect } = props;
  const [newTag, setNewTag] = useState('');

  let tags = unfollowedTags.slice();
  if (newTag) {
    tags.unshift({ name: newTag });
  }

  const doesTagMatch = ({ name }) => (newTag ? name.toLowerCase().includes(newTag.toLowerCase()) : true);
  const suggestedTags = tags.filter(doesTagMatch).slice(0, 5);
  const suggestedTransitions = useTransition(suggestedTags, tag => tag.name, unfollowedTagsAnimation);

  function onChange(e) {
    setNewTag(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setNewTag('');

    if (onSelect) {
      onSelect({ name: newTag });
    } else {
      if (!unfollowedTags.includes(newTag)) {
        doAddTag(newTag);
      }

      if (!followedTags.includes(newTag)) {
        doToggleTagFollow(newTag);
      }
    }
  }

  function handleTagClick(tag) {
    if (onSelect) {
      onSelect(tag);
    } else {
      doToggleTagFollow(tag);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormField
          label={__('Tags')}
          onChange={onChange}
          placeholder={__('Search for more tags')}
          type="text"
          value={newTag}
        />
      </Form>
      <ul className="tags">
        {suggestedTransitions.map(({ item, key, props }) => (
          <animated.li key={key} style={props}>
            <Tag name={item.name} type="add" onClick={() => handleTagClick(item)} />
          </animated.li>
        ))}
        {!suggestedTransitions.length && <p className="empty tags__empty-message">No suggested tags</p>}
      </ul>
    </div>
  );
}
