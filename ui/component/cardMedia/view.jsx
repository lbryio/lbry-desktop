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

    let url;
    // @if TARGET='web'
    // Pass image urls through a compression proxy
    url = thumbnail || Placeholder;
//     url = thumbnail
//       ? 'https://ext.thumbnails.lbry.com/400x,q55/' +
        // The image server will redirect if we don't remove the double slashes after http(s)
//         thumbnail.replace('https://', 'https:/').replace('http://', 'http:/')
//       : Placeholder;
    // @endif
    // @if TARGET='app'
    url = thumbnail || Placeholder;
    // @endif

    return <div style={{ backgroundImage: `url('${url.replace(/'/g, "\\'")}')` }} className={className} />;
  }
}

export default CardMedia;
