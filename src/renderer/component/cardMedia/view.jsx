// @flow
import React from 'react';

type Props = {
  thumbnail: ?string, // externally sourced image
};

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail } = this.props;
    if (thumbnail) {
      return <div className="card__media" style={{ backgroundImage: `url('${thumbnail}')` }} />;
    }

    return <div className="card__media card__media--autothumb">LBRY</div>;
  }
}

export default CardMedia;
