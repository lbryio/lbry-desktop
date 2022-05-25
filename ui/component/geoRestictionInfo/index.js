import GeoRestrictionInfo from './view';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectGeoRestrictionForUri } from 'redux/selectors/claims';

const select = (state, props) => ({
  geoRestriction: selectGeoRestrictionForUri(state, props.uri),
});

const perform = {
  doOpenModal,
};

export default connect(select, perform)(GeoRestrictionInfo);
