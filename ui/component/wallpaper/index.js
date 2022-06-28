import { connect } from 'react-redux';
// import { makeSelectCoverForUri, makeSelectAvatarForUri } from 'redux/selectors/claims';
import Wallpaper from './view';

/*
const select = (state, props) => {
  if (props.uri && (props.uri.indexOf('@') !== -1 || props.uri.indexOf('#') !== -1)) {
    return {
      cover: makeSelectCoverForUri(props.uri)(state),
      avatar: makeSelectAvatarForUri(props.uri)(state),
    };
  } else return {};
};
*/

export default connect()(Wallpaper);
