// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React, { PureComponent } from 'react';
import Button from 'component/button';
import Spinner from 'component/spinner';
import HelpLink from 'component/common/help-link';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: StreamClaim,
  fileInfo: FileListItem,
  metadata: StreamMetadata,
  openFolder: (string) => void,
  contentType: string,
  user: ?any,
  pendingAmount: string,
  openModal: (id: string, { uri: string }) => void,
  claimIsMine: boolean,
};

class FileValues extends PureComponent<Props> {
  render() {
    const { uri, claim, metadata, openModal, pendingAmount, claimIsMine } = this.props;
    if (!claim || !metadata) {
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }
    const supportsAmount = claim && claim.meta && claim.meta.support_amount && Number(claim.meta.support_amount);
    const purchaseReceipt = claim && claim.purchase_receipt;

    return (
      <table className="table table--condensed table--fixed table--lbc-details">
        <tbody>
          {purchaseReceipt && (
            <tr>
              <td> {__('Purchase Amount')}</td>
              <td>
                <Button
                  button="link"
                  href={`https://explorer.lbry.com/tx/${purchaseReceipt.txid}`}
                  label={<CreditAmount amount={Number(purchaseReceipt.amount)} precision={2} />}
                />
              </td>
            </tr>
          )}
          <tr>
            <td> {__('Original Publish Amount')}</td>
            <td>{claim && claim.amount ? <CreditAmount amount={Number(claim.amount)} precision={2} /> : <p>...</p>}</td>
          </tr>
          <tr>
            <td>
              {__('Supports and Tips')}
              <HelpLink href="https://odysee.com/@OdyseeHelp:b/Monetization-of-Content:3" />
            </td>
            <td>
              {claimIsMine && !pendingAmount && Boolean(supportsAmount) && (
                <>
                  <Button
                    button="link"
                    className="expandable__button"
                    icon={ICONS.UNLOCK}
                    label={<CreditAmount amount={Number(supportsAmount)} precision={2} />}
                    aria-label={__('Unlock tips')}
                    onClick={() => {
                      openModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
                    }}
                  />{' '}
                </>
              )}
              {(!claimIsMine || (claimIsMine && !pendingAmount && supportsAmount === 0)) && (
                <CreditAmount amount={Number(supportsAmount)} precision={2} />
              )}

              {claimIsMine && pendingAmount && <Spinner type={'small'} />}
            </td>
          </tr>
          <tr>
            <td>
              <div>
                {__('Total Staked Amount')}
                <HelpLink href="https://odysee.com/@OdyseeHelp:b/trending:50" />
              </div>
            </td>
            <td>
              <CreditAmount amount={Number(claim.meta.effective_amount) || 0} precision={2} />
            </td>
          </tr>
          <tr>
            <td>
              {__('Community Choice?')}
              <HelpLink href="https://odysee.com/@OdyseeHelp:b/trending:50" />
            </td>
            <td>
              <Button
                button="link"
                label={claim.meta.is_controlling ? __('Yes') : __('No')}
                navigate={`/$/${PAGES.TOP}?name=${claim.name}`}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default FileValues;
