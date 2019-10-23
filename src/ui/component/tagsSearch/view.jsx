// @flow
import React, { useState } from 'react';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';

type Props = {
  tagsPasssedIn: Array<Tag>,
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollow: string => void,
  doAddTag: string => void,
  onSelect?: Tag => void,
  suggestMature?: boolean,
  onRemove: Tag => void,
  placeholder?: string,
};

export default function TagsSearch(props: Props) {
  const {
    tagsPasssedIn,
    unfollowedTags = [],
    followedTags = [],
    doToggleTagFollow,
    doAddTag,
    onSelect,
    onRemove,
    suggestMature,
    placeholder,
  } = props;
  const [newTag, setNewTag] = useState('');

  let tags = unfollowedTags.slice();
  if (newTag) {
    tags.unshift({ name: newTag });
  }

  const doesTagMatch = name => {
    const nextTag = newTag.substr(newTag.lastIndexOf(',') + 1, newTag.length).trim();
    return newTag ? name.toLowerCase().includes(nextTag.toLowerCase()) : true;
  };
  // Make sure there are no duplicates, then trim
  const suggestedTagsSet = new Set(tags.map(tag => tag.name));
  const suggestedTags = Array.from(suggestedTagsSet)
    .filter(doesTagMatch)
    .slice(0, 5);

  if (!newTag && suggestMature) {
    suggestedTags.push('mature');
  }

  function onChange(e) {
    setNewTag(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let tags = newTag.trim();

    if (tags.length === 0) {
      return;
    }

    setNewTag('');

    // Split into individual tags, normalize the tags, and remove duplicates with a set.
    tags = [...new Set(tags.split(',').map(newTag => newTag.trim().toLowerCase()))];
    tags.forEach(tag => {
      if (onSelect) {
        onSelect({ name: tag });
      } else {
        if (!unfollowedTags.map(({ name }) => name).includes(tag)) {
          doAddTag(tag);
        }

        if (!followedTags.map(({ name }) => name).includes(tag)) {
          doToggleTagFollow(tag);
        }
      }
    });
  }

  function handleTagClick(tags) {
    tags = tags.split(',').map(newTag => newTag.trim());

    tags.forEach(tag => {
      if (onSelect) {
        onSelect({ name: tag });
      } else {
        doToggleTagFollow(tag);
      }
    });
  }

  return (
    <React.Fragment>
      <Form className="tags__input-wrapper" onSubmit={handleSubmit}>
        <ul className="tags--remove">
          {tagsPasssedIn.map(tag => (
            <Tag
              key={tag.name}
              name={tag.name}
              type="remove"
              onClick={() => {
                onRemove(tag);
              }}
            />
          ))}
          <li>
            <FormField
              autoFocus
              className="tag__input"
              onChange={onChange}
              placeholder={placeholder || __('Follow more tags')}
              type="text"
              value={newTag}
            />
          </li>
        </ul>
      </Form>
      <ul className="tags">
        {suggestedTags.map(tag => (
          <Tag key={tag} name={tag} type="add" onClick={() => handleTagClick(tag)} />
        ))}
        {!suggestedTags.length && <p className="empty tags__empty-message">No suggested tags</p>}
      </ul>
    </React.Fragment>
  );
}
