// @flow
import * as React from 'react';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import MarkdownPreview from 'component/common/markdown-preview';
import { withRouter } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  uri: string,
  title: ?string,
  thumbnail: ?string,
  description: ?string,
  history: { push: string => void },
};

class PreviewLink extends React.PureComponent<Props> {
  handleClick = () => {
    const { uri, history } = this.props;
    history.push(formatLbryUriForWeb(uri));
  };

  render() {
    const { uri, title, description, thumbnail } = this.props;
    const placeholder = 'static/img/placeholder.png';

    const thumbnailStyle = {
      backgroundImage: `url(${thumbnail || placeholder})`,
    };

    return (
      <span className={'preview-link'} role="button" onClick={this.handleClick}>
        <span className={'claim-preview'}>
          <span style={thumbnailStyle} className={'preview-link__thumbnail media__thumb'} />
          <span className={'claim-preview-metadata'}>
            <span className={'claim-preview-info'}>
              <span className={'claim-preview-title'}>
                <TruncatedText text={title} lines={1} />
              </span>
            </span>
            <span className={'media__subtitle'}>
              <UriIndicator uri={uri} link />
            </span>
            <span className={'claim-preview-properties'}>
              <span className={'preview-link__description media__subtitle'}>
                <TruncatedText lines={2} showTooltip={false}>
                  <MarkdownPreview content={description} promptLinks strip />
                </TruncatedText>
              </span>
            </span>
          </span>
        </span>
      </span>
    );
  }
}

export default withRouter(PreviewLink);
