import React from "react";
import classnames from "classnames";

export default ({ dark, className }) => {
  return (
    <div
      className={classnames(
        "spinner",
        {
          "spinner--dark": dark,
        },
        className
      )}
    />
  );
};
