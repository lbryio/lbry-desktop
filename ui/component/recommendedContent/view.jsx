// @flow
import React from 'react';
import ClaimList from 'component/claimList';

type Options = {
  related_to: string,
  nsfw?: boolean,
};

type Props = {
  uri: string,
  claim: ?StreamClaim,
  claimId: string,
  recommendedContent: Array<string>,
  isSearching: boolean,
  search: (string, Options) => void,
  mature: boolean,
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
    const { claim, search, mature, claimId } = this.props;

    if (claim && claim.value && claim.value) {
      const options: Options = { related_to: claimId };
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
    const { recommendedContent, isSearching } = this.props;

    return (
      <ClaimList
        type="small"
        loading={isSearching}
        uris={recommendedContent}
        header={__('Related')}
        empty={__('No related content found')}
      />
    );
  }
}
