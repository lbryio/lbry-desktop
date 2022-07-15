// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  meme: ?{ text: string, url: string },
};

export default function Meme(props: Props) {
  const { meme } = props;
  if (!meme) {
    return null;
  }

  return (
    <h1 className="home__meme">
      <Button button="link" navigate={meme.url}>
        {meme.text}
      </Button>
    </h1>
  );
}
