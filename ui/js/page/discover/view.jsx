import React from 'react';
import lbryio from 'lbryio.js';
import lbryuri from 'lbryuri'
import FileCard from 'component/fileCard';
import {BusyMessage} from 'component/common.js';
import ToolTip from 'component/tooltip.js';

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
    {names && names.map(name => <FileCard key={name} displayStyle="card" uri={lbryuri.normalize(name)} />)}
  </div>
}

class DiscoverPage extends React.Component{
  componentWillMount() {
    this.props.fetchFeaturedUris()
  }

  render() {
    const {
      featuredUris,
      fetchingFeaturedUris,
    } = this.props

    let content

    if (fetchingFeaturedUris) {
      content = <BusyMessage message="Fetching content" />
    } else {
      if (typeof featuredUris === "object") {
        content = Object.keys(featuredUris).map(category => {
          return featuredUris[category].length ?
                 <FeaturedCategory key={category} category={category} names={featuredUris[category]} /> :
                 '';
        })
      } else if (featuredUris !== undefined) {
        content = <div className="empty">Failed to load landing content.</div>
      }
    }

    return (
      <main>{content}</main>
    )
  }
}

export default DiscoverPage;