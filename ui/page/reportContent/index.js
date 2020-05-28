import { connect } from 'react-redux';
import ReportContentPage from './view';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { claimId } = params;

  return {
    claimId,
  };
};

export default connect(select)(ReportContentPage);
