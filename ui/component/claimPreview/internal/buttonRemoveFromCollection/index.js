import { connect } from 'react-redux';
import { doCollectionEdit } from 'redux/actions/collections';
import ButtonAddToQueue from './view';
import { doToast } from 'redux/actions/notifications';

const perform = {
  doToast,
  doCollectionEdit,
};

export default connect(null, perform)(ButtonAddToQueue);
