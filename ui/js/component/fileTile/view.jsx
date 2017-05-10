import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileActions from 'component/fileActions';
import {Thumbnail, TruncatedText,} from 'component/common.js';
import FilePrice from 'component/filePrice'
import UriIndicator from 'component/uriIndicator';

class FileTile extends React.Component {
  static SHOW_EMPTY_PUBLISH = "publish"
  static SHOW_EMPTY_PENDING = "pending"

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
      claim,
      metadata,
      isResolvingUri,
      showEmpty,
      navigate,
      hidePrice,
    } = this.props

    const uri = lbryuri.normalize(this.props.uri);
    const isClaimed = !!claim;
    const title = isClaimed && metadata && metadata.title ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    let onClick = () => navigate('/show', { uri })

    let description = ""
    if (isClaimed) {
      description = metadata.description
    } else if (isResolvingUri) {
      description = "Loading..."
    } else if (showEmpty === FileTile.SHOW_EMPTY_PUBLISH) {
      onClick = () => navigate('/publish')
      description = <span className="empty">This location is unclaimed - <Link label="put something here" />!</span>
    } else if (showEmpty === FileTile.SHOW_EMPTY_PENDING) {
      description = <span className="empty">This file is pending confirmation.</span>
    }

    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <Link onClick={onClick} className="card__link" className="card__link">
          <div className={"card__inner file-tile__row"}>
            <div className="card__media"
                 style={{ backgroundImage: "url('" + (metadata && metadata.thumbnail ? metadata.thumbnail : lbry.imagePath('default-thumb.svg')) + "')" }}>
            </div>
            <div className="file-tile__content">
              <div className="card__title-primary">
                { !hidePrice ? <FilePrice uri={this.props.uri} />  : null}
                <div className="meta">{uri}</div>
                <h3><TruncatedText lines={1}>{title}</TruncatedText></h3>
              </div>
              <div className="card__content card__subtext">
                <TruncatedText lines={3}>
                  {description}
                </TruncatedText>
              </div>
            </div>
          </div>
        </Link>
        {this.state.showNsfwHelp
          ? <div className='card-overlay'>
           <p>
             This content is Not Safe For Work.
             To view adult content, please change your <Link className="button-text" onClick={() => navigate('/settings')} label="Settings" />.
           </p>
         </div>
          : null}
      </section>
    );
  }
}

export default FileTile
