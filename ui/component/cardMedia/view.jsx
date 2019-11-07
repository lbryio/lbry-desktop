// @flow
import React from 'react';
import FreezeframeWrapper from './FreezeframeWrapper';
import Placeholder from './placeholder.png';

type Props = {
  thumbnail: ?string, // externally sourced image
};

const className = 'media__thumb';

class CardMedia extends React.PureComponent<Props> {
  render() {
    const { thumbnail } = this.props;

    if (thumbnail && thumbnail.endsWith('gif')) {
      return <FreezeframeWrapper src={thumbnail} className={className} />;
    }

    const url = thumbnail || Placeholder;
    return <div style={{ backgroundImage: `url('${url.replace(/'/g,"\\'")}')` }} className={className} />;
  }
}

export default CardMedia;
