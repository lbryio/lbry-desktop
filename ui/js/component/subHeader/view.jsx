import React from 'react'

const SubHeader = (props) => {
  const {
    subLinks,
    currentPage,
    navigate,
    modifier,
  } = props

  const links = []

  for(let link of Object.keys(subLinks)) {
    links.push(
      <a href="#" onClick={() => navigate(link)} key={link} className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected' }>
        {subLinks[link]}
      </a>
    )
  }

  return (
    <nav className={'sub-header' + (modifier ? ' sub-header--' + modifier : '')}>
      {links}
    </nav>
  )
}

export default SubHeader
