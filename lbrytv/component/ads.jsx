import React, { useEffect } from 'react';

function Extra(props) {
  const url = '//assets.revcontent.com/master/delivery.js';

  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      // if user navigates too rapidly, <style> tags can build up
      if (document.body.getElementsByTagName('style').length) {
        document.body.getElementsByTagName('style')[0].remove();
      }
    };
  }, []);

  return (
    <>
      <p>Ads</p>
      <div
        id="rc-widget-0a74cf"
        data-rc-widget
        data-widget-host="habitat"
        data-endpoint="//trends.revcontent.com"
        data-widget-id="117427"
      />
    </>
  );
}

export default Extra;
