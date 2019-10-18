// @flow
import React, { useState } from 'react';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';
import { setUnion, setDifference } from 'util/set-operations';

type Props = {
  tagsPassedIn: Array<Tag>,
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollow: string => void,
  doAddTag: string => void,
  onSelect?: Tag => void,
  suggestMature?: boolean,
  onRemove: Tag => void,
  placeholder?: string,
};

/*
 We display tagsPassedIn
 onClick gets the tag when a tag is clicked
 onSubmit gets an array of tags in object form
 We suggest tags based on followed, unfollowed, and passedIn
 */

export default function TagsSearch(props: Props) {
  const {
    tagsPassedIn,
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
  const doesTagMatch = name => {
    const nextTag = newTag.substr(newTag.lastIndexOf(',') + 1, newTag.length).trim();
    return newTag ? name.toLowerCase().includes(nextTag.toLowerCase()) : true;
  };

  // Make sure there are no duplicates, then trim
  // suggestedTags = (followedTags - tagsPassedIn) + unfollowedTags

  const followedTagsSet = new Set(followedTags.map(tag => tag.name));
  const selectedTagsSet = new Set(tagsPassedIn.map(tag => tag.name));
  const unfollowedTagsSet = new Set(unfollowedTags.map(tag => tag.name));
  const remainingFollowedTagsSet = setDifference(followedTagsSet, selectedTagsSet);
  const suggestedTagsSet = setUnion(remainingFollowedTagsSet, unfollowedTagsSet);

  const suggestedTags = Array.from(suggestedTagsSet)
    .filter(doesTagMatch)
    .slice(0, 5);

  // tack 'mature' onto the end if it's not already in the list
  if (!newTag && suggestMature && !suggestedTags.some(tag => tag === 'mature')) {
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

    const newTagsArr = [...new Set(tags.split(',').map(newTag => newTag.trim().toLowerCase()))];

    // Split into individual tags, normalize the tags, and remove duplicates with a set.
    if (onSelect) {
      const arrOfObjectTags = newTagsArr.map(tag => {
        return { name: tag };
      });
      onSelect(arrOfObjectTags);
    } else {
      newTagsArr.forEach(tag => {
        if (!unfollowedTags.map(({ name }) => name).includes(tag)) {
          doAddTag(tag);
        }

        if (!followedTags.map(({ name }) => name).includes(tag)) {
          doToggleTagFollow(tag);
        }
      });
    }
  }

  function handleTagClick(tag: string) {
    if (onSelect) {
      onSelect([{ name: tag }]);
    } else {
      doToggleTagFollow(tag);
    }
  }

  return (
    <React.Fragment>
      <Form className="tags__input-wrapper" onSubmit={handleSubmit}>
        <ul className="tags--remove">
          {tagsPassedIn.map(tag => (
            <Tag
              key={`passed${tag.name}`}
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
          <Tag key={`suggested${tag}`} name={tag} type="add" onClick={() => handleTagClick(tag)} />
        ))}
        {!suggestedTags.length && <p className="empty tags__empty-message">No suggested tags</p>}
      </ul>
    </React.Fragment>
  );
}
