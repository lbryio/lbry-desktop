//@ts-nocheck
import {connect} from 'react-redux';
import { selectRemoteVersion } from 'redux/selectors/app';
import LastReleaseChanges from './view';

const select = (state: unknown) => ({
  releaseVersion: selectRemoteVersion(state),
});

const perform: Record<string, any> = {};

export default connect(select, perform)(LastReleaseChanges);
