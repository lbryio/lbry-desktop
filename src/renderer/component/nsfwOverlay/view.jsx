import React from 'react';
import Button from 'component/link';

const NsfwOverlay = () => (
  <div className="card-overlay">
    <p>
      {__('This content is Not Safe For Work. To view adult content, please change your')}{' '}
      <Button fakeLink navigate="/settings" label={__('settings')} />.
    </p>
  </div>
);

export default NsfwOverlay;
