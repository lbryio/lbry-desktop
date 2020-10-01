// @flow
import { SEARCH_OPTIONS } from 'constants/search';
import * as ICONS from 'constants/icons';
import React from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';

type Props = {
  setSearchOption: (string, boolean | string | number) => void,
  options: {},
  expanded: boolean,
  toggleSearchExpanded: () => void,
};

const SearchOptions = (props: Props) => {
  const { options, setSearchOption, expanded, toggleSearchExpanded } = props;
  const resultCount = options[SEARCH_OPTIONS.RESULT_COUNT];

  return (
    <div>
      <Button
        button="alt"
        label={__('Filter')}
        iconRight={expanded ? ICONS.UP : ICONS.DOWN}
        onClick={toggleSearchExpanded}
      />
      {expanded && (
        <Form className="search__options">
          {false && (
            <fieldset>
              {[
                {
                  option: SEARCH_OPTIONS.INCLUDE_FILES,
                  label: __('Files'),
                },
                {
                  option: SEARCH_OPTIONS.INCLUDE_CHANNELS,
                  label: __('Channels'),
                },
                {
                  option: SEARCH_OPTIONS.INCLUDE_FILES_AND_CHANNELS,
                  label: __('Everything'),
                },
              ].map(({ option, label }) => (
                <FormField
                  key={option}
                  name={option}
                  type="radio"
                  blockWrap={false}
                  label={label}
                  checked={options[SEARCH_OPTIONS.CLAIM_TYPE] === option}
                  onChange={() => setSearchOption(SEARCH_OPTIONS.CLAIM_TYPE, option)}
                />
              ))}
            </fieldset>
          )}

          <fieldset>
            <legend className="search__legend">{__('Type')}</legend>
            {[
              {
                option: SEARCH_OPTIONS.MEDIA_VIDEO,
                label: __('Video'),
              },
              {
                option: SEARCH_OPTIONS.MEDIA_AUDIO,
                label: __('Music'),
              },
              {
                option: SEARCH_OPTIONS.MEDIA_IMAGE,
                label: __('Image'),
              },
              {
                option: SEARCH_OPTIONS.MEDIA_TEXT,
                label: __('Text'),
              },
              {
                option: SEARCH_OPTIONS.MEDIA_APPLICATION,
                label: __('Other'),
              },
            ].map(({ option, label }) => (
              <FormField
                key={option}
                name={option}
                type="checkbox"
                blockWrap={false}
                disabled={options[SEARCH_OPTIONS.CLAIM_TYPE] === SEARCH_OPTIONS.INCLUDE_CHANNELS}
                label={label}
                checked={options[option]}
                onChange={() => setSearchOption(option, !options[option])}
              />
            ))}
          </fieldset>

          {false && (
            <fieldset>
              <legend className="search__legend">{__('Other Options')}</legend>
              <FormField
                type="select"
                name="result-count"
                value={resultCount}
                onChange={e => setSearchOption(SEARCH_OPTIONS.RESULT_COUNT, e.target.value)}
                blockWrap={false}
                label={__('Returned Results')}
              >
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </FormField>
            </fieldset>
          )}
        </Form>
      )}
    </div>
  );
};

export default SearchOptions;
