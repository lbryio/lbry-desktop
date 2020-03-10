// @flow
import React, { useState } from 'react';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';
import { setUnion, setDifference } from 'util/set-operations';
import I18nMessage from 'component/i18nMessage';

type Props = {
  tagsPassedIn: Array<Tag>,
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollowDesktop: string => void,
  doAddTag: string => void,
  onSelect?: Tag => void,
  suggestMature?: boolean,
  disableAutoFocus?: boolean,
  onRemove: Tag => void,
  placeholder?: string,
  label?: string,
  disabled?: boolean,
  limit?: number,
};

/*
 We display tagsPassedIn
 onClick gets the tag when a tag is clicked
 onSubmit gets an array of tags in object form
 We suggest tags based on followed, unfollowed, and passedIn
 */

export default function TagsSearch(props: Props) {
  const {
    tagsPassedIn = [],
    unfollowedTags = [],
    followedTags = [],
    doToggleTagFollowDesktop,
    doAddTag,
    onSelect,
    onRemove,
    suggestMature,
    disableAutoFocus,
    placeholder,
    label,
    disabled,
    limit,
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

  const countWithoutMature = selectedTagsSet.has('mature') ? selectedTagsSet.size - 1 : selectedTagsSet.size;
  const maxed = Boolean(limit && countWithoutMature >= limit);
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

    const newTagsArr = Array.from(new Set(tags.split(',').map(newTag => newTag.trim().toLowerCase())));

    // Split into individual tags, normalize the tags, and remove duplicates with a set.
    if (onSelect) {
      const arrOfObjectTags = newTagsArr.map(tag => {
        return { name: tag };
      });
      onSelect(arrOfObjectTags);
    } else {
      newTagsArr.forEach(tag => {
        if (!unfollowedTags.some(({ name }) => name === tag)) {
          doAddTag(tag);
        }

        if (!followedTags.some(({ name }) => name === tag)) {
          doToggleTagFollowDesktop(tag);
        }
      });
    }
  }

  function handleTagClick(tag: string) {
    if (onSelect) {
      onSelect([{ name: tag }]);
    } else {
      doToggleTagFollowDesktop(tag);
    }
  }
  return (
    <React.Fragment>
      <Form className="tags__input-wrapper" onSubmit={handleSubmit}>
        <label>
          {limit ? (
            <I18nMessage
              tokens={{
                number: 5 - countWithoutMature,
                selectTagsLabel: label,
              }}
            >
              %selectTagsLabel% (%number% left)
            </I18nMessage>
          ) : (
            label || __('Following')
          )}
        </label>
        <ul className="tags--remove">
          {!tagsPassedIn.length && <Tag key={`placeholder-tag`} name={'example'} disabled type={'remove'} />}
          {Boolean(tagsPassedIn.length) &&
            tagsPassedIn.map(tag => (
              <Tag
                key={`passed${tag.name}`}
                name={tag.name}
                type="remove"
                onClick={() => {
                  onRemove(tag);
                }}
              />
            ))}
        </ul>
        <FormField
          autoFocus={!disableAutoFocus}
          className="tag__input"
          onChange={onChange}
          placeholder={placeholder || __('gaming, crypto')}
          type="text"
          value={newTag}
          disabled={disabled}
          label={'Add Tags'}
        />
        <section>
          <label>{newTag.length ? __('Matching') : __('Known Tags')}</label>
          <ul className="tags">
            {Boolean(newTag.length) && !suggestedTags.includes(newTag) && (
              <Tag
                disabled={newTag !== 'mature' && maxed}
                key={`entered${newTag}`}
                name={newTag}
                type="add"
                onClick={newTag.includes('') ? e => handleSubmit(e) : e => handleTagClick(newTag)}
              />
            )}
            {suggestedTags.map(tag => (
              <Tag
                disabled={tag !== 'mature' && maxed}
                key={`suggested${tag}`}
                name={tag}
                type="add"
                onClick={() => handleTagClick(tag)}
              />
            ))}
          </ul>
        </section>
      </Form>
    </React.Fragment>
  );
}
