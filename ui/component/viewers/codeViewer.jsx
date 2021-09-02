// @flow

import * as React from 'react';
import { openSnippetMenu, stopContextMenu } from 'util/context-menu';

// Addons
import 'codemirror/addon/selection/mark-selection';

// Syntax mode
import 'codemirror/mode/go/go';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/php/php';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/python/python';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';

type Props = {
  theme: string,
  value: ?string,
  contentType: string,
};

class CodeViewer extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.codeMirror = null;
  }

  componentDidUpdate(prevProps: Props): * {
    if (prevProps.theme === this.props.theme) return;

    // This code is duplicated with componentDidMount
    const theme = this.props.theme === 'dark' ? 'monokai' : 'ttcn';
    this.codeMirror.setOption('theme', theme);
  }

  componentDidMount() {
    const me = this;
    const { theme, contentType } = me.props;

    // Init CodeMirror
    import(
      /* webpackChunkName: "codemirror" */
      'codemirror/lib/codemirror'
    ).then(CodeMirror => {
      me.codeMirror = CodeMirror.fromTextArea(me.textarea, {
        // Auto detect syntax with file contentType
        mode: contentType,
        // Adaptive theme
        theme: theme === 'dark' ? 'monokai' : 'ttcn',
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
      me.codeMirror.on('contextmenu', openSnippetMenu);
    });
  }

  textarea: ?HTMLTextAreaElement;
  codeMirror: any;

  render() {
    const { value } = this.props;
    return (
      <div className="file-render__content" onContextMenu={stopContextMenu}>
        <textarea ref={textarea => (this.textarea = textarea)} disabled value={value} />
      </div>
    );
  }
}

export default CodeViewer;
