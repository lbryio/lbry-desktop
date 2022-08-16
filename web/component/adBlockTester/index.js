import AdBlockTester from './view';
import { connect } from 'react-redux';
import { doSetAdBlockerFound } from 'redux/actions/app';

const perform = {
  doSetAdBlockerFound,
};

export default connect(null, perform)(AdBlockTester);
