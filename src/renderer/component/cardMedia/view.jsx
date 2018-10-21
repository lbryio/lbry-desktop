// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  thumbnail: ?string, // externally sourced image
  opaque?: boolean,
};

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail, opaque } = this.props;

    return (
      <div
        style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : {}}
        className={classnames('card__media', {
          'card__media--no-img': !thumbnail,
          'card__media--opaque': opaque,
        })}
      >
        {!thumbnail && <span className="card__media-text">LBRY</span>}
      </div>
    );
  }
}

export default CardMedia;
