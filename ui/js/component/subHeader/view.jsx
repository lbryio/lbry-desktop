import React from "react";
import Link from "component/link";

const SubHeader = props => {
  const { subLinks, currentPage, navigate, modifier } = props;

  const links = [];

  for (let link of Object.keys(subLinks)) {
    links.push(
      <Link
        onClick={event => navigate(`/${link}`, event)}
        key={link}
        className={
          link == currentPage ? "sub-header-selected" : "sub-header-unselected"
        }
      >
        {subLinks[link]}
      </Link>
    );
  }

  return (
    <nav
      className={"sub-header" + (modifier ? " sub-header--" + modifier : "")}
    >
      {links}
    </nav>
  );
};

export default SubHeader;
