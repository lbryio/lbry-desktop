import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import {CreditAmount, Thumbnail} from '../component/common.js';
import {FileActions} from '../component/file-actions.js';
import {Link} from '../component/link.js';

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
    claimInfo: React.PropTypes.object,
    cost: React.PropTypes.number,
    name: React.PropTypes.string,
    costIncludesData: React.PropTypes.bool,
  },
  render: function() {

    var claimInfo = this.props.claimInfo;
    var thumbnail = claimInfo.thumbnail;
    var title = claimInfo.title;
    var description = claimInfo.description;
    var author = claimInfo.author;
    var language = claimInfo.language;
    var license = claimInfo.license;
    var fileContentType = (claimInfo.content_type || claimInfo['content-type']);
    var mediaType = lbry.getMediaType(fileContentType);
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
                  <td>Content-Type</td><td>{fileContentType}</td>
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
          <FileActions />
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
    claimInfo: React.PropTypes.object,
    cost: React.PropTypes.number,
    name: React.PropTypes.string,
    costIncludesData: React.PropTypes.bool,
  },
  render: function() {
    var name = this.props.name;
    var format = this.props.claimInfo;
    var title = format.title;

    if(format == null)
    {
      return (
        <div>
          <h2>Sorry, no results found for "{name}".</h2>
        </div>);
    }

    return (
      <div>
        <div className="meta">lbry://{name}</div>
        <h2>{title}</h2>
      {/* In future, anticipate multiple formats, just a guess at what it could look like
      // var formats = this.props.claimInfo.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem claimInfo={format} cost={this.props.cost} name={this.props.name} costIncludesData={this.props.costIncludesData} />
      {/*  })}</tbody>); */}
      </div>);
  }
});

var DetailPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      metadata: null,
      cost: null,
      costIncludesData: null,
      nameLookupComplete: null,
    };
  },
  componentWillMount: function() {
    document.title = 'lbry://' + this.props.name;

    lbry.resolveName(this.props.name, (metadata) => {
      this.setState({
        metadata: metadata,
        nameLookupComplete: true,
      });
    });

    lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
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

    const name = this.props.name;
    const costIncludesData = this.state.costIncludesData;
    const metadata = this.state.metadata;
    const cost = this.state.cost;

    return (
      <main>
        <section className="card">
          {this.state.nameLookupComplete ? (
            <FormatsSection name={name} claimInfo={metadata} cost={cost} costIncludesData={costIncludesData} />
          ) : (
            <div>
              <h2>No content</h2>
              There is no content available at the name <strong>lbry://{this.props.name}</strong>. If you reached this page from a link within the LBRY interface, please <Link href="/?report" label="report a bug" />. Thanks!
            </div>
          )}
        </section>
      </main>);
  }
});

export default DetailPage;
