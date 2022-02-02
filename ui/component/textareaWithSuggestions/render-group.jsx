// @flow
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';

type Props = {
  groupName: string,
  suggestionTerm?: ?string,
  searchQuery?: string,
  children: any,
};

const TextareaSuggestionsGroup = (props: Props) => {
  const { groupName, suggestionTerm, searchQuery, children } = props;

  return (
    <div key={groupName} className="textarea-suggestions__group">
      <label className="textarea-suggestions__group-label">
        {groupName === 'Top' ? (
          <LbcSymbol prefix={__('Winning Search for %matching_term%', { matching_term: searchQuery })} />
        ) : suggestionTerm && suggestionTerm.length > 1 ? (
          __('%group_name% matching %matching_term%', { group_name: groupName, matching_term: suggestionTerm })
        ) : (
          groupName
        )}
      </label>

      {children}
      <hr className="textarea-suggestions__separator" />
    </div>
  );
};

export default TextareaSuggestionsGroup;
