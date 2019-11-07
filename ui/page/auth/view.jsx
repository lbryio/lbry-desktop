// @flow
import React from 'react';
import UserEmail from 'component/userEmail';
import UserVerify from 'component/userVerify';
import Page from 'component/page';

type Props = {
  isPending: boolean,
  email: string,
  location: UrlLocation,
  history: { push: string => void },
  user: ?{
    has_verified_email: boolean,
    is_reward_approved: boolean,
    is_identity_verified: boolean,
  },
};

class AuthPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.navigateIfAuthenticated(this.props);
  }

  componentDidUpdate() {
    this.navigateIfAuthenticated(this.props);
  }

  navigateIfAuthenticated = (props: Props) => {
    const { isPending, user, location, history } = props;
    if (!isPending && user && user.has_verified_email && (user.is_reward_approved || user.is_identity_verified)) {
      const { search } = location;
      const urlParams = new URLSearchParams(search);
      const redirectTo = urlParams.get('redirect');
      const path = redirectTo ? `/$/${redirectTo}` : '/';
      history.push(path);
    }
  };

  render() {
    const { user, email } = this.props;
    return <Page>{user && email && user.has_verified_email ? <UserVerify /> : <UserEmail />}</Page>;
  }
}

export default AuthPage;
