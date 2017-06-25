import React from "react";
import FileCard from "component/fileCard";
import ToolTip from "component/tooltip.js";

const FeaturedCategory = props => {
  const { category, names } = props;

  return (
    <div className="card-row card-row--small">
      <h3 className="card-row__header">
        {category}
        {category &&
          category.match(/^community/i) &&
          <ToolTip
            label={__("What's this?")}
            body={__(
              'Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three," "four" and "five" to put your content here!'
            )}
            className="tooltip--header"
          />}
      </h3>
      {names &&
        names.map(name =>
          <FileCard
            key={name}
            displayStyle="card"
            uri={lbryuri.normalize(name)}
          />
        )}
    </div>
  );
};

export default FeaturedCategory;
