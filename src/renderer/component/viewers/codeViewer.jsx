// @flow

import React from 'react';
import CodeMirror from 'codemirror/lib/codemirror';
// Syntax mode
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';

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
    this.codeMirror = CodeMirror.fromTextArea(this.textarea.current, {
      mode: contentType,
      theme: theme === 'dark' ? 'dark' : 'default',
      readOnly: 'nocursor',
      dragDrop: false,
      lineNumbers: true,
      lineWrapping: true,
    });
  }

  render() {
    const { value } = this.props;
    return (
      <div className="code-viewer">
        <textarea ref={this.textarea} disabled value={value} />
      </div>
    );
  }
}

export default CodeViewer;
