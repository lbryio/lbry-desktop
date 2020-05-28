import ReportDmcaPage from './view';
import { connect } from 'react-redux';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { claimId } = params;

  return {
    claimId,
  };
};

export default connect(select)(ReportDmcaPage);
