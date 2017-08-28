import React from "react";
import { Icon } from "component/common.js";

const IconDownloaded = props => {
  return (
    <span
      className="icon-downloaded"
      title={__("You've already downloaded this content.")}
    >
      <Icon icon="icon-folder" fixed className="card__icon-downloaded" />
    </span>
  );
};

export default IconDownloaded;
