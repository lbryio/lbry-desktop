// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import ClaimListDiscover from 'component/claimListDiscover';
import DebouncedInput from 'component/common/debounced-input';
import Empty from 'component/common/empty';
import Page from 'component/page';
import Spinner from 'component/spinner';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import { parseURI } from 'util/lbryURI';

function getFilteredUris(uris, filterQuery) {
  if (filterQuery) {
    const filterQueryLowerCase = filterQuery.toLowerCase();
    return uris.filter((uri) => uri.toLowerCase().includes(filterQueryLowerCase));
  }
  return null;
}

function parseIdFromUri(uri) {
  try {
    const { channelClaimId } = parseURI(uri);
    return channelClaimId;
  } catch {
    return '';
  }
}

// ****************************************************************************
// ChannelsFollowingManage
// ****************************************************************************

type Props = {
  subscribedChannelUris: Array<string>,
};

export default function ChannelsFollowingManage(props: Props) {
  const { subscribedChannelUris } = props;
  const [uris, setUris] = React.useState([]);
  const [filterQuery, setFilterQuery] = React.useState('');
  const filteredUris = getFilteredUris(uris, filterQuery);
  const [channelIds, setChannelIds] = React.useState(null);

  React.useEffect(() => {
    setUris(subscribedChannelUris);
    setChannelIds(subscribedChannelUris.map((uri) => parseIdFromUri(uri)));
    // eslint-disable-next-line react-hooks/exhaustive-deps, (lock list on mount so it doesn't shift when unfollow)
  }, []);

  return (
    <Page className="followManage-wrapper" noFooter>
      <div className="card__title-section">
        <div className="card__title"> {__('Followed Channels')}</div>
      </div>

      {channelIds === null ? (
        <div className="main--empty">
          <Spinner />
        </div>
      ) : uris && uris.length === 0 ? (
        <Empty padded text="No followed channels." />
      ) : (
        <>
          <DebouncedInput icon={ICONS.SEARCH} placeholder={__('Filter')} onChange={setFilterQuery} inline />
          {filteredUris && <ClaimList uris={filteredUris} />}
          {!filteredUris && channelIds.length && (
            <ClaimListDiscover
              orderBy={CS.ORDER_BY_NAME_ASC}
              claimType={CS.CLAIM_CHANNEL}
              claimIds={channelIds}
              showHeader={false}
              hideFilters
              hideAdvancedFilter
            />
          )}
        </>
      )}
    </Page>
  );
}
