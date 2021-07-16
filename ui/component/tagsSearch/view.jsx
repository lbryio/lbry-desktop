// @flow
import React, { useState } from 'react';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';
import { setUnion, setDifference } from 'util/set-operations';
import I18nMessage from 'component/i18nMessage';
import analytics from 'analytics';
import { UTILITY_TAGS } from 'constants/tags';

type Props = {
  tagsPassedIn: Array<Tag>,
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollowDesktop: (string) => void,
  doAddTag: (string) => void,
  onSelect?: (Tag) => void,
  hideSuggestions?: boolean,
  hideInputField?: boolean,
  suggestMature?: boolean,
  disableAutoFocus?: boolean,
  onRemove: (Tag) => void,
  placeholder?: string,
  label?: string,
  labelAddNew?: string,
  labelSuggestions?: string,
  disabled?: boolean,
  limitSelect?: number,
  limitShow?: number,
  user: User,
  disableControlTags?: boolean,
};

const UNALLOWED_TAGS = ['lbry-first'];

/*
 We display tagsPassedIn
 onClick gets the tag when a tag is clicked
 onSubmit gets an array of tags in object form
 We suggest tags based on followed, unfollowed, and passedIn
 */

export default function TagsSearch(props: Props) {
  const TAG_FOLLOW_MAX = 1000;
  const {
    tagsPassedIn = [],
    unfollowedTags = [],
    followedTags = [],
    doToggleTagFollowDesktop,
    doAddTag,
    onSelect,
    onRemove,
    hideSuggestions,
    hideInputField,
    suggestMature,
    disableAutoFocus,
    placeholder,
    label,
    labelAddNew,
    labelSuggestions,
    disabled,
    limitSelect = TAG_FOLLOW_MAX,
    limitShow = 5,
    user,
    disableControlTags,
  } = props;
  const [newTag, setNewTag] = useState('');
  const doesTagMatch = (name) => {
    const nextTag = newTag.substr(newTag.lastIndexOf(',') + 1, newTag.length).trim();
    return newTag ? name.toLowerCase().includes(nextTag.toLowerCase()) : true;
  };

  // Make sure there are no duplicates, then trim
  // suggestedTags = (followedTags - tagsPassedIn) + unfollowedTags
  const experimentalFeature = user && user.experimental_ui;
  const followedTagsSet = new Set(followedTags.map((tag) => tag.name));
  const selectedTagsSet = new Set(tagsPassedIn.map((tag) => tag.name));
  const unfollowedTagsSet = new Set(unfollowedTags.map((tag) => tag.name));
  const remainingFollowedTagsSet = setDifference(followedTagsSet, selectedTagsSet);
  const remainingUnfollowedTagsSet = setDifference(unfollowedTagsSet, selectedTagsSet);
  const suggestedTagsSet = setUnion(remainingFollowedTagsSet, remainingUnfollowedTagsSet);

  const SPECIAL_TAGS = [...UTILITY_TAGS, 'lbry-first', 'mature'];
  let countWithoutSpecialTags = selectedTagsSet.size;

  SPECIAL_TAGS.forEach((t) => {
    if (selectedTagsSet.has(t)) {
      countWithoutSpecialTags--;
    }
  });

  // const countWithoutLbryFirst = selectedTagsSet.has('lbry-first') ? selectedTagsSet.size - 1 : selectedTagsSet.size;
  const maxed = Boolean(limitSelect && countWithoutSpecialTags >= limitSelect);
  const suggestedTags = Array.from(suggestedTagsSet).filter(doesTagMatch).slice(0, limitShow);

  // tack 'mature' onto the end if it's not already in the list
  if (!newTag && suggestMature && !suggestedTags.some((tag) => tag === 'mature')) {
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

    const newTagsArr = Array.from(
      new Set(
        tags
          .split(',')
          .slice(0, limitSelect - countWithoutSpecialTags)
          .map((newTag) => newTag.trim().toLowerCase())
          .filter((newTag) => !UNALLOWED_TAGS.includes(newTag))
      )
    );

    // Split into individual tags, normalize the tags, and remove duplicates with a set.
    if (onSelect) {
      const arrOfObjectTags = newTagsArr.map((tag) => {
        return { name: tag };
      });
      onSelect(arrOfObjectTags);
    } else {
      newTagsArr.forEach((tag) => {
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
      const wasFollowing = followedTags.map((t) => t.name).includes(tag);
      doToggleTagFollowDesktop(tag);
      analytics.tagFollowEvent(tag, !wasFollowing);
    }
  }
  function handleUtilityTagCheckbox(tag: string) {
    const selectedTag = tagsPassedIn.find((te) => te.name === tag);
    if (selectedTag) {
      onRemove(selectedTag);
    } else if (onSelect) {
      onSelect([{ name: tag }]);
    }
  }
  return (
    <React.Fragment>
      <Form className="tags__input-wrapper" onSubmit={handleSubmit}>
        <fieldset-section>
          <label>
            {limitSelect < TAG_FOLLOW_MAX ? (
              <I18nMessage
                tokens={{
                  number: limitSelect - countWithoutSpecialTags,
                  selectTagsLabel: label,
                }}
              >
                %selectTagsLabel% (%number% left)
              </I18nMessage>
            ) : (
              label || __('Following --[button label indicating a channel has been followed]--')
            )}
          </label>
          <ul className="tags--remove">
            {countWithoutSpecialTags === 0 && <Tag key={`placeholder-tag`} name={'example'} disabled type={'remove'} />}
            {Boolean(tagsPassedIn.length) &&
              tagsPassedIn
                .filter((t) => !UTILITY_TAGS.includes(t.name))
                .map((tag) => (
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
          {!hideInputField && (
            <FormField
              autoFocus={!disableAutoFocus}
              className="tag__input"
              onChange={onChange}
              placeholder={placeholder || __('gaming, crypto')}
              type="text"
              value={newTag}
              disabled={disabled}
              label={labelAddNew || __('Add Tags')}
            />
          )}
          {!hideSuggestions && (
            <section>
              <label>{labelSuggestions || (newTag.length ? __('Matching') : __('Known Tags'))}</label>
              <ul className="tags">
                {Boolean(newTag.length) && !suggestedTags.includes(newTag) && (
                  <Tag
                    disabled={newTag !== 'mature' && maxed}
                    key={`entered${newTag}`}
                    name={newTag}
                    type="add"
                    onClick={newTag.includes('') ? (e) => handleSubmit(e) : (e) => handleTagClick(newTag)}
                  />
                )}
                {suggestedTags.map((tag) => (
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
          )}
        </fieldset-section>
        {experimentalFeature &&
          !disableControlTags &&
          onSelect && ( // onSelect ensures this does not appear on TagFollow
            <fieldset-section>
              <label>{__('Control Tags')}</label>
              {UTILITY_TAGS.map((t) => (
                <FormField
                  key={t}
                  name={t}
                  type="checkbox"
                  blockWrap={false}
                  label={__(
                    t
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  )}
                  checked={tagsPassedIn.some((te) => te.name === t)}
                  onChange={() => handleUtilityTagCheckbox(t)}
                />
              ))}
            </fieldset-section>
          )}
      </Form>
    </React.Fragment>
  );
}
