// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Tag from 'component/tag';
import TagsSearch from 'component/tagsSearch';
import usePersistedState from 'util/use-persisted-state';
import { useTransition, animated } from 'react-spring';

type Props = {
  followedTags: Array<Tag>,
  showClose: boolean,
  title: string,
  doDeleteTag: string => void,
};

const tagsAnimation = {
  from: { opacity: 0 },
  enter: { opacity: 1, maxWidth: 400 },
  leave: { opacity: 0, maxWidth: 0 },
};

export default function TagSelect(props: Props) {
  const { title, followedTags, showClose, doDeleteTag } = props;
  const [hasClosed, setHasClosed] = usePersistedState('tag-select:has-closed', false);

  function handleClose() {
    setHasClosed(true);
  }

  const transitions = useTransition(followedTags.map(tag => tag), tag => tag.name, tagsAnimation);

  return (
    ((showClose && !hasClosed) || !showClose) && (
      <div className="card--section">
        <h2 className="card__title card__title--flex-between">
          {title}
          {showClose && !hasClosed && <Button button="close" icon={ICONS.CLOSE} onClick={handleClose} />}
        </h2>

        <div className="card__content">
          <ul className="tags--remove">
            {transitions.map(({ item, props, key }) => (
              <animated.li key={key} style={props}>
                <Tag
                  name={item.name}
                  type="remove"
                  onClick={() => {
                    doDeleteTag(item.name);
                  }}
                />
              </animated.li>
            ))}
            {!transitions.length && (
              <div className="card__subtitle">{__("You aren't following any tags, try searching for one.")}</div>
            )}
          </ul>
          <TagsSearch />
        </div>
      </div>
    )
  );
}
