import { connect } from 'react-redux';
import { doSignOut } from 'redux/actions/app';
import { doClearEmailEntry, doClearPasswordEntry } from 'lbryinc';
import UserSignOutButton from './view';

const select = state => ({});

export default connect(select, {
  doSignOut,
  doClearEmailEntry,
  doClearPasswordEntry,
})(UserSignOutButton);
