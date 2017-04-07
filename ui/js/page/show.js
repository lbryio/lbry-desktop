import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import uri from '../uri.js';
import {CreditAmount, Thumbnail} from '../component/common.js';
import {FileActions} from '../component/file-actions.js';
import Link from 'component/link';

var formatItemImgStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '5px',
};

var FormatItem = React.createClass({
  propTypes: {
    metadata: React.PropTypes.object,
    contentType: React.PropTypes.string,
    cost: React.PropTypes.number,
    uri: React.PropTypes.string,
    outpoint: React.PropTypes.string,
    costIncludesData: React.PropTypes.bool,
  },
  render: function() {
    const {thumbnail, author, title, description, language, license} = this.props.metadata;
    const mediaType = lbry.getMediaType(this.props.contentType);
    var costIncludesData = this.props.costIncludesData;
    var cost = this.props.cost || 0.0;

    return (
      <div className="row-fluid">
        <div className="span4">
          <Thumbnail src={thumbnail} alt={'Photo for ' + title} style={formatItemImgStyle} />
        </div>
        <div className="span8">
          <p>{description}</p>
          <section>
            <table className="table-standard">
              <tbody>
                <tr>
                  <td>Content-Type</td><td>{this.props.contentType}</td>
                </tr>
                <tr>
                  <td>Cost</td><td><CreditAmount amount={cost} isEstimate={!costIncludesData}/></td>
                </tr>
                <tr>
                  <td>Author</td><td>{author}</td>
                </tr>
                <tr>
                  <td>Language</td><td>{language}</td>
                </tr>
                <tr>
                  <td>License</td><td>{license}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <FileActions uri={this._uri} outpoint={this.props.outpoint} metadata={this.props.metadata} contentType={this.props.contentType} />
          <section>
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </section>
        </div>
      </div>
      );
  }
});

var FormatsSection = React.createClass({
  propTypes: {
    uri: React.PropTypes.string,
    outpoint: React.PropTypes.string,
    metadata: React.PropTypes.object,
    contentType: React.PropTypes.string,
    cost: React.PropTypes.number,
    costIncludesData: React.PropTypes.bool,
  },
  render: function() {
    if(this.props.metadata == null)
    {
      return (
        <div>
          <h2>Sorry, no results found for "{name}".</h2>
        </div>);
    }

    return (
      <div>
        <div className="meta">{this.props.uri}</div>
        <h2>{this.props.metadata.title}</h2>
      {/* In future, anticipate multiple formats, just a guess at what it could look like
      // var formats = this.props.metadata.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem metadata={this.props.metadata} contentType={this.props.contentType} cost={this.props.cost} uri={this.props.uri} outpoint={this.props.outpoint} costIncludesData={this.props.costIncludesData} />
      {/*  })}</tbody>); */}
      </div>);
  }
});

var ShowPage = React.createClass({
  _uri: null,

  propTypes: {
    uri: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      metadata: null,
      contentType: null,
      cost: null,
      costIncludesData: null,
      uriLookupComplete: null,
    };
  },
  componentWillMount: function() {
    this._uri = uri.normalizeLbryUri(this.props.uri);
    document.title = this._uri;

    lbry.resolve({uri: this._uri}).then(({txid, nout, claim: {value: {stream: {metadata, source: {contentType}}}}}) => {
      this.setState({
        outpoint: txid + ':' + nout,
        metadata: metadata,
        contentType: contentType,
        uriLookupComplete: true,
      });
    });

    lbry.getCostInfo(this._uri, ({cost, includesData}) => {
      this.setState({
        cost: cost,
        costIncludesData: includesData,
      });
    });
  },
  render: function() {
    if (this.state.metadata == null) {
      return null;
    }

    return (
      <main>
        <section className="card">
          {this.state.uriLookupComplete ? (
            <FormatsSection uri={this._uri} outpoint={this.state.outpoint} metadata={this.state.metadata} cost={this.state.cost} costIncludesData={this.state.costIncludesData} contentType={this.state.contentType} />
          ) : (
            <div>
              <h2>No content</h2>
              There is no content available at <strong>{this._uri}</strong>. If you reached this page from a link within the LBRY interface, please <Link href="?report" label="report a bug" />. Thanks!
            </div>
          )}
        </section>
      </main>);
  }
});

export default ShowPage;
