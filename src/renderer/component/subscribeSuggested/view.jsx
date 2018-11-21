// @flow
import React, { PureComponent } from 'react';
import CategoryList from 'component/categoryList';

type Props = {
  suggested: Array<{ label: string, uri: string }>,
};

class SuggestedSubscriptions extends PureComponent<Props> {
  render() {
    const { suggested } = this.props;

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
