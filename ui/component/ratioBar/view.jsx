// @flow
import React from 'react';

type Props = {
  likeCount: number,
  dislikeCount: number,
};

const RatioBar = (props: Props) => {
  const { likeCount, dislikeCount } = props;

  const like = (1 / (likeCount + dislikeCount)) * likeCount;
  if (like || dislikeCount) {
    return (
      <div className={'ratio-bar'}>
        <div className={'ratio-bar-like'} style={{ flex: like }} />
        <div className={'ratio-bar-dislike'} style={{ flex: 1 - like }} />
      </div>
    );
  } else {
    return <div className={'ratio-bar'} />;
  }
};

export default RatioBar;
