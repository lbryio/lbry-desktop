import { connect } from 'react-redux';
import {
  createShapeShift,
  shapeShiftInit,
  getCoinStats,
  clearShapeShift,
  getActiveShift,
} from 'redux/actions/shape_shift';
import { selectReceiveAddress } from 'lbry-redux';
import { selectShapeShift } from 'redux/selectors/shape_shift';
import ShapeShift from './view';

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  shapeShift: selectShapeShift(state),
});

export default connect(
  select,
  {
    shapeShiftInit,
    getCoinStats,
    createShapeShift,
    clearShapeShift,
    getActiveShift,
  }
)(ShapeShift);
