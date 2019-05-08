// @flow

import * as React from 'react';

type Props = {
  theme: string,
  source: {
    stream: string => any,
    fileType: string,
    contentType: string,
  },
};

class ComicBookViewer extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { source, theme } = this.props;
    return <div>template</div>;
  }
}

export default ComicBookViewer;
