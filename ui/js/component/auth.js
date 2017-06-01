import React from "react";
import lbry from "../lbry.js";
import lbryio from "../lbryio.js";
import Modal from "./modal.js";
import ModalPage from "./modal-page.js";
import Link from "component/link"
import {RewardLink} from 'component/reward-link';
import {FormRow} from "../component/form.js";
import {CreditAmount, Address} from "../component/common.js";
import {getLocal, setLocal} from '../utils.js';
import rewards from '../rewards'


class SubmitEmailStage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rewardType: null,
      email: '',
      submitting: false
    };
  }

  handleEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }

  onEmailSaved(email) {
    this.props.setStage("confirm", { email: email })
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      submitting: true,
    });
    lbryio.call('user_email', 'new', {email: this.state.email}, 'post').then(() => {
      this.onEmailSaved(this.state.email);
    }, (error) => {
      if (error.xhr && (error.xhr.status == 409 || error.message == __("This email is already in use"))) {
        this.onEmailSaved(this.state.email);
        return;
      } else if (this._emailRow) {
        this._emailRow.showError(error.message)
      }
      this.setState({ submitting: false });
    });
  }

  render() {
    return (
      <section>
        <form onSubmit={(event) => { this.handleSubmit(event) }}>
          <FormRow ref={(ref) => { this._emailRow = ref }} type="text" label={__("Email")} placeholder="scrwvwls@lbry.io"
                     name="email" value={this.state.email}
                     onChange={(event) => { this.handleEmailChanged(event) }} />
          <div className="form-row-submit">
            <Link button="primary" label={__("Next")} disabled={this.state.submitting} onClick={(event) => { this.handleSubmit(event) }} />
          </div>
        </form>
      </section>
    );
  }
}

class ConfirmEmailStage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rewardType: null,
      code: '',
      submitting: false,
      errorMessage: null,
    };
  }

  handleCodeChanged(event) {
    this.setState({
      code: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitting: true,
    });

    const onSubmitError = (error) => {
      if (this._codeRow) {
        this._codeRow.showError(error.message)
      }
      this.setState({ submitting: false });
    };

    lbryio.call('user_email', 'confirm', {verification_token: this.state.code, email: this.props.email}, 'post').then((userEmail) => {
      if (userEmail.is_verified) {
        this.props.setStage("welcome")
      } else {
        onSubmitError(new Error(__("Your email is still not verified."))) //shouldn't happen?
      }
    }, onSubmitError);
  }

  render() {
    return (
      <section>
        <form onSubmit={(event) => { this.handleSubmit(event) }}>
          <FormRow label={__("Verification Code")} ref={(ref) => { this._codeRow = ref }} type="text"
                     name="code" placeholder="a94bXXXXXXXXXXXXXX" value={this.state.code} onChange={(event) => { this.handleCodeChanged(event) }}
                     helper={__("A verification code is required to access this version.")}/>
          <div className="form-row-submit form-row-submit--with-footer">
            <Link button="primary" label={__("Verify")} disabled={this.state.submitting} onClick={(event) => { this.handleSubmit(event)}} />
          </div>
          <div className="form-field__helper">
            {__("No code?")} <Link onClick={() => { this.props.setStage("nocode")}} label={__("Click here")} />.
          </div>
        </form>
      </section>
    );
  }
}

class WelcomeStage extends React.Component {
  static propTypes = {
    endAuth: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      hasReward: false,
      rewardAmount: null,
    };
  }

  onRewardClaim(reward) {
    this.setState({
      hasReward: true,
      rewardAmount: reward.amount
    })
  }

  render() {
    return (
      !this.state.hasReward ?
        <Modal type="custom" isOpen={true} contentLabel={__("Welcome to LBRY")} {...this.props}>
          <section>
            <h3 className="modal__header">{__("Welcome to LBRY.")}</h3>
            <p>{__("Using LBRY is like dating a centaur. Totally normal up top, and way different underneath.")}</p>
            <p>{__("Up top, LBRY is similar to popular media sites.")}</p>
            <p>{__("Below, LBRY is controlled by users -- you -- via blockchain and decentralization.")}</p>
            <p>{__("Thank you for making content freedom possible! Here's a nickel, kid.")}</p>
            <div style={{textAlign: "center", marginBottom: "12px"}}>
              <RewardLink type="new_user" button="primary" onRewardClaim={(event) => { this.onRewardClaim(event) }} onRewardFailure={() => this.props.setStage(null)} onConfirmed={() => { this.props.setStage(null) }} />
            </div>
          </section>
         </Modal> :
         <Modal type="alert" overlayClassName="modal-overlay modal-overlay--clear" isOpen={true} contentLabel={__("Welcome to LBRY")} {...this.props} onConfirmed={() => { this.props.setStage(null) }}>
          <section>
            <h3 className="modal__header">{__("About Your Reward")}</h3>
            <p>{__("You earned a reward of ")} <CreditAmount amount={this.state.rewardAmount} label={false} /> {__("LBRY credits, or \"LBC\".")}</p>
            <p>{__("This reward will show in your Wallet momentarily, probably while you are reading this message.")}</p>
            <p>{__("LBC is used to compensate creators, to publish, and to have say in how the network works.")}</p>
            <p>{__("No need to understand it all just yet! Try watching or downloading something next.")}</p>
            <p>{__("Finally, know that LBRY is an early beta and that it earns the name.")}</p>
          </section>
      </Modal>
    );
  }
}

const ErrorStage = (props) => {
  return <section>
    <p>{__("An error was encountered that we cannot continue from.")}</p>
    <p>{__("At least we're earning the name beta.")}</p>
    { props.errorText ? <p>{__("Message:")} {props.errorText}</p> : '' }
    <Link button="alt" label={__("Try Reload")} onClick={() => { window.location.reload() } } />
  </section>
}

const PendingStage = (props) => {
  return <section>
    <p>{__("Preparing for first access")} <span className="busy-indicator"></span></p>
  </section>
}


class CodeRequiredStage extends React.Component {
  constructor(props) {
    super(props);

    this._balanceSubscribeId = null

    this.state = {
      balance: 0,
      address: getLocal('wallet_address')
    };
  }

  componentWillMount() {
    this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
      this.setState({
        balance: balance
      });
    })

    if (!this.state.address) {
      lbry.wallet_unused_address().then((address) => {
        setLocal('wallet_address', address);
        this.setState({ address: address });
      });
    }
  }

  componentWillUnmount() {
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  }

  render() {
    const disabled = this.state.balance < 1;
    return (
      <div>
        <section className="section-spaced">
          <p>{__("Access to LBRY is restricted as we build and scale the network.")}</p>
          <p>{__("There are two ways in:")}</p>
          <h3>{__("Own LBRY Credits")}</h3>
          <p>{__("If you own at least 1 LBC, you can get in right now.")}</p>
          <p style={{ textAlign: "center"}}><Link onClick={() => { setLocal('auth_bypassed', true); this.props.setStage(null); }}
                                                  disabled={disabled} label={__("Let Me In")} button={ disabled ? "alt" : "primary" } /></p>
          <p>{__("Your balance is ")}<CreditAmount amount={this.state.balance} />. {__("To increase your balance, send credits to this address:")}</p>
          <p><Address address={ this.state.address ? this.state.address : __("Generating Address...") } /></p>
          <p>{__("If you don't understand how to send credits, then...")}</p>
        </section>
        <section>
          <h3>{__("Wait For A Code")}</h3>
          <p>{__("If you provide your email, you'll automatically receive a notification when the system is open.")}</p>
          <p><Link onClick={() => { this.props.setStage("email"); }}  label={__("Return")} /></p>
        </section>
      </div>
    );
  }
}


export class AuthOverlay extends React.Component {
  constructor(props) {
    super(props);

    this._stages = {
      pending: PendingStage,
      error: ErrorStage,
      nocode: CodeRequiredStage,
      email: SubmitEmailStage,
      confirm: ConfirmEmailStage,
      welcome: WelcomeStage
    }

    this.state = {
      stage: "pending",
      stageProps: {}
    };
  }

  setStage(stage, stageProps = {}) {
    this.setState({
      stage: stage,
      stageProps: stageProps
    })
  }

  componentWillMount() {
    lbryio.authenticate().then((user) => {
      if (!user.has_verified_email) {
        if (getLocal('auth_bypassed')) {
          this.setStage(null)
        } else {
          this.setStage("email", {})
        }
      } else {
        lbryio.call('reward', 'list', {}).then((userRewards) => {
          userRewards.filter(function(reward) {
            return reward.reward_type == rewards.TYPE_NEW_USER && reward.transaction_id;
          }).length ?
             this.setStage(null) :
             this.setStage("welcome")
        });
      }
    }).catch((err) => {
      this.setStage("error", { errorText: err.message })
      document.dispatchEvent(new CustomEvent('unhandledError', {
        detail: {
          message: err.message,
          data: err.stack
        }
      }));
    })
  }

  render() {
    if (!this.state.stage) {
        return null;
    }
    const StageContent = this._stages[this.state.stage];

    if (!StageContent) {
      return <span className="empty">{__("Unknown authentication step.")}</span>
    }

    return (
      this.state.stage != "welcome" ?
          <ModalPage className="modal-page--full" isOpen={true} contentLabel={__("Authentication")}>
            <h1>{__("LBRY Early Access")}</h1>
            <StageContent {...this.state.stageProps}  setStage={(stage, stageProps) => { this.setStage(stage, stageProps) }} />
          </ModalPage> :
          <StageContent setStage={(stage, stageProps) => { this.setStage(stage, stageProps) }} {...this.state.stageProps}  />
    );
  }
}
