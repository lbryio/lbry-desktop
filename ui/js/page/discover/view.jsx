import React from 'react';
import lbryio from 'lbryio.js';
import lbryuri from 'lbryuri'
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
    {names && names.map(name => <FileTile key={name} displayStyle="card" uri={lbryuri.normalize(name)} />)}
  </div>
}

const DiscoverPage = (props) => {
  const {
    featuredUris,
    fetchingFeaturedUris,
  } = props
  const failed = Object.keys(featuredUris).length === 0

  let content

  if (fetchingFeaturedUris) content = <div className="empty">Fetching landing content.</div>
  if (!fetchingFeaturedUris && failed) content = <div className="empty">Failed to load landing content.</div>
  if (!fetchingFeaturedUris && !failed) {
    content = Object.keys(featuredUris).map(category => {
      return featuredUris[category].length ?
         <FeaturedCategory key={category} category={category} names={featuredUris[category]} /> :
         '';
    })
  }

  return (
    <main>{content}</main>
  )
}

export default DiscoverPage;