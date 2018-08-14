// @flow

import React from 'react';
import CodeMirror from 'codemirror-minified/lib/codemirror';
import { openSnippetMenu, stopContextMenu } from 'util/contextMenu';

// Addons
import 'codemirror-minified/addon/selection/mark-selection';

// Syntax mode
import 'codemirror-minified/mode/go/go';
import 'codemirror-minified/mode/xml/xml';
import 'codemirror-minified/mode/php/php';
import 'codemirror-minified/mode/jsx/jsx';
import 'codemirror-minified/mode/css/css';
import 'codemirror-minified/mode/ruby/ruby';
import 'codemirror-minified/mode/clike/clike';
import 'codemirror-minified/mode/shell/shell';
import 'codemirror-minified/mode/python/python';
import 'codemirror-minified/mode/markdown/markdown';
import 'codemirror-minified/mode/javascript/javascript';

type Props = {
  theme: string,
  value: string,
  contentType: string,
};

class CodeViewer extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.codeMirror = null;
    this.textarea = React.createRef();
  }

  componentDidMount() {
    const { theme, contentType } = this.props;
    // Init CodeMirror
    this.codeMirror = CodeMirror.fromTextArea(this.textarea.current, {
      // Auto detect syntax with file contentType
      mode: contentType,
      // Adaptive theme
      theme: theme === 'dark' ? 'one-dark' : 'default',
      // Hide the cursor
      readOnly: true,
      // Styled text selection
      styleSelectedText: true,
      // Additional config opts
      dragDrop: false,
      lineNumbers: true,
      lineWrapping: true,
    });
    // Add events
    this.codeMirror.on('contextmenu', openSnippetMenu);
  }

  render() {
    const { value } = this.props;
    return (
      <div className="code-viewer" onContextMenu={stopContextMenu}>
        <textarea ref={this.textarea} disabled value={value} />
      </div>
    );
  }
}

export default CodeViewer;
