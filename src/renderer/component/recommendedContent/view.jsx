// @flow
import React from 'react';
import FileTile from 'component/fileTile';
import type { Claim } from 'types/claim';
import Spinner from 'component/spinner';

type Props = {
  uri: string,
  claim: ?Claim,
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

    if (claim && claim.value && claim.value.stream && claim.value.stream.metadata) {
      const { title } = claim.value.stream.metadata;
      search(title);
      this.didSearch = true;
    }
  }

  didSearch: ?boolean;

  render() {
    const { recommendedContent, isSearching } = this.props;

    return (
      <section className="card__list--recommended">
        <span>Related</span>
        {recommendedContent &&
          recommendedContent.map(recommendedUri => (
            <FileTile
              size="small"
              hideNoResult
              displayDescription={false}
              key={recommendedUri}
              uri={recommendedUri}
            />
          ))}
        {recommendedContent &&
          !recommendedContent.length &&
          !isSearching && <div className="card__subtitle">No related content found</div>}
        {isSearching && <Spinner type="small" />}
      </section>
    );
  }
}
