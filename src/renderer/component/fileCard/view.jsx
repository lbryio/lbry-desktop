import React from 'react';
import lbryuri from 'lbryuri.js';
import CardMedia from 'component/cardMedia';
import Link from 'component/link';
import { TruncatedText } from 'component/common';
import Icon from 'component/icon';
import FilePrice from 'component/filePrice';
import UriIndicator from 'component/uriIndicator';
import NsfwOverlay from 'component/nsfwOverlay';
import TruncatedMarkdown from 'component/truncatedMarkdown';
import * as icons from 'constants/icons';

class FileCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps);
  }

  resolve(props) {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  handleMouseOver() {
    this.setState({
      hovered: true,
    });
  }

  handleMouseOut() {
    this.setState({
      hovered: false,
    });
  }

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      isResolvingUri,
      navigate,
      rewardedContentClaimIds,
    } = this.props;

    const uri = lbryuri.normalize(this.props.uri);
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    let description = '';
    if (isResolvingUri && !claim) {
      description = __('Loading...');
    } else if (metadata && metadata.description) {
      description = metadata.description;
    } else if (claim === null) {
      description = __('This address contains no content.');
    }

    return (
      <section
        className={`card card--small card--link ${obscureNsfw ? 'card--obscured ' : ''}`}
        onMouseEnter={this.handleMouseOver.bind(this)}
        onMouseLeave={this.handleMouseOut.bind(this)}
      >
        <div className="card__inner">
          <Link onClick={() => navigate('/show', { uri })} className="card__link">
            <CardMedia title={title} thumbnail={thumbnail} />
            <div className="card__title-identity">
              <div className="card__title" title={title}>
                <TruncatedText lines={1}>{title}</TruncatedText>
              </div>
              <div className="card__subtitle">
                <span className="card__indicators card--file-subtitle">
                  <FilePrice uri={uri} /> {isRewardContent && <Icon icon={icons.FEATURED} />}{' '}
                  {fileInfo && <Icon icon={icons.LOCAL} />}
                </span>
                <span className="card--file-subtitle">
                  <UriIndicator uri={uri} link span smallCard />
                </span>
              </div>
            </div>
          </Link>
          {/* Test for nizuka's design: should we remove description?
            <div className="card__content card__subtext card__subtext--two-lines">
              <TruncatedMarkdown lines={2}>{description}</TruncatedMarkdown>
            </div>
            */}
        </div>
        {obscureNsfw && this.state.hovered && <NsfwOverlay />}
      </section>
    );
  }
}

export default FileCard;
