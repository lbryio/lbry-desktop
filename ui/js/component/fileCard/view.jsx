import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import {Thumbnail, TruncatedText,} from 'component/common';
import FilePrice from 'component/filePrice'
import UriIndicator from 'component/uriIndicator';

class FileCard extends React.Component {
  componentDidMount() {
    this.resolve(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps)
  }

  resolve(props) {
    const {
      isResolvingUri,
      resolveUri,
      claim,
      uri,
    } = props

    if(!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri)
    }
  }

  componentWillUnmount() {
    this.props.cancelResolveUri(this.props.uri)
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
      metadata,
      isResolvingUri,
      navigate,
    } = this.props

    const uri = lbryuri.normalize(this.props.uri);
    const title = !isResolvingUri && metadata && metadata.title ? metadata.title : uri;
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;

    let description = ""
    if (isResolvingUri) {
      description = "Loading..."
    } else if (metadata && metadata.description) {
      description = metadata.description
    }

    return (
      <section className={ 'card card--small card--link ' + (obscureNsfw ? 'card--obscured ' : '') } onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <div className="card__inner">
          <Link onClick={() => navigate('/show', { uri })} className="card__link">
            <div className="card__title-identity">
              <h5 title={title}><TruncatedText lines={1}>{title}</TruncatedText></h5>
              <div className="card__subtitle">
                <span style={{float: "right"}}><FilePrice uri={uri} /></span>
                <UriIndicator uri={uri} />
              </div>
            </div>
            {metadata && metadata.thumbnail &&
            <div className="card__media" style={{ backgroundImage: "url('" + metadata.thumbnail + "')" }}></div>
            }
            <div className="card__content card__subtext card__subtext--two-lines">
                <TruncatedText lines={2}>{description}</TruncatedText>
            </div>
          </Link>
          {obscureNsfw && this.state.hovered
            ? <div className='card-overlay'>
             <p>
               This content is Not Safe For Work.
               To view adult content, please change your <Link className="button-text" onClick={() => navigate('settings')} label="Settings" />.
             </p>
           </div>
            : null}
        </div>
      </section>
    );
  }
}

export default FileCard
