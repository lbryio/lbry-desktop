import React from "react";
import { Icon } from "component/common.js";

const IconLocal = props => {
  return (
    <span className="icon-local" title={__("You already have this content.")}>
      <Icon icon="icon-folder" fixed className="card__icon-local" />
    </span>
  );
};

export default IconLocal;
