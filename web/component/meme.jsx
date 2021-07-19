import React from 'react';
import Button from 'component/button';

export default function Meme() {
  return (
    <h1 className="home__meme">
      <Button button="link" href="https://odysee.com/@Odysee:8?view=discussion">
        {'big gulps, huh?'}
      </Button>
    </h1>
  );
}
