// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import Button from 'component/button';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';
import UserVerify from 'component/userVerify';
import Page from 'component/page';

type Props = {
  isPending: boolean,
  email: string,
  pathAfterAuth: string,
  user: ?{
    has_verified_email: boolean,
    is_reward_approved: boolean,
    is_identity_verified: boolean,
  },
  navigate: (string, ?{}) => void,
};

class AuthPage extends React.PureComponent<Props> {
  componentWillMount() {
    this.navigateIfAuthenticated(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.navigateIfAuthenticated(nextProps);
  }

  navigateIfAuthenticated = (props: Props) => {
    const { isPending, user, pathAfterAuth, navigate } = props;
    if (
      !isPending &&
      user &&
      user.has_verified_email &&
      (user.is_reward_approved || user.is_identity_verified)
    ) {
      navigate(pathAfterAuth);
    }
  };

  renderMain() {
    const { email, isPending, user } = this.props;

    if (isPending) {
      return [<BusyIndicator message={__('Authenticating')} />, true];
    } else if (user && !user.has_verified_email && !email) {
      return [<UserEmailNew />, true];
    } else if (user && !user.has_verified_email) {
      return [<UserEmailVerify />, true];
    } else if (user && !user.is_identity_verified) {
      return [<UserVerify />, false];
    }
    return [<span className="empty">{__('No further steps.')}</span>, true];
  }

  render() {
    const { navigate } = this.props;
    const [innerContent, useTemplate] = this.renderMain();

    return (
      <Page>
        {useTemplate ? (
          <section className="card card--section">
            {innerContent}

            <p className="help">
              {`${__(
                'This information is disclosed only to LBRY, Inc. and not to the LBRY network. It is only required to earn LBRY rewards and may be used to sync usage data across devices.'
              )} `}
              <Button
                button="link"
                onClick={() => navigate('/discover')}
                label={__('Return home.')}
              />
            </p>
          </section>
        ) : (
          innerContent
        )}
      </Page>
    );
  }
}

export default AuthPage;
