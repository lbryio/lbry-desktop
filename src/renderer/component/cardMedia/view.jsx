// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  thumbnail: ?string, // externally sourced image
};

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail } = this.props;

    return (
      <div
        style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : {}}
        className={classnames('card__media', {
          'card__media--no-img': !thumbnail,
        })}
      >
        {!thumbnail && <span className="card__media-text">LBRY</span>}
      </div>
    );
  }
}

export default CardMedia;
