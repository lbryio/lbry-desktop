import React, {useState} from 'react';
import { Form, FormField } from 'component/common/form';
import Tag from 'component/tag';
import { setUnion, setDifference } from 'util/set-operations';
import I18nMessage from 'component/i18nMessage';
import analytics from 'analytics';
import { CONTROL_TAGS, INTERNAL_TAGS, INTERNAL_TAG_PREFIX } from 'constants/tags';

type Props = {
  tagsPassedIn: Array<Tag>,
  unfollowedTags: Array<Tag>,
  followedTags: Array<Tag>,
  doToggleTagFollowDesktop: (arg1: string) => void,
  doAddTag: (arg1: string) => void,
  onSelect?: (arg1: Tag) => void,
  hideSuggestions?: boolean,
  hideInputField?: boolean,
  suggestMature?: boolean,
  disableAutoFocus?: boolean,
  onRemove: (arg1: Tag) => void,
  placeholder?: string,
  label?: string,
  labelAddNew?: string,
  labelSuggestions?: string,
  disabled?: boolean,
  limitSelect?: number,
  limitShow?: number,
  user: User,
  disableControlTags?: boolean
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
  const doesTagMatch = (name: unknown) => {
    const nextTag = newTag.slice(newTag.lastIndexOf(',') + 1, newTag.length).trim();
// @ts-expect-error - TS2339 - Property 'toLowerCase' does not exist on type 'unknown'.
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

  const SPECIAL_TAGS = [...INTERNAL_TAGS, 'mature'];
  let countWithoutSpecialTags = selectedTagsSet.size;

  SPECIAL_TAGS.forEach((t) => {
    if (selectedTagsSet.has(t)) {
      countWithoutSpecialTags--;
    }
  });

  const maxed = Boolean(limitSelect && countWithoutSpecialTags >= limitSelect);
  const suggestedTags = Array.from(suggestedTagsSet).filter(doesTagMatch).slice(0, limitShow);

  // tack 'mature' onto the end if it's not already in the list
  if (!newTag && suggestMature && !suggestedTags.some((tag) => tag === 'mature')) {
    suggestedTags.push('mature');
  }

  function onChange(e: unknown) {
// @ts-expect-error - TS2339 - Property 'target' does not exist on type 'unknown'.
    setNewTag(e.target.value);
  }

  function handleSubmit(e: unknown) {
// @ts-expect-error - TS2339 - Property 'preventDefault' does not exist on type 'unknown'.
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
      // @ts-expect-error - TS2741 (ts-migration)
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
      // @ts-expect-error - TS2741 (ts-migration)
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
      // @ts-expect-error - TS2741 (ts-migration)
      onSelect([{ name: tag }]);
    }
  }
  return (
    <React.Fragment>
{ /* @ts-expect-error - TS2769 - No overload matches this call. */}
      <Form className="tags__input-wrapper" onSubmit={handleSubmit}>
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
        <fieldset-section>
          <label>
            {limitSelect < TAG_FOLLOW_MAX ? (
              // @ts-expect-error - TS2745 (ts-migration)
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
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
                // @ts-expect-error - TS2345 (ts-migration)
                .filter((t) => !INTERNAL_TAGS.includes(t.name))
                .map((tag) => (
                  // @ts-expect-error - TS2741 (ts-migration)
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
// @ts-expect-error - TS2322 - Type '{ autoFocus: boolean; className: string; onChange: (e: unknown) => void; placeholder: string; type: string; value: string; disabled: boolean; label: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
                    onClick={newTag.includes('') ? (e: unknown) => handleSubmit(e) : (e: unknown) => handleTagClick(newTag)}
                  />
                )}
                {suggestedTags.map((tag) => (
                  <Tag
                    disabled={tag !== 'mature' && maxed}
                    key={`suggested${tag}`}
                    // @ts-expect-error - TS2322 (ts-migration)
                    name={tag}
                    type="add"
// @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
                    onClick={() => handleTagClick(tag)}
                  />
                ))}
              </ul>
            </section>
          )}
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
        </fieldset-section>
        {experimentalFeature &&
          !disableControlTags &&
          onSelect && ( // onSelect ensures this does not appear on TagFollow
// @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
            <fieldset-section>
              <label>{__('Control Tags')}</label>
              {CONTROL_TAGS.map((t) => (
                <FormField
                  key={t}
                  name={t}
                  type="checkbox"
                  blockWrap={false}
                  label={__(
                    t
                      .replace(INTERNAL_TAG_PREFIX, '')
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  )}
// @ts-expect-error - TS2322 - Type '{ key: "c:disable-comments" | "disable-support" | "c:preference-embed"; name: "c:disable-comments" | "disable-support" | "c:preference-embed"; type: string; blockWrap: false; label: string; checked: boolean; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                  checked={tagsPassedIn.some((te) => te.name === t)}
                  onChange={() => handleUtilityTagCheckbox(t)}
                />
              ))}
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
            </fieldset-section>
          )}
      </Form>
    </React.Fragment>
  );
}
