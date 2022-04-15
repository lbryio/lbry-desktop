import React from 'react';
import Button from 'component/button';

export default function Meme() {
  const meme = window?.homepages?.en?.meme;
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
