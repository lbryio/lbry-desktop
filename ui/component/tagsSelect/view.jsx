// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import TagsSearch from 'component/tagsSearch';
import usePersistedState from 'effects/use-persisted-state';
import analytics from 'analytics';
import Card from 'component/common/card';

type Props = {
  showClose?: boolean,
  followedTags: Array<Tag>,
  doToggleTagFollowDesktop?: (string) => void,
  suggestMature: boolean,
  // Overrides
  // The default component is for following tags
  title?: string | boolean,
  help?: string,
  label?: string,
  tagsChosen?: Array<Tag>,
  onSelect?: (Array<Tag>) => void,
  onRemove?: (Tag) => void,
  placeholder?: string,
  disableAutoFocus?: boolean,
  hideHeader?: boolean,
  limitShow?: number,
  limitSelect?: number,
};

/*
  Displays tagsChosen if it exists, otherwise followedTags.
 */
export default function TagsSelect(props: Props) {
  const {
    showClose,
    followedTags,
    doToggleTagFollowDesktop = null,
    title,
    help,
    tagsChosen,
    onSelect,
    onRemove,
    suggestMature,
    disableAutoFocus,
    placeholder,
    hideHeader,
    label,
    limitShow,
    limitSelect,
  } = props;
  const [hasClosed, setHasClosed] = usePersistedState('tag-select:has-closed', false);
  const tagsToDisplay = tagsChosen || followedTags;
  const tagCount = tagsToDisplay.length;
  const hasMatureTag = tagsToDisplay.map((tag) => tag.name).includes('mature');

  function handleClose() {
    setHasClosed(true);
  }

  function handleTagClick(tag) {
    if (onRemove) {
      onRemove(tag);
    } else if (doToggleTagFollowDesktop) {
      doToggleTagFollowDesktop(tag.name);

      const wasFollowing = followedTags.map((tag) => tag.name).includes(tag.name);
      const nowFollowing = !wasFollowing;
      analytics.tagFollowEvent(tag.name, nowFollowing, 'tag-select');
    }
  }

  React.useEffect(() => {
    if (tagCount === 0 && showClose) {
      setHasClosed(false);
    }
  }, [tagCount, setHasClosed, showClose]);

  return (
    ((showClose && !hasClosed) || !showClose) && (
      <Card
        className="card--tags"
        icon={ICONS.TAG}
        title={
          hideHeader ? null : (
            <React.Fragment>
              {title}
              {showClose && tagsToDisplay.length > 0 && !hasClosed && (
                <Button button="close" icon={ICONS.REMOVE} onClick={handleClose} />
              )}
            </React.Fragment>
          )
        }
        subtitle={
          help !== false && (
            <span>
              {help || __("The tags you follow will change what's trending for you.")}{' '}
              <Button button="link" label={__('Learn more')} href="https://odysee.com/@OdyseeHelp:b/OdyseeBasics:c" />.
            </span>
          )
        }
        actions={
          <React.Fragment>
            <TagsSearch
              label={label}
              onRemove={handleTagClick}
              onSelect={onSelect}
              suggestMature={suggestMature && !hasMatureTag}
              disableAutoFocus={disableAutoFocus}
              tagsPassedIn={tagsToDisplay}
              placeholder={placeholder}
              limitShow={limitShow}
              limitSelect={limitSelect}
            />
          </React.Fragment>
        }
      />
    )
  );
}
