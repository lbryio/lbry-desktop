// @flow
import React, { Fragment, PureComponent } from 'react';
import ExpandingContainer from 'component/expandingContainer/view';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import Spinner from 'component/spinner';
import * as PAGES from '../../constants/pages';
import HelpLink from '../common/help-link';

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
    return (
      <Fragment>
        <ExpandingContainer title={__('LBC Details')}>
          <table className="table table--condensed table--fixed table--file-details">
            <tbody>
              <tr>
                <td> {__('Publish Amount')}</td>
                <td>{claim.amount} LBC</td>
                <td />
              </tr>
              <tr>
                <td>
                  {' '}
                  {__('Supports and Tips')}
                  <HelpLink href="https://lbry.com/faq/tipping" />
                </td>
                <td>{Number(claim.meta.effective_amount) - Number(claim.amount)} LBC</td>
                <td>
                  {claimIsMine && !pendingAmount && (
                    <Button
                      button="link"
                      className="expandable__button"
                      label={'Unlock'}
                      icon={ICONS.UNLOCK}
                      onClick={() => {
                        openModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
                      }}
                    />
                  )}
                  {claimIsMine && pendingAmount && <Spinner type={'small'} />}
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    {' '}
                    {__('Effective Amount')}
                    <HelpLink href="https://lbry.com/faq/tipping" />
                  </div>
                </td>
                <td>{claim.meta.effective_amount} LBC</td>
                <td />
              </tr>
              <tr>
                <td>
                  {claim.meta.is_controlling ? __('Top for name') : __('Not top for name')}
                  <HelpLink href="https://lbry.com/faq/tipping" />
                </td>
                <td colSpan="2">
                  <Button
                    button="link"
                    label={__('%name%', {
                      name: claim.name,
                    })}
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
