import React from 'react';

export const NavMain = (props) => {
  const {
    links,
    currentPage,
    navigate,
  } = props

  return (
    <nav className="sub-header">{
      Object.keys(links).map((link) => {
        console.log(link + " vs " + currentPage);
        return <a href="#" onClick={() => navigate(link)} key={link} className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected' }>
          {links[link]}
        </a>
      })
    }</nav>
  )
}

export default NavMain