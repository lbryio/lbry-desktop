// @flow
import React from 'react';
import Native from 'native';

type Props = {
  thumbnail: ?string, // externally sourced image
};

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail } = this.props;

    return (
      <div
        style={
          thumbnail
            ? { backgroundImage: `url('${thumbnail}')` }
            : { backgroundImage: `url('${Native.imagePath('placeholder.png')}')` }
        }
        className="media__thumb"
      />
    );
  }
}

export default CardMedia;
