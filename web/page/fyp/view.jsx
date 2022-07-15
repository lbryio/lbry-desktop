// @flow
import React from 'react';
import Page from 'component/page';
import MarkdownPreview from 'component/common/markdown-preview';

export default function PageFyp() {
  const content = `# Recommended Videos - Alpha version available to Odysee Premium users
  ## What is this?
  Our content catalog is growing fast. Each day, there are more creators using the platform. This is great news! But it also makes finding things you would like to watch harder. Odysee's recommended videos tries to make it easier.

  ## How does it work?
  Based on your video viewing history, Odysee tries to find other channels you might like. Then, we recommend videos from those channels. At least, that's how it works right now. But expect a lot of rapid change.

  ## Does Odysee manipulate the results?
  No. The current algorithm itself has a tendency to favor channels with more viewers. But this is just because we have more evidence for those ones. Otherwise, we aren't making editorial decisions or picking favorites.

  ## My results suck, wtf?
  The more videos you watch, the better it should be. But this system is brand new and it will take a bit of time to tune it. Please have patience. Or, if you want to complain or suggest something, please email: mailto:recommendations@odysee.com

  ## Why don't I have any recommendations?
  Right now, it's a Premium feature. But you also might not be using Odysee enough. It's hard to make recommendations without knowing much about you. Otherwise, if you use uBlock Origin or Brave, make sure they are disabled on Odysee, as they interfere with us learning what you like.`;

  return (
    <Page>
      <MarkdownPreview content={__(content)} simpleLinks />
    </Page>
  );
}
