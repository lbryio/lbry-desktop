import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import {FileActions} from '../component/file-actions.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';

let FilePrice = React.createClass({
  _isMounted: false,

  propTypes: {
    name: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      cost: null,
      costIncludesData: null,
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
      if (this._isMounted) {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      }
    }, () => {
      // If we get an error looking up cost information, do nothing
    });
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  render: function() {
    if (this.state.cost === null)
    {
      return null;
    }

    return (
      <span className="file-tile__cost">
        <CreditAmount amount={this.state.cost} isEstimate={!this.state.costIncludesData}/>
      </span>
    );
  }
});

/*should be merged into FileTile once FileTile is refactored to take a single id*/
export let FileTileStream = React.createClass({
  _fileInfoSubscribeId: null,
  _isMounted: null,

  propTypes: {
    metadata: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    outpoint: React.PropTypes.string,
    hideOnRemove: React.PropTypes.bool,
    hidePrice: React.PropTypes.bool,
    obscureNsfw: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      showNsfwHelp: false,
      isHidden: false,
      available: null,
    }
  },
  getDefaultProps: function() {
    return {
      obscureNsfw: !lbry.getClientSetting('showNsfw'),
      hidePrice: false
    }
  },
  componentDidMount: function() {
    this._isMounted = true;
    if (this.props.hideOnRemove) {
      this._fileInfoSubscribeId = lbry.fileInfoSubscribe(this.props.outpoint, this.onFileInfoUpdate);
    }
  },
  componentWillUnmount: function() {
    if (this._fileInfoSubscribeId) {
      lbry.fileInfoUnsubscribe(this.props.outpoint, this._fileInfoSubscribeId);
    }
  },
  onFileInfoUpdate: function(fileInfo) {
    if (!fileInfo && this._isMounted && this.props.hideOnRemove) {
      this.setState({
        isHidden: true
      });
    }
  },
  handleMouseOver: function() {
    if (this.props.obscureNsfw && this.props.metadata && this.props.metadata.nsfw) {
      this.setState({
        showNsfwHelp: true,
      });
    }
  },
  handleMouseOut: function() {
    if (this.state.showNsfwHelp) {
      this.setState({
        showNsfwHelp: false,
      });
    }
  },
  render: function() {
    if (this.state.isHidden) {
      return null;
    }

    const metadata = this.props.metadata;
    const isConfirmed = typeof metadata == 'object';
    const title = isConfirmed ? metadata.title : ('lbry://' + this.props.name);
    const obscureNsfw = this.props.obscureNsfw && isConfirmed && metadata.nsfw;
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className={"row-fluid card-content file-tile__row"}>
          <div className="span3">
            <a href={'?show=' + this.props.name}><Thumbnail className="file-tile__thumbnail" src={metadata.thumbnail} alt={'Photo for ' + (title || this.props.name)} /></a>
          </div>
          <div className="span9">
            { !this.props.hidePrice
              ? <FilePrice name={this.props.name} />
              : null}
            <div className="meta"><a href={'?show=' + this.props.name}>{'lbry://' + this.props.name}</a></div>
            <h3 className="file-tile__title">
              <a href={'?show=' + this.props.name}>
                <TruncatedText lines={1}>
                  {title}
                </TruncatedText>
              </a>
            </h3>
            <FileActions streamName={this.props.name} outpoint={this.props.outpoint} metadata={metadata} />
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {isConfirmed
                   ? metadata.description
                   : <span className="empty">This file is pending confirmation.</span>}
              </TruncatedText>
            </p>
          </div>
        </div>
        {this.state.showNsfwHelp
          ? <div className='card-overlay'>
           <p>
             This content is Not Safe For Work.
             To view adult content, please change your <Link className="button-text" href="?settings" label="Settings" />.
           </p>
         </div>
          : null}
      </section>
    );
  }
});

export let FileTile = React.createClass({
  _isMounted: false,

  propTypes: {
    name: React.PropTypes.string.isRequired,
    available: React.PropTypes.bool,
  },

  getInitialState: function() {
    return {
      outpoint: null,
      metadata: null
    }
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.claim_show({name: this.props.name}).then(({value, txid, nout}) => {
      if (this._isMounted && value) {
        // In case of a failed lookup, metadata will be null, in which case the component will never display
        this.setState({
          outpoint: txid + ':' + nout,
          metadata: value,
        });
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (!this.state.metadata || !this.state.outpoint) {
      return null;
    }

    return <FileTileStream outpoint={this.state.outpoint} metadata={this.state.metadata} {... this.props} />;
  }
});
