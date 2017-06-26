import React from "react";
import Link from "component/link";

const NsfwOverlay = props => {
  return (
    <div className="card-overlay">
      <p>
        {__(
          "This content is Not Safe For Work. To view adult content, please change your"
        )}{" "}
        {" "}{" "}
        <Link
          className="button-text"
          onClick={() => props.navigateSettings()}
          label={__("Settings")}
        />.
      </p>
    </div>
  );
};

export default NsfwOverlay;
