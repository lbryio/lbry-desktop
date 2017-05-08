import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileActions from 'component/fileActions';
import {Thumbnail, TruncatedText,} from 'component/common.js';
import FilePrice from 'component/filePrice'
import UriIndicator from 'component/uriIndicator';

/*should be merged into FileTile once FileTile is refactored to take a single id*/
class FileTile extends React.Component {
  constructor(props) {
    super(props)
    this._fileInfoSubscribeId = null
    this._isMounted = null
    this.state = {
      showNsfwHelp: false,
      isHidden: false,
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.hideOnRemove) {
      this._fileInfoSubscribeId = lbry.fileInfoSubscribe(this.props.outpoint, this.onFileInfoUpdate);
    }
  }

  componentWillUnmount() {
    if (this._fileInfoSubscribeId) {
      lbry.fileInfoUnsubscribe(this.props.outpoint, this._fileInfoSubscribeId);
    }
  }

  onFileInfoUpdate(fileInfo) {
    if (!fileInfo && this._isMounted && this.props.hideOnRemove) {
      this.setState({
        isHidden: true
      });
    }
  }

  handleMouseOver() {
    if (this.props.obscureNsfw && this.props.metadata && this.props.metadata.nsfw) {
      this.setState({
        showNsfwHelp: true,
      });
    }
  }

  handleMouseOut() {
    if (this.state.showNsfwHelp) {
      this.setState({
        showNsfwHelp: false,
      });
    }
  }

  render() {
    if (this.state.isHidden) {
      return null;
    }

    const {
      metadata,
      isResolvingUri,
      navigate,
      hidePrice,
    } = this.props

    const uri = lbryuri.normalize(this.props.uri);
    const isConfirmed = !!metadata;
    const title = isConfirmed ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;

    let description = ""
    if (isConfirmed) {
      description = metadata.description
    } else if (isResolvingUri) {
      description = "Loading..."
    } else {
      description = <span className="empty">This file is pending confirmation</span>
    }

    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <Link onClick={() => navigate('/show', { uri })} className="card__link">
          <div className="card__inner file-tile__row">
            <div className="card__media"
                 style={{ backgroundImage: "url('" + (metadata && metadata.thumbnail ? metadata.thumbnail : lbry.imagePath('default-thumb.svg')) + "')" }}>
            </div>
            <div className="file-tile__content">
              <div className="card__title-identity">
                { !hidePrice ? <span style={{float: "right"}}><FilePrice uri={uri} /></span>  : null}
                <h5 title={title}><TruncatedText lines={1}>{title}</TruncatedText></h5>
                <div className="card__subtitle">
                  <UriIndicator uri={uri} />
                </div>
              </div>
              <div className="card__content card__subtext">
                <TruncatedText lines={3}>
                  {description}
                </TruncatedText>
              </div>
            </div>
            {this.state.showNsfwHelp && this.state.hovered
              ? <div className='card-overlay'>
               <p>
                 This content is Not Safe For Work.
                 To view adult content, please change your <Link className="button-text" onClick={() => navigate('/settings')} label="Settings" />.
               </p>
             </div>
              : null}
          </div>
        </Link>
      </section>
    );
  }
}

export default FileTile
