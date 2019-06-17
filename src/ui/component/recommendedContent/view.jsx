// @flow
import React from 'react';
import FileList from 'component/fileList';

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
        <FileList
          slim
          loading={isSearching}
          uris={recommendedContent}
          header={<span>{__('Related')}</span>}
          empty={<div className="empty">{__('No related content found')}</div>}
        />
      </section>
    );
  }
}
