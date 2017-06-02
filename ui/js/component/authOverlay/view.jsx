import React from "react";
import ModalPage from "component/modal-page.js";
import {BusyMessage} from 'component/common'
import Auth from 'component/auth'
import Link from "component/link"

export class AuthOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNoEmailConfirm: false,
    };
  }

  onEmailSkipClick() {
    this.setState({ showNoEmailConfirm: true })
  }

  onEmailSkipConfirm() {
    this.props.userEmailDecline()
  }

  render() {
    const {
      isPending,
      isEmailDeclined,
      user,
    } = this.props

    if (!isEmailDeclined && (isPending || (user && !user.has_email))) {
      return <ModalPage className="modal-page--full" isOpen={true} contentLabel="Authentication">
        <h1>LBRY Early Access</h1>
        { isPending ?
          <BusyMessage message="Preparing for early access" /> :
          <Auth /> }
        { isPending ? '' :
        <div className="form-row-submit">
          { this.state.showNoEmailConfirm ?
            <div>
              <p className="help form-input-width">If you continue without an email, you will be ineligible to earn free LBC rewards, as well as unable to receive security related communications.</p>
              <Link className="button-text-help" onClick={ () => { this.onEmailSkipConfirm() }} label="Continue without email" />
            </div>
            :
            <Link className="button-text-help" onClick={ () => { this.onEmailSkipClick() }} label="Do I have to?" />
          }
        </div> }
      </ModalPage>
    }

    return null
  }
}

export default AuthOverlay

// class WelcomeStage extends React.Component {
//   static propTypes = {
//     endAuth: React.PropTypes.func,
//   }
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       hasReward: false,
//       rewardAmount: null,
//     };
//   }
//
//   onRewardClaim(reward) {
//     this.setState({
//       hasReward: true,
//       rewardAmount: reward.amount
//     })
//   }
//
//   render() {
//     return (
//       !this.state.hasReward ?
//         <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY" {...this.props}>
//           <section>
//             <h3 className="modal__header">Welcome to LBRY.</h3>
//             <p>Using LBRY is like dating a centaur. Totally normal up top, and <em>way different</em> underneath.</p>
//             <p>Up top, LBRY is similar to popular media sites.</p>
//             <p>Below, LBRY is controlled by users -- you -- via blockchain and decentralization.</p>
//             <p>Thank you for making content freedom possible! Here's a nickel, kid.</p>
//             <div style={{textAlign: "center", marginBottom: "12px"}}>
//               <RewardLink type="new_user" button="primary" onRewardClaim={(event) => { this.onRewardClaim(event) }} onRewardFailure={() => this.props.setStage(null)} onConfirmed={() => { this.props.setStage(null) }} />
//             </div>
//           </section>
//          </Modal> :
//          <Modal type="alert" overlayClassName="modal-overlay modal-overlay--clear" isOpen={true} contentLabel="Welcome to LBRY" {...this.props} onConfirmed={() => { this.props.setStage(null) }}>
//           <section>
//             <h3 className="modal__header">About Your Reward</h3>
//             <p>You earned a reward of <CreditAmount amount={this.state.rewardAmount} label={false} /> LBRY credits, or <em>LBC</em>.</p>
//             <p>This reward will show in your Wallet momentarily, probably while you are reading this message.</p>
//             <p>LBC is used to compensate creators, to publish, and to have say in how the network works.</p>
//             <p>No need to understand it all just yet! Try watching or downloading something next.</p>
//             <p>Finally, know that LBRY is an early beta and that it earns the name.</p>
//           </section>
//       </Modal>
//     );
//   }
// // }
// //
// // const ErrorStage = (props) => {
// //   return <section>
// //     <p>An error was encountered that we cannot continue from.</p>
// //     <p>At least we're earning the name beta.</p>
// //     { props.errorText ? <p>Message: {props.errorText}</p> : '' }
// //     <Link button="alt" label="Try Reload" onClick={() => { window.location.reload() } } />
// //   </section>
// // }
// // //
// // // const PendingStage = (props) => {
// // //   return <section>
// // //     <BusyMessage message="Authenticating" />
// // //   </section>
// // // }
// // // //
// // // //
// // // // class CodeRequiredStage extends React.Component {
// // // //   constructor(props) {
// // // //     super(props);
// // // //
// // // //     this._balanceSubscribeId = null
// // // //
// // // //     this.state = {
// // // //       balance: 0,
// // // //       address: getLocal('wallet_address')
// // // //     };
// // // //   }
// // // //
// // // //   componentWillMount() {
// // // //     this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
// // // //       this.setState({
// // // //         balance: balance
// // // //       });
// // // //     })
// // // //
// // // //     if (!this.state.address) {
// // // //       lbry.wallet_unused_address().then((address) => {
// // // //         setLocal('wallet_address', address);
// // // //         this.setState({ address: address });
// // // //       });
// // // //     }
// // // //   }
// // // //
// // // //   componentWillUnmount() {
// // // //     if (this._balanceSubscribeId) {
// // // //       lbry.balanceUnsubscribe(this._balanceSubscribeId)
// // // //     }
// // // //   }
// // // //
// // // //   render() {
// // // //     const disabled = this.state.balance < 1;
// // // //     return (
// // // //       <div>
// // // //         <section className="section-spaced">
// // // //           <p>Early access to LBRY is restricted as we build and scale the network.</p>
// // // //           <p>There are two ways in.</p>
// // // //           <h3>Own LBRY Credits</h3>
// // // //           <p>If you own at least 1 LBC, you can get in right now.</p>
// // // //           <p style={{ textAlign: "center"}}><Link onClick={() => { setLocal('auth_bypassed', true); this.props.setStage(null); }}
// // // //                                                   disabled={disabled} label="Let Me In" button={ disabled ? "alt" : "primary" } /></p>
// // // //           <p>Your balance is <CreditAmount amount={this.state.balance} />. To increase your balance, send credits to this address:</p>
// // // //           <p><Address address={ this.state.address ? this.state.address : "Generating Address..." } /></p>
// // // //           <p>If you don't understand how to send credits, then...</p>
// // // //         </section>
// // // //         <section>
// // // //           <h3>Wait For A Code</h3>
// // // //           <p>If you provide your email, you'll automatically receive a notification when the system is open.</p>
// // // //           <p><Link onClick={() => { this.props.setStage("email"); }}  label="Return" /></p>
// // // //         </section>
// // // //       </div>
// // // //     );
// // // //   }
// // // // }
