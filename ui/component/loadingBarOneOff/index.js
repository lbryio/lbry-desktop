import { connect } from 'react-redux';
import LoadingBarOneOff from './view';

const select = (state, props) => ({});

export default connect(select)(LoadingBarOneOff);
