// @flow
import React from 'react';

type Props = {
  fullHeight: boolean,
  src: string,
  title: string,
};

export default function I18nMessage(props: Props) {
  const { src, title } = props;

  // const iframeRef = useRef();

  // const [iframeHeight, setIframeHeight] = useState('80vh');

  function onLoad() {
    /*

    iframe domain restrictions prevent naive design :-(

    const obj = iframeRef.current;
    if (obj) {
      setIframeHeight(obj.contentWindow.document.body.scrollHeight + 'px');
    }

    */
  }

  return (
    // style={{height: iframeHeight}}
    // ref={iframeRef}
    <iframe src={src} title={title} onLoad={onLoad} sandbox={!IS_WEB} />
  );
}
