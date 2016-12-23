import React from 'react';
import lbry from '../lbry.js';
import {Link, DownloadLink, WatchLink} from '../component/link.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';

let FileTile = React.createClass({
  getInitialState: function() {
    return {
      downloading: false,
      isHovered: false,
      cost: null,
      costIncludesData: null,
    }
  },
  handleMouseOver: function() {
    this.setState({
      isHovered: true,
    });
  },
  handleMouseOut: function() {
    this.setState({
      isHovered: false,
    });
  },
  componentWillMount: function() {
    if ('cost' in this.props) {
      this.setState({
        cost: this.props.cost,
        costIncludesData: this.props.costIncludesData,
      });
    } else {
      lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      });
    }
  },
  render: function() {
    var obscureNsfw = !lbry.getClientSetting('showNsfw') && this.props.nsfw;
    return (
      <section className={ 'file-tile card ' + (obscureNsfw ? 'card-obscured ' : '') + (this.props.compact ? 'file-tile--compact' : '')} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="row-fluid card-content file-tile__row">
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail className="file-tile__thumbnail" src={this.props.imgUrl} alt={'Photo for ' + (this.props.title || this.props.name)} /></a>
          </div>
          <div className="span9">
            {this.state.cost !== null
              ? <span className="file-tile__cost">
                  <CreditAmount amount={this.state.cost} isEstimate={!this.state.costIncludesData}/>
                </span>
              : null}
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 className={'file-tile__title ' + (this.props.compact ? 'file-tile__title--compact' : '')}>
              <a href={'/?show=' + this.props.name}>
                <TruncatedText lines={3}>
                  {this.props.title}
                </TruncatedText>
              </a>
            </h3>
            <div>
              {this.props.mediaType == 'video' ? <WatchLink streamName={this.props.name} button="primary" /> : null}
              <DownloadLink streamName={this.props.name} button="text" />
            </div>
            <p className="file-tile__description">
              <TruncatedText lines={3}>
                {this.props.description}
              </TruncatedText>
            </p>
          </div>
        </div>
        {
          !obscureNsfw || !this.state.isHovered ? null :
            <div className='card-overlay'>
              <p>
                This content is Not Safe For Work.
                To view adult content, please change your <Link href="?settings" label="Settings" />.
              </p>
            </div>
        }
      </section>
    );
  }
});

export default FileTile;