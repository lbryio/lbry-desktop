// @flow
import React from 'react';
import FileTile from 'component/fileTile';
import type { Claim } from 'types/claim';

type Props = {
  uri: string,
  claim: ?Claim,
  recommendedContent: Array<string>,
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
    const { recommendedContent } = this.props;

    return (
      <section className="card__list--recommended">
        <span>Related</span>
        {recommendedContent &&
          recommendedContent.length &&
          recommendedContent.map(recommendedUri => (
            <FileTile
              size="small"
              hideNoResult
              displayDescription={false}
              key={recommendedUri}
              uri={recommendedUri}
            />
          ))}
      </section>
    );
  }
}
