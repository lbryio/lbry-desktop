// @flow
import React, { PureComponent } from 'react';
import CategoryList from 'component/categoryList';
import Spinner from 'component/spinner';

type Props = {
  suggested: Array<{ label: string, uri: string }>,
  loading: boolean,
};

class SuggestedSubscriptions extends PureComponent<Props> {
  render() {
    const { suggested, loading } = this.props;

    if (loading) {
      return (
        <div className="page__empty">
          <Spinner delayed />
        </div>
      );
    }

    return suggested ? (
      <div className="card__content subscriptions__suggested">
        {suggested.map(({ uri, label }) => (
          <CategoryList key={uri} category={label} categoryLink={uri} />
        ))}
      </div>
    ) : null;
  }
}

export default SuggestedSubscriptions;
