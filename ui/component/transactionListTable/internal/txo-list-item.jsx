// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import ButtonTransaction from 'component/common/transaction-link';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import Spinner from 'component/spinner';
import { toCapitalCase } from 'util/string';
import { buildURI, parseURI, TXO_LIST as TXO, ABANDON_STATES } from 'lbry-redux';

type Props = {
  txo: Txo,
  revokeClaim: (Txo, (string) => void) => void,
  isRevokeable: boolean,
  reward: ?{
    reward_title: string,
  },
};

type State = {
  abandonState: string,
};

class TxoListItem extends React.PureComponent<Props, State> {
  constructor() {
    super();
    this.state = { abandonState: ABANDON_STATES.READY };
    (this: any).abandonClaim = this.abandonClaim.bind(this);
    (this: any).getLink = this.getLink.bind(this);
  }

  getLink(type: string, tip: boolean, valueType: string) {
    const { abandonState } = this.state;

    if (type === 'claim' && valueType !== 'repost') {
      return null;
    }

    if (this.state.abandonState === ABANDON_STATES.PENDING) {
      return <Spinner type={'small'} />;
    }

    if (tip && type === TXO.SUPPORT) {
      return (
        <Button
          disabled={abandonState === ABANDON_STATES.DONE}
          button="secondary"
          icon={ICONS.UNLOCK}
          onClick={this.abandonClaim}
          title={__('Unlock tip')}
        />
      );
    }
    const abandonTitle = type === TXO.SUPPORT ? 'Abandon Support' : 'Abandon Claim';
    return (
      <Button
        disabled={abandonState === ABANDON_STATES.DONE}
        button="secondary"
        icon={ICONS.DELETE}
        onClick={this.abandonClaim}
        title={__(abandonTitle)}
      />
    );
  }

  abandonClaim() {
    this.props.revokeClaim(this.props.txo, abandonState => this.setState({ abandonState }));
  }

  render() {
    const { reward, txo, isRevokeable } = this.props;

    const {
      amount,
      claim_id: claimId,
      normalized_name: txoListName,
      timestamp,
      txid,
      type,
      value_type: valueType,
      is_my_input: isMyInput,
      is_my_output: isMyOutput,
    } = txo;

    const name = txoListName;
    const isMinus = (type === 'support' || type === 'payment' || type === 'other') && isMyInput && !isMyOutput;
    const isTip = type === 'support' && ((isMyInput && !isMyOutput) || (!isMyInput && isMyOutput));
    const date = new Date(timestamp * 1000);

    // Ensure the claim name exists and is valid
    let uri;
    let claimName;
    try {
      if (name.startsWith('@')) {
        ({ claimName } = parseURI(name));
        uri = buildURI({ channelName: claimName, channelClaimId: claimId });
      } else {
        ({ claimName } = parseURI(name));
        uri = buildURI({ streamName: claimName, streamClaimId: claimId });
      }
    } catch (e) {}

    const dateFormat = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    const forClaim = name && claimId;

    return (
      <tr>
        <td>
          {timestamp ? (
            <div>
              <DateTime date={date} show={DateTime.SHOW_DATE} formatOptions={dateFormat} />
              <div className="table__item-label">
                <DateTime date={date} show={DateTime.SHOW_TIME} />
              </div>
            </div>
          ) : (
            <span className="empty">{__('Pending')}</span>
          )}
        </td>
        <td className="table__item--actionable">
          <span>
            {(isTip && __('Tip')) ||
              (type === 'support' && !isTip && __('Support --[noun; transaction type]--')) ||
              (valueType && ((valueType === 'stream' && __('Upload')) || __(toCapitalCase(valueType)))) ||
              (type && __(toCapitalCase(type)))}
          </span>{' '}
          {isRevokeable && this.getLink(type, isTip, valueType)}
        </td>
        <td>
          {forClaim && <Button button="link" navigate={uri} label={claimName} disabled={!date} />}
          {!forClaim && reward && <span>{reward.reward_title}</span>}
        </td>

        <td>
          <ButtonTransaction id={txid} />
        </td>
        <td className="table__item--align-right">
          <CreditAmount
            showPlus={isMinus}
            amount={isMinus ? Number(0 - amount) : Number(amount)}
            precision={8}
            showLBC={false}
          />
        </td>
      </tr>
    );
  }
}

export default TxoListItem;
