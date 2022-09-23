// @flow
import React from 'react';
import type { ElementRef } from 'react';

import './style.scss';
import { FormField } from 'component/common/form';
import * as CS from 'constants/claim_search';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import debounce from 'util/debounce';
import { useIsLargeScreen } from 'effects/use-screensize';

type Props = {
  urlParams: any,
  handleChange: any,
  standalone?: boolean, // Used outside of the collapsible Advanced Filter cluster.
};

function TagSearch(props: Props) {
  const { urlParams, handleChange, standalone } = props;

  const inputRef: ElementRef<any> = React.useRef();
  const isLargeScreen = useIsLargeScreen();
  const isTagFiltered = urlParams.get(CS.TAGS_KEY);

  const [tagSearchExpanded, setTagSearchExpanded] = React.useState(isLargeScreen);
  const [tagSearchQuery, setTagSearchQuery] = React.useState(urlParams.get(CS.TAGS_KEY) || '');
  const handleChangeDebounced = React.useCallback(
    debounce((v) => handleChange({ key: CS.TAGS_KEY, value: v }), 500),
    []
  );

  return (
    <div
      className={classnames('clh-tag-search', {
        'clh-tag-search--standalone': standalone,
      })}
      title={__('Multiple tags can be added by separating them with a comma.\nExample: sports,news,tv')}
    >
      {!standalone && <label>{__('Tags')}</label>}
      <div className="clh-tag-search__input_group">
        {standalone && (
          <Button
            icon={ICONS.TAG}
            button="alt"
            className={classnames('button-toggle', {
              'button-toggle--active': tagSearchExpanded,
              'button-toggle--custom': isTagFiltered,
            })}
            aria-label={__('Search tags')}
            onClick={() => {
              setTagSearchExpanded((prev) => !prev);
              setTimeout(() => {
                if (inputRef?.current?.input?.current?.focus) {
                  inputRef.current.input.current.focus();
                }
              });
            }}
          />
        )}
        <FormField
          ref={inputRef}
          placeholder={__('Search tags')}
          type="text"
          className={classnames('clh-tag-search__input', {
            'clh-tag-search__input--standalone': standalone,
            'clh-tag-search__input--hidden': standalone && !tagSearchExpanded,
          })}
          name="tag_query"
          value={tagSearchQuery}
          onChange={(e) => {
            setTagSearchQuery(e.target.value);
            handleChangeDebounced(e.target.value);
          }}
        />
        <Button
          icon={ICONS.REMOVE}
          aria-label={__('Clear')}
          button="alt"
          className={classnames('clh-tag-search__clear', {
            'clh-tag-search__clear--hidden': (standalone && !tagSearchExpanded) || !tagSearchQuery,
          })}
          onClick={() => {
            setTagSearchQuery('');
            setTagSearchExpanded(false);
            handleChange({ key: CS.TAGS_KEY, value: '' });
          }}
        />
      </div>
    </div>
  );
}

export default TagSearch;
