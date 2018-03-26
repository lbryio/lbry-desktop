// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  thumbnail: ?string, // externally sourced image
  nsfw: ?boolean,
};

const autoThumbColors = [
  'purple',
  'red',
  'pink',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'yellow',
  'orange',
];

class CardMedia extends React.PureComponent<Props> {
  getAutoThumbClass = () => {
    return autoThumbColors[Math.floor(Math.random() * autoThumbColors.length)];
  };

  render() {
    const { thumbnail, nsfw } = this.props;

    const generateAutothumb = !thumbnail && !nsfw;
    let autoThumbClass;
    if (generateAutothumb) {
      autoThumbClass = `card__media--autothumb.${this.getAutoThumbClass()}`;
    }

    return (
      <div
        style={thumbnail && !nsfw ? { backgroundImage: `url('${thumbnail}')` } : {}}
        className={classnames('card__media', autoThumbClass, {
          'card__media--no-img': !thumbnail || nsfw,
          'card__media--nsfw': nsfw,
        })}
      >
        {(!thumbnail || nsfw) && (
          <span className="card__media-text">{nsfw ? __('NSFW') : 'LBRY'}</span>
        )}
      </div>
    );
  }
}

export default CardMedia;
