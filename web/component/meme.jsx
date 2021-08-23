import React from 'react';
import Button from 'component/button';
const memes = require('memes');

export default function Meme() {
  return (
    <h1 className="home__meme">
      <Button button="link" href={memes.url}>
        {memes.text}
      </Button>
    </h1>
  );
}
