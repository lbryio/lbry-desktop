import { connect } from 'react-redux';
import LivestreamLayout from './view';
import { selectTheme } from 'redux/selectors/settings';
import { selectMobilePlayerDimensions } from 'redux/selectors/app';

const select = (state) => ({
  theme: selectTheme(state),
  mobilePlayerDimensions: selectMobilePlayerDimensions(state),
});

export default connect(select)(LivestreamLayout);
