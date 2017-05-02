import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileActions from 'component/fileActions';
import {Thumbnail, TruncatedText,} from 'component/common.js';
import FilePrice from 'component/filePrice'
import UriIndicator from 'component/uriIndicator';

/*should be merged into FileTile once FileTile is refactored to take a single id*/
class FileTileStream extends React.Component {
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
        <div className={"row-fluid card__inner file-tile__row"}>
          <div className="span3 file-tile__thumbnail-container">
            <a href="#" onClick={() => navigate(`show=${uri}`)}>
              {metadata && metadata.thumbnail ?
              <Thumbnail key={this.props.uri} className="file-tile__thumbnail" src={metadata.thumbnail} alt={'Photo for ' + this.props.uri} />
              :
              <Thumbnail className="file-tile__thumbnail" alt={'Photo for ' + this.props.uri} />
              }
              </a>
          </div>
          <div className="span9">
            <div className="card__title-primary">
              { !this.props.hidePrice
                ? <FilePrice uri={this.props.uri} />
                : null}
              <div className="meta"><a href="#" onClick={() => navigate(`show=${uri}`)}>{uri}</a></div>
              <h3>
                <a href="#" onClick={() => navigate(`show=${uri}`)} title={title}>
                  <TruncatedText lines={1}>
                    {title}
                  </TruncatedText>
                </a>
              </h3>
            </div>
            <div className="card__actions">
            </div>
            <div className="card__content">
              <p className="file-tile__description">
                <TruncatedText lines={2}>{description}</TruncatedText>
              </p>
            </div>
          </div>
        </div>
        {this.state.showNsfwHelp
          ? <div className='card-overlay'>
           <p>
             This content is Not Safe For Work.
             To view adult content, please change your <Link className="button-text" href="#" onClick={() => navigate('settings')} label="Settings" />.
           </p>
         </div>
          : null}
      </section>
    );
  }
}

export default FileTileStream
