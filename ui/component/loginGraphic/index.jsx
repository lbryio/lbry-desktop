// @flow
import React from 'react';
import { SITE_NAME, LOGIN_IMG_URL } from 'config';
import { getThumbnailCdnUrl } from 'util/thumbnail';

function LoginGraphic(props: any) {
  const [error, setError] = React.useState(false);
  const [src, setSrc] = React.useState('---');
  const containerRef = React.useRef<any>();
  const imgUrl = LOGIN_IMG_URL;

  React.useEffect(() => {
    if (containerRef.current && containerRef.current.parentElement && containerRef.current.parentElement.offsetWidth) {
      const newWidth = containerRef.current.parentElement.offsetWidth;

      let newSrc = imgUrl && imgUrl.trim().replace(/^http:\/\//i, 'https://');
      // @if TARGET='web'
      // Pass image urls through a compression proxy, except for GIFs.
      newSrc = getThumbnailCdnUrl({ thumbnail: newSrc, width: newWidth, height: newWidth * 2 });
      // @endif

      setSrc(newSrc);
    } else {
      setSrc(imgUrl);
    }
  }, []);

  if (error || !imgUrl) {
    return null;
  }

  return (
    <div className="signup-image" ref={containerRef}>
      <img alt={__('%SITE_NAME% login image', { SITE_NAME })} src={src} onError={() => setError(true)} />
    </div>
  );
}

export default LoginGraphic;
