// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  src: string,
  shouldObscure: boolean,
  className?: string,
};

const Thumbnail = (props: Props) => {
  const { className, src, shouldObscure } = props;
  return (
    <img
      alt={__('Image thumbnail')}
      className={classnames(
        'card__media',
        {
          'card__media--nsfw': shouldObscure,
        },
        className
      )}
      src={src}
    />
  );
};

export default Thumbnail;
