// @flow
import React from 'react';

import './style.scss';
import { FormField } from 'component/common/form';
import * as CS from 'constants/claim_search';

type Props = {
  filterCtx: any,
  contentType: string,
};

function AdditionalFilters(props: Props) {
  const { filterCtx, contentType } = props;

  if (!filterCtx?.repost) {
    return null;
  }

  return (
    <div className="additional-filters">
      <fieldset>
        <label>{__('Additional Filters')}</label>
        {filterCtx?.repost && (
          <FormField
            label={__('Hide reposts')}
            name="hide_reposts"
            type="checkbox"
            checked={filterCtx.repost.hideReposts}
            disabled={contentType === CS.CLAIM_REPOST}
            onChange={() => filterCtx.repost.setHideReposts((prev) => !prev)}
          />
        )}
      </fieldset>
    </div>
  );
}

export default AdditionalFilters;
