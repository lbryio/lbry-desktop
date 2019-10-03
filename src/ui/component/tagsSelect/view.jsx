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
  doToggleTagFollow?: string => void,
  suggestMature: boolean,
  // Ovverides
  // The default component is for following tags
  title?: string | boolean,
  help?: string,
  tagsChosen?: Array<Tag>,
  onSelect?: Tag => void,
  onRemove?: Tag => void,
  placeholder?: string,
};

export default function TagSelect(props: Props) {
  const {
    showClose,
    followedTags,
    doToggleTagFollow = null,
    title,
    help,
    tagsChosen,
    onSelect,
    onRemove,
    suggestMature,
    placeholder,
  } = props;
  const [hasClosed, setHasClosed] = usePersistedState('tag-select:has-closed', false);
  const tagsToDisplay = tagsChosen || followedTags;
  const tagCount = tagsToDisplay.length;
  const hasMatureTag = tagsToDisplay.map(tag => tag.name).includes('mature');

  function handleClose() {
    setHasClosed(true);
  }

  function handleTagClick(tag) {
    if (onRemove) {
      onRemove(tag);
    } else if (doToggleTagFollow) {
      doToggleTagFollow(tag.name);

      const wasFollowing = followedTags.map(tag => tag.name).includes(tag.name);
      const nowFollowing = !wasFollowing;
      analytics.tagFollowEvent(tag.name, nowFollowing, 'tag-select');
    }
  }

  React.useEffect(() => {
    if (tagCount === 0) {
      setHasClosed(false);
    }
  }, [tagCount, setHasClosed]);

  return (
    ((showClose && !hasClosed) || !showClose) && (
      <Card
        icon={ICONS.TAG}
        title={
          <React.Fragment>
            {title}
            {showClose && tagsToDisplay.length > 0 && !hasClosed && (
              <Button button="close" icon={ICONS.REMOVE} onClick={handleClose} />
            )}
          </React.Fragment>
        }
        subtitle={
          help !== false && (
            <span>
              {help || __("The tags you follow will change what's trending for you.")}{' '}
              <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/trending" />.
            </span>
          )
        }
        actions={
          <React.Fragment>
            <TagsSearch
              onRemove={handleTagClick}
              onSelect={onSelect}
              suggestMature={suggestMature && !hasMatureTag}
              tagsPasssedIn={tagsToDisplay}
              placeholder={placeholder}
            />
          </React.Fragment>
        }
      />
    )
  );
}
