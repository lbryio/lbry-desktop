import React from "react";
import Link from "component/link";

const LinkTransaction = props => {
  const { id } = props;
  const linkProps = Object.assign({}, props);

  linkProps.href = "https://explorer.lbry.io/#!/transaction/" + id;
  linkProps.label = id.substr(0, 7);

  return <Link {...linkProps} />;
};

export default LinkTransaction;
