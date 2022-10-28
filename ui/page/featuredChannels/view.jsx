// @flow
import React from 'react';
import Section from 'component/channelSections/Section';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';

type Props = {
  claimId: ?string,
  sectionId: ?string,
  creatorSettingsFetched: boolean,
  fetchingCreatorSettings: boolean,
  featuredChannels: ?Array<FeaturedChannelsSection>,
  doFetchCreatorSettings: (channelId: string) => Promise<any>,
};

function FeaturedChannelsPage(props: Props) {
  const {
    claimId,
    sectionId,
    creatorSettingsFetched,
    fetchingCreatorSettings,
    featuredChannels,
    doFetchCreatorSettings,
  } = props;

  const fc: ?FeaturedChannelsSection = React.useMemo(() => {
    return featuredChannels && featuredChannels.find((x) => x.id === sectionId);
  }, [featuredChannels, sectionId]);

  React.useEffect(() => {
    if (!creatorSettingsFetched && claimId) {
      doFetchCreatorSettings(claimId);
    }
  }, [claimId, creatorSettingsFetched, doFetchCreatorSettings]);

  // **************************************************************************
  // **************************************************************************

  if (!fc) {
    return (
      <Page>
        <div className="main--empty">
          <Yrbl title={__('List Not Found')} />
        </div>
      </Page>
    );
  }

  if (fetchingCreatorSettings) {
    return (
      <Page>
        <div className="main--empty">
          <Spinner />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <Section key={fc.id} id={fc.id} title={fc.value.title} uris={fc.value.uris} channelId={claimId} showAllItems />
    </Page>
  );
}

export default FeaturedChannelsPage;
