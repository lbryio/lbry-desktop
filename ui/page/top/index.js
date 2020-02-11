import { connect } from 'react-redux';
import TopPage from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const name = urlParams.get('name');

  return {
    name,
  };
};

export default connect(select)(TopPage);
