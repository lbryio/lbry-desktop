// @flow
import React, { Component } from 'react';
import CategoryList from 'component/categoryList';
import Spinner from 'component/spinner';

type Props = {
  suggested: ?Array<{ label: string, uri: string }>,
  loading: boolean,
};

class SuggestedSubscriptions extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const { suggested } = this.props;
    return !suggested && !!nextProps.suggested;
  }

  render() {
    const { suggested, loading } = this.props;

    if (loading) {
      return (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      );
    }

    return suggested ? (
      <div className="card__content subscriptions__suggested main__item--extend-outside">
        {suggested.map(({ uri, label }) => (
          <CategoryList key={uri} category={label} categoryLink={uri} />
        ))}
      </div>
    ) : null;
  }
}

export default SuggestedSubscriptions;
