// @flow

import React from 'react';
import CodeMirror from 'codemirror';

type Props = {
  value: string,
};

class CodeViewer extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.codeMirror = null;
    this.textarea = React.createRef();
  }

  componentDidMount() {
    this.codeMirror = CodeMirror.fromTextArea(this.textarea.current, {
      mode: 'markdown',
      readOnly: true,
      dragDrop: false,
      lineNumbers: true,
      lineWrapping: true,
    });
  }

  render() {
    const { value } = this.props;

    return (
      <div className="document-viewer__content">
        <textarea ref={this.textarea} disabled="true" value={value} />
      </div>
    );
  }
}

export default CodeViewer;
