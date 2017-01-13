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

let FileTile = React.createClass({
  _isMounted: false,

  propTypes: {
    name: React.PropTypes.string,
    sdHash: React.PropTypes.string,
    showPrice: React.PropTypes.bool,
    obscureNsfw: React.PropTypes.bool,
    hideOnRemove: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      metadata: null,
      title: null,
      showNsfwHelp: false,
      isRemoved: false
    }
  },
  getDefaultProps: function() {
    return {
      hideOnRemove: false,
      obscureNsfw: !lbry.getClientSetting('showNsfw'),
      showPrice: true
    }
  },
  handleMouseOver: function() {
    if (this.props.obscureNsfw && this.state.metadata && this.state.metadata.nsfw) {
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
  onRemove: function() {
    this.setState({
      isRemoved: true,
    });
  },
  componentDidMount: function() {
    this._isMounted = true;

    lbry.resolveName(this.props.name, (metadata) => {
      if (this._isMounted) {
        this.setState({
          metadata: metadata,
          title: metadata && metadata.title ? metadata.title : ('lbry://' + this.props.name),
        });
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  render: function() {
    if (this.state.metadata === null || (this.props.hideOnRemove && this.state.isRemoved)) {
      return null;
    }

    const obscureNsfw = this.props.obscureNsfw && this.state.metadata.nsfw;


    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') } onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="row-fluid card-content file-tile__row">
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail className="file-tile__thumbnail" src={this.state.metadata.thumbnail} alt={'Photo for ' + (this.state.metadata.title || this.props.name)} /></a>
          </div>
          <div className="span9">
            { this.props.showPrice
              ? <FilePrice name={this.props.name} />
              : null}
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 className="file-tile__title">
              <a href={'/?show=' + this.props.name}>
                <TruncatedText lines={2}>
                  {this.state.metadata.title}
                </TruncatedText>
              </a>
            </h3>
            <FileActions streamName={this.props.name} metadata={this.state.metadata} />
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {this.state.metadata.description}
              </TruncatedText>
            </p>
          </div>
        </div>
        {this.state.showNsfwHelp
          ? <div className='card-overlay'>
              <p>
                This content is Not Safe For Work.
                To view adult content, please change your <Link href="?settings" label="Settings" />.
              </p>
            </div>
          : null}
      </section>
    );
  }
});

export default FileTile;