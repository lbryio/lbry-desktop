import React from 'react';
import { connect } from 'react-redux';
import MarkdownPreview from './view';

const select = () => ({});
const perform = () => ({});

export default connect(select, perform)(MarkdownPreview);
