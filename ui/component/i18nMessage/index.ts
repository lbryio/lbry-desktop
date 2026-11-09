//@ts-nocheck
import {connect} from 'react-redux';
import i18n from './view';

const select = state: unknown => ({});

const perform = () => ({});

export default connect(
  select,
  perform
)(i18n);
