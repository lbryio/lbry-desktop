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
  alreadyUpdated: boolean
};

class DocxViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      content: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { source } = this.props;

    var that = this;

    console.log(that.state);

    Lbryio.call('account', 'link', {}, 'post').then(response2 => {
      // props.stripeConnectionUrl = response2.url;
      // console.log(response2);
      // console.log('here!!');
      //
      // console.log(that.state);

      that.setState({
        stripeConnectionUrl: response2.url,
        alreadyUpdated: true,
      });
      // stripeConnectionUrl(response2.url);

    });

  }

  render() {
    const { content, error, loading, stripeConnectionUrl } = this.state;

    return (
      <Card
        title={<div className="table__header-text">{__(`Connect to Stripe`)}</div>}
        isBodyList
        body={
          <div>
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
          </div>
        }
      />





  );
  }
}

export default DocxViewer;
