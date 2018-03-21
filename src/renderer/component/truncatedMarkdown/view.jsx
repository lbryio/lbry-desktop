import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ReactDOMServer from 'react-dom/server';

class TruncatedMarkdown extends React.PureComponent {
  static propTypes = {
    lines: PropTypes.number,
  };

  static defaultProps = {
    lines: null,
  };

  transformMarkdown(text) {
    // render markdown to html string then trim html tag
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown source={this.props.children} />
    );
    const txt = document.createElement('textarea');
    txt.innerHTML = htmlString;
    return txt.value.replace(/<(?:.|\n)*?>/gm, '');
  }

  render() {
    const content =
      this.props.children && typeof this.props.children === 'string'
        ? this.transformMarkdown(this.props.children)
        : this.props.children;
    return (
      <span className="truncated-text" style={{ WebkitLineClamp: this.props.lines }}>
        {content}
      </span>
    );
  }
}

export default TruncatedMarkdown;
