// @flow
import React, { Fragment, PureComponent } from 'react';
import ExpandingContainer from 'component/expandingContainer/view';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import Spinner from 'component/spinner';
import * as PAGES from 'constants/pages';
import HelpLink from 'component/common/help-link';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: StreamClaim,
  fileInfo: FileListItem,
  metadata: StreamMetadata,
  openFolder: string => void,
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
    const supportsAmount =
      claim &&
      claim.meta &&
      claim.amount &&
      claim.meta.effective_amount &&
      Number(claim.meta.effective_amount) - Number(claim.amount);
    return (
      <Fragment>
        <ExpandingContainer title={__('LBC Details')}>
          <table className="table table--condensed table--fixed table--lbc-details">
            <tbody>
              <tr>
                <td> {__('Original Publish Amount')}</td>
                <td>
                  {claim && claim.amount ? (
                    <CreditAmount badge={false} amount={Number(claim.amount)} precision={2} />
                  ) : (
                    <p>...</p>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  {__('Supports and Tips')}
                  <HelpLink href="https://lbry.com/faq/tipping" />
                </td>
                <td>
                  {claimIsMine && !pendingAmount && Boolean(supportsAmount) && (
                    <>
                      <Button
                        button="link"
                        className="expandable__button"
                        icon={ICONS.UNLOCK}
                        label={<CreditAmount badge={false} amount={Number(supportsAmount)} precision={2} />}
                        onClick={() => {
                          openModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
                        }}
                      />{' '}
                    </>
                  )}
                  {claimIsMine && !pendingAmount && supportsAmount === 0 && (
                    <CreditAmount badge={false} amount={Number(supportsAmount)} precision={2} />
                  )}

                  {claimIsMine && pendingAmount && <Spinner type={'small'} />}
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    {__('Total Staked Amount')}
                    <HelpLink href="https://lbry.com/faq/tipping" />
                  </div>
                </td>
                <td>
                  <CreditAmount badge={false} amount={Number(claim.meta.effective_amount)} precision={2} />
                </td>
              </tr>
              <tr>
                <td>
                  {__('Community Choice?')}
                  <HelpLink href="https://lbry.com/faq/naming" />
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
        </ExpandingContainer>
      </Fragment>
    );
  }
}

export default FileValues;
