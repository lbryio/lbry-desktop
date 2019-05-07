// @flow
import React from 'react';
import Placeholder from './placeholder.png';

type Props = {
  thumbnail: ?string, // externally sourced image
};

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail } = this.props;

    return (
      <div
        style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : { backgroundImage: `url(${Placeholder})` }}
        className="media__thumb"
      />
    );
  }
}

export default CardMedia;
