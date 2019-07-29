// @flow
import React from 'react';
import ClaimList from 'component/claimList';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  recommendedContent: Array<string>,
  isSearching: boolean,
  search: string => void,
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
    const { claim, search } = this.props;

    if (claim && claim.value && claim.value) {
      const { title } = claim.value;
      if (title) {
        search(title);
        this.didSearch = true;
      }
    }
  }

  didSearch: ?boolean;

  render() {
    const { recommendedContent, isSearching } = this.props;

    return (
      <section className="card">
        <ClaimList
          type="small"
          loading={isSearching}
          uris={recommendedContent}
          header={__('Related')}
          empty={__('No related content found')}
        />
      </section>
    );
  }
}
