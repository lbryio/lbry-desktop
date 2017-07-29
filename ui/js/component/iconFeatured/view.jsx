import React from "react";
import { Icon } from "component/common.js";

const IconFeatured = props => {
  return (
    <span className="icon-featured" title={ __("Watch content with this icon to earn weekly rewards.")}>
      <Icon icon="icon-star"
            fixed
            className="card__icon-featured-content" />
    </span>
  );
};

export default IconFeatured;
