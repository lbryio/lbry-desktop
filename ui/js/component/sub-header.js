const SubHeader = (props) => {
  const {
    subLinks,
    currentPage,
    navigate,
  } = props

  const links = [],
        viewingUrl = '?' + this.props.viewingPage;

  for(let link of Object.keys(subLinks)) {
    links.push(
    <a href="#" onClick={() => navigate(link)} key={link} className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected' }>
    {subLinks[link]}
    </a>
    );
  }

  return (
    <nav className={"sub-header" + (this.props.modifier ? ' sub-header--' + this.props.modifier : '')}>{links}</nav>
  )
}