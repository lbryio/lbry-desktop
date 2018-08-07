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

type State = {
  didSearch: boolean,
};

export default class RecommendedContent extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      didSearch: false,
    };
  }

  componentDidMount() {
    this.getRecommendedContent();
  }

  componentDidUpdate(prevProps: Props) {
    const { claim, uri } = this.props;
    const { didSearch } = this.state;

    if (uri !== prevProps.uri) {
      this.setState({ didSearch: false });
    }

    if (claim && !didSearch) {
      this.getRecommendedContent();
    }
  }

  getRecommendedContent() {
    const { claim, search } = this.props;

    if (claim && claim.value && claim.value.stream && claim.value.stream.metadata) {
      const {
        value: {
          stream: {
            metadata: { title },
          },
        },
      } = claim;
      // console.log("search", title)
      search(title);
      this.setState({ didSearch: true });
    }
  }

  render() {
    const { recommendedContent } = this.props;

    return (
      <section className="card__list--recommended">
        <span>Related</span>
        {recommendedContent &&
          recommendedContent.length &&
          recommendedContent.map(recommendedUri => (
            <FileTile
              small
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
