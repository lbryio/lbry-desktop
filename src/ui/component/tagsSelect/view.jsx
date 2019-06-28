// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import TagsSearch from 'component/tagsSearch';
import usePersistedState from 'util/use-persisted-state';
import { useTransition, animated } from 'react-spring';

type Props = {
  showClose: boolean,
  followedTags: Array<Tag>,
  doToggleTagFollow: string => void,

  // Ovverides
  // The default component is for following tags
  title?: string,
  help?: string,
  empty?: string,
  tagsChosen?: Array<Tag>,
  onSelect?: Tag => void,
  onRemove?: Tag => void,
};

const tagsAnimation = {
  from: { opacity: 0 },
  enter: { opacity: 1, maxWidth: 400 },
  leave: { opacity: 0, maxWidth: 0 },
};

export default function TagSelect(props: Props) {
  const { showClose, followedTags, doToggleTagFollow, title, help, empty, tagsChosen, onSelect, onRemove } = props;
  const [hasClosed, setHasClosed] = usePersistedState('tag-select:has-closed', false);
  const tagsToDisplay = tagsChosen || followedTags;
  const transitions = useTransition(tagsToDisplay, tag => tag.name, tagsAnimation);

  function handleClose() {
    setHasClosed(true);
  }

  function handleTagClick(tag) {
    if (onRemove) {
      onRemove(tag);
    } else {
      doToggleTagFollow(tag.name);
    }
  }

  return (
    ((showClose && !hasClosed) || !showClose) && (
      <div className="card--section">
        {title !== false && (
          <h2 className="card__title card__title--flex-between">
            {title}
            {showClose && !hasClosed && <Button button="close" icon={ICONS.REMOVE} onClick={handleClose} />}
          </h2>
        )}

        <div className="card__content">
          <ul className="tags--remove">
            {transitions.map(({ item, props, key }) => (
              <animated.li key={key} style={props}>
                <Tag
                  name={item.name}
                  type="remove"
                  onClick={() => {
                    handleTagClick(item);
                  }}
                />
              </animated.li>
            ))}
            {!transitions.length && (
              <div className="empty">{empty || __("You aren't following any tags, try searching for one.")}</div>
            )}
          </ul>
          <TagsSearch onSelect={onSelect} />
          {help !== false && (
            <p className="help">{help || __("The tags you follow will change what's trending for you.")}</p>
          )}
        </div>
      </div>
    )
  );
}
