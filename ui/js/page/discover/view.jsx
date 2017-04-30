import React from 'react';
import lbryio from 'lbryio.js';
import FileTile from 'component/fileTile';
import { FileTileStream } from 'component/fileTileStream'
import {ToolTip} from 'component/tooltip.js';

const communityCategoryToolTipText = ('Community Content is a public space where anyone can share content with the ' +
  'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
'"five" to put your content here!');

const FeaturedCategory = (props) => {
  const {
    category,
    names,
  } = props

  return <div className="card-row card-row--small">
    <h3 className="card-row__header">{category}
    {category && category.match(/^community/i) && <ToolTip label="What's this?" body={communityCategoryToolTipText} className="tooltip--header" />}
    </h3>
    {names && names.map(name => <FileTile key={name} displayStyle="card" uri={name} />)}
  </div>
}

let DiscoverPage = React.createClass({
  getInitialState: function() {
    return {
      featuredUris: {},
      failed: false
    };
  },
  componentWillMount: function() {
    lbryio.call('discover', 'list', { version: "early-access" } ).then(({Categories, Uris}) => {
      let featuredUris = {}
      Categories.forEach((category) => {
        if (Uris[category] && Uris[category].length) {
          featuredUris[category] = Uris[category]
        }
      })
      this.setState({ featuredUris: featuredUris });
    }, () => {
      this.setState({
        failed: true
      })
    });
  },
  render: function() {
    return <main>{
      this.state.failed ?
        <div className="empty">Failed to load landing content.</div> :
        <div>
          {
            Object.keys(this.state.featuredUris).map((category) => {
              return this.state.featuredUris[category].length ?
                     <FeaturedCategory key={category} category={category} names={this.state.featuredUris[category]} /> :
                     '';
            })
          }
        </div>
    }</main>;
  }
})

// const DiscoverPage = (props) => {
//   const {
//     isSearching,
//     query,
//     results,
//     searchActive,
//   } = props
//
//   return (
//     <main>
//       { (!searchActive || (!isSearching && !query)) && <FeaturedContent {...props} /> }
//       { searchActive && isSearching ? <SearchActive /> : null }
//       { searchActive && !isSearching && query && results.length ? <SearchResults results={results} /> : null }
//       { searchActive && !isSearching && query && !results.length ? <SearchNoResults query={query} /> : null }
//     </main>
//   );
// }

export default DiscoverPage;