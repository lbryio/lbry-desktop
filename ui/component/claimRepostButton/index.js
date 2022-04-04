import { connect  } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import ClaimReportButton from './view';

export default connect(null, { doOpenModal, doToast })(ClaimReportButton);
