// @flow
// import * as ICONS from 'constants/icons';
// import React, { useEffect } from 'react';
// import { withRouter } from 'react-router';
// import Button from 'component/button';
// import Card from 'component/common/card';
// import { Lbryio } from 'lbryinc';
//
// // var stripeConnectionUrl = 'hello';
//
// // type Props = {
// //   stripeConnectionUrl: string,
// // };
//
//
// type State = {
//   stripeConnectionUrl: string,
// };
//
// type Delta = {
//   dkey: string,
//   value: string,
// };
//
// class StripeConnection extends React.PureComponent<Props, State> {
//
//   let { stripeConnectionUrl } = state;
//
//   console.log(this);
//
//   let that = this;
//
//   stripeConnectionUrl = 'https://www.hello.com';
//
//   setTimeout(function(){
//     that.setState({ stripeConnectionUrl: 'https://fred.com' });
//   }, 5000);
//
//   useEffect(() => {
//     Lbryio.call('account', 'link', {}, 'post').then(response2 => {
//
//       // props.stripeConnectionUrl = response2.url;
//       console.log(response2);
//       console.log('here!!');
//
//       stripeConnectionUrl = response2.url;
//
//       // stripeConnectionUrl(response2.url);
//
//     });
//   });
//
//   // props.stripeConnectionUrl = 'https://fred.com';
//
//   // useEffect(() => {
//   //   if (paramsString && updateTxoPageParams) {
//   //     const params = JSON.parse(paramsString);
//   //     updateTxoPageParams(params);
//   //   }
//   // }, [paramsString, updateTxoPageParams]);
//
//   return (
//     <Card
//       title={<div className="table__header-text">{__(`Connect to Stripe`)}</div>}
//       isBodyList
//       body={
//         <div>
//           <div className="card__body-actions">
//             <div>
//               <div>
//                 <h3>Connect your account to Stripe to receive tips from viewers directly to your bank account</h3>
//               </div>
//               <div className="section__actions">
//                 <a href={stripeConnectionUrl}>
//                   <Button
//                     button="secondary"
//                     label={__('Connect To Stripe')}
//                     icon={ICONS.FINANCE}
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       }
//     />
//   );
// }
//
// export default withRouter(TxoList);




// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Button from 'component/button';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';


type Props = {
  source: string,
};

type State = {
  error: boolean,
  loading: boolean,
  content: ?string,
  stripeConnectionUrl: string,
  alreadyUpdated: boolean,
  accountConfirmed: boolean
};

class DocxViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      content: null,
      loading: true,
      accountConfirmed: false,
    };
  }

  componentDidMount() {
    const { source } = this.props;

    var that = this;

    console.log(that.state);

    // call the account status endpoint
    Lbryio.call('account', 'status', {}, 'post').then(accountStatusResponse => {
      // if charges already enabled, no need to generate an account link
      if (accountStatusResponse.charges_enabled){

        // account has already been confirmed
        that.setState({
          accountConfirmed: true,
        });

        // update the frontend
        console.log(accountStatusResponse);
      } else {
        Lbryio.call('account', 'link', {}, 'post').then(accountLinkResponse => {

          // console.log(accountLinkResponse);

          that.setState({
            stripeConnectionUrl: accountLinkResponse.url,
            alreadyUpdated: true,
          });
        });
      }
    });
  }

  render() {
    const { content, error, loading, stripeConnectionUrl, accountConfirmed } = this.state;

    return (
      <Card
        title={<div className="table__header-text">{__(`Connect to Stripe`)}</div>}
        isBodyList
        body={
          <div>
            {!accountConfirmed &&
              <div className="card__body-actions">
                <div>
                  <div>
                    <h3>Connect your account to Stripe to receive tips from viewers directly to your bank account</h3>
                  </div>
                  <div className="section__actions">
                    <a href={stripeConnectionUrl}>
                      <Button
                        button="secondary"
                        label={__('Connect To Stripe')}
                        icon={ICONS.FINANCE}
                      />
                    </a>
                  </div>
                </div>
              </div>
            }
            {accountConfirmed &&
            <div className="card__body-actions">
              <div>
                <div>
                  <h3>Congratulations! Your account has been connected with Stripe.</h3>
                </div>
                <div className="section__actions">
                  <a href="/$/wallet">
                    <Button
                      button="secondary"
                      label={__('View Transactions')}
                      icon={ICONS.FINANCE}
                    />
                  </a>
                </div>
              </div>
            </div>
            }
          </div>
        }
      />
    );
  }
}

export default DocxViewer;
