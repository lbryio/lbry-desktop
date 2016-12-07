import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import {Link, ToolTipLink, DownloadLink, WatchLink} from '../component/link.js';
import {Thumbnail, CreditAmount, TruncatedText} from '../component/common.js';

var fetchResultsStyle = {
    color: '#888',
    textAlign: 'center',
    fontSize: '1.2em'
  };

var SearchActive = React.createClass({
  render: function() {
    return (
      <div style={fetchResultsStyle}>
        <BusyMessage message="Looking up the Dewey Decimals" />
      </div>
    );
  }
});

var searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

var SearchNoResults = React.createClass({
  render: function() {
    return (
      <section style={searchNoResultsStyle}>
        <span style={searchNoResultsMessageStyle}>No one has checked anything in for {this.props.query} yet.</span>
        <Link label="Be the first" href="?publish" />
      </section>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var rows = [];
    this.props.results.forEach(function(result) {
      console.log(result);
      var mediaType = lbry.getMediaType(result.value.content_type);
      rows.push(
        <SearchResultRow key={result.name} name={result.name} title={result.value.title} imgUrl={result.value.thumbnail}
                         description={result.value.description} cost={result.cost} nsfw={result.value.nsfw}
                         mediaType={mediaType}  />
      );
    });
    return (
      <div>{rows}</div>
    );
  }
});

var
  searchRowStyle = {
    height: (24 * 7) + 'px',
    overflowY: 'hidden'
  },
  searchRowCompactStyle = {
    height: '180px',
  },
  searchRowImgStyle = {
    maxWidth: '100%',
    maxHeight: (24 * 7) + 'px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  searchRowTitleStyle = {
    fontWeight: 'bold'
  },
  searchRowTitleCompactStyle = {
    fontSize: '1.25em',
    lineHeight: '1.15',
  },
  searchRowCostStyle = {
    float: 'right',
  },
  searchRowDescriptionStyle = {
    color : '#444',
    marginTop: '12px',
    fontSize: '0.9em'
  };


var SearchResultRow = React.createClass({
  getInitialState: function() {
    return {
      downloading: false,
      isHovered: false,
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
  render: function() {
    var obscureNsfw = !lbry.getClientSetting('showNsfw') && this.props.nsfw;
    if (!this.props.compact) {
      var style = searchRowStyle;
      var titleStyle = searchRowTitleStyle;
    } else {
      var style = Object.assign({}, searchRowStyle, searchRowCompactStyle);
      var titleStyle = Object.assign({}, searchRowTitleStyle, searchRowTitleCompactStyle);
    }

    return (
      <section className={ 'card ' + (obscureNsfw ? 'card-obscured ' : '') + (this.props.compact ? 'card-compact' : '')} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="row-fluid card-content" style={style}>
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail src={this.props.imgUrl} alt={'Photo for ' + (this.props.title || this.props.name)} style={searchRowImgStyle} /></a>
          </div>
          <div className="span9">
            <span style={searchRowCostStyle}>
              <CreditAmount amount={this.props.cost} isEstimate={!this.props.available}/>
            </span>
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 style={titleStyle}>
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
            <p style={searchRowDescriptionStyle}>
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

var featuredContentItemContainerStyle = {
  position: 'relative',
};

var FeaturedContentItem = React.createClass({
  resolveSearch: false,

  propTypes: {
    name: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      metadata: null,
      title: null,
      amount: 0.0,
      overlayShowing: false,
    };
  },

  componentWillUnmount: function() {
    this.resolveSearch = false;
  },

  componentDidMount: function() {
    this.resolveSearch = true;

    lighthouse.search(this.props.name, function(results) {
      var result = results[0];
      var metadata = result.value;
      if (this.resolveSearch)
      {
        this.setState({
          metadata: metadata,
          amount: result.cost,
          available: result.available,
          title: metadata && metadata.title ? metadata.title : ('lbry://' + this.props.name),
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.state.metadata === null) {
      // Still waiting for metadata, skip render
      return null;
    }

    return (<div style={featuredContentItemContainerStyle}>
      <SearchResultRow name={this.props.name} title={this.state.title} imgUrl={this.state.metadata.thumbnail}
                 description={this.state.metadata.description} mediaType={lbry.getMediaType(this.state.metadata.content_type)}
                 cost={this.state.amount} nsfw={this.state.metadata.nsfw} available={this.state.available} compact />
    </div>);
  }
});

var featuredContentLegendStyle = {
  fontSize: '12px',
  color: '#aaa',
  verticalAlign: '15%',
};

var FeaturedContent = React.createClass({
  render: function() {
    return (
      <div className="row-fluid">
        <div className="span6">
          <h3>Featured Content</h3>
          <FeaturedContentItem name="bellflower" />
          <FeaturedContentItem name="itsadisaster" />
          <FeaturedContentItem name="dopeman" />
          <FeaturedContentItem name="smlawncare" />
          <FeaturedContentItem name="cinemasix" />

        </div>
        <div className="span6">
          <h3>Community Content <ToolTipLink style={featuredContentLegendStyle} label="What's this?"
            tooltip='Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three," "four" and "five" to put your content here!' /></h3>
          <FeaturedContentItem name="one" />
          <FeaturedContentItem name="two" />
          <FeaturedContentItem name="three" />
          <FeaturedContentItem name="four" />
          <FeaturedContentItem name="five" />
        </div>
      </div>
    );
  }
});

var DiscoverPage = React.createClass({
  userTypingTimer: null,

  componentDidUpdate: function() {
    if (this.props.query != this.state.query)
    {
      this.handleSearchChanged();
    }
  },

  handleSearchChanged: function() {
    this.setState({
      searching: true,
      query: this.props.query,
    });

    lighthouse.search(this.props.query, this.searchCallback);
  },

  componentDidMount: function() {
    document.title = "Discover";
    if (this.props.query) {
      // Rendering with a query already typed
      this.handleSearchChanged();
    }
  },

  getInitialState: function() {
    return {
      results: [],
      query: this.props.query,
      searching: this.props.query && this.props.query.length > 0
    };
  },

  searchCallback: function(results) {
    if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: false //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  render: function() {
    return (
      <main>
        { this.state.searching ? <SearchActive /> : null }
        { !this.state.searching && this.props.query && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
        { !this.state.searching && this.props.query && !this.state.results.length ? <SearchNoResults query={this.props.query} /> : null }
        { !this.props.query && !this.state.searching ? <FeaturedContent /> : null }
      </main>
    );
  }
});

export default DiscoverPage;
