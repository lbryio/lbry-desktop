// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Ads from 'web/component/ads';
import Card from 'component/common/card';

type Options = {
  related_to: string,
  nsfw?: boolean,
};

type Props = {
  uri: string,
  claim: ?StreamClaim,
  recommendedContent: Array<string>,
  isSearching: boolean,
  search: (string, Options) => void,
  mature: boolean,
  isAuthenticated: boolean,
};

export default class RecommendedContent extends React.PureComponent<Props> {
  constructor() {
    super();

    this.didSearch = undefined;
  }

  componentDidMount() {
    this.getRecommendedContent();
  }

  componentDidUpdate(prevProps: Props) {
    const { claim, uri } = this.props;

    if (uri !== prevProps.uri) {
      this.didSearch = false;
    }

    if (claim && !this.didSearch) {
      this.getRecommendedContent();
    }
  }

  getRecommendedContent() {
    const { claim, search, mature } = this.props;

    if (claim && claim.value && claim.claim_id) {
      const options: Options = { size: 20, related_to: claim.claim_id, isBackgroundSearch: true };
      if (claim && !mature) {
        options['nsfw'] = false;
      }
      const { title } = claim.value;
      if (title && options) {
        search(title, options);
        this.didSearch = true;
      }
    }
  }

  didSearch: ?boolean;

  render() {
    const { recommendedContent, isSearching, isAuthenticated } = this.props;

    return (
      <Card
        isBodyList
        title={__('Related')}
        body={
          <ClaimList
            isCardBody
            type="small"
            loading={isSearching}
            uris={recommendedContent}
            injectedItem={!isAuthenticated && IS_WEB && <Ads type="video" small />}
            empty={__('No related content found')}
          />
        }
      />
    );
  }
}
