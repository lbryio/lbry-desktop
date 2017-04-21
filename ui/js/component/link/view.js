import React from 'react';
import {Icon} from 'component/common.js';

const Link = (props) => {
  const {
    href,
    title,
    onClick,
    style,
    label,
    icon,
    badge,
    button,
    hidden,
    disabled,
  } = props
  
  const className = (props.className || '') +
    (!props.className && !props.button ? 'button-text' : '') + // Non-button links get the same look as text buttons
    (props.button ? ' button-block button-' + props.button + ' button-set-item' : '') +
    (props.disabled ? ' disabled' : '');


  let content;
  if (props.children) {
    content = this.props.children
  } else {
    content = (
      <span {... 'button' in props ? {className: 'button__content'} : {}}>
        {'icon' in props ? <Icon icon={icon} fixed={true} /> : null}
        {<span className="link-label">{label}</span>}
        { badge ? <span className="badge">{badge}</span> : null}
      </span>
    )
  }

  return (
    <a className={className} href={href || 'javascript:;'} title={title}
      onClick={onClick}
      {... 'style' in props ? {style: style} : {}}>
      {content}
    </a>
  );
}

export default Link

// export let Link = React.createClass({
//   propTypes: {
//     label: React.PropTypes.string,
//     icon: React.PropTypes.string,
//     button: React.PropTypes.string,
//     badge: React.PropTypes.string,
//     hidden: React.PropTypes.bool,
//   },
//   getDefaultProps: function() {
//     return {
//       hidden: false,
//       disabled: false,
//     };
//   },
//   handleClick: function(e) {
//     if (this.props.onClick) {
//       this.props.onClick(e);
//     }
//   },
//   render: function() {
//     if (this.props.hidden) {
//       return null;
//     }

//     /* The way the class name is generated here is a mess -- refactor */

//     const className = (this.props.className || '') +
//       (!this.props.className && !this.props.button ? 'button-text' : '') + // Non-button links get the same look as text buttons
//       (this.props.button ? ' button-block button-' + this.props.button + ' button-set-item' : '') +
//       (this.props.disabled ? ' disabled' : '');

//     let content;
//     if (this.props.children) { // Custom content
//       content = this.props.children;
//     } else {
//       content = (
//         <span {... 'button' in this.props ? {className: 'button__content'} : {}}>
//           {'icon' in this.props ? <Icon icon={this.props.icon} fixed={true} /> : null}
//           {<span className="link-label">{this.props.label}</span>}
//           {'badge' in this.props ? <span className="badge">{this.props.badge}</span> : null}
//         </span>
//       );
//     }

//     return (
//       <a className={className} href={this.props.href || 'javascript:;'} title={this.props.title}
//          onClick={this.handleClick} {... 'style' in this.props ? {style: this.props.style} : {}}>
//         {content}
//       </a>
//     );
//   }
// });
