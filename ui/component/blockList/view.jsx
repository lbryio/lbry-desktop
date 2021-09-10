// @flow
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Paginate from 'component/common/paginate';
import Yrbl from 'component/yrbl';

const PAGE_SIZE = 10;

type Props = {
  uris: Array<string>,
  help: string,
  titleEmptyList: string,
  subtitleEmptyList: string,
  getActionButtons?: (url: string) => React$Node,
  className: ?string,
};

export default function BlockList(props: Props) {
  const { uris: list, help, titleEmptyList, subtitleEmptyList, getActionButtons, className } = props;

  // Keep a local list to allow for undoing actions in this component
  const [localList, setLocalList] = React.useState(undefined);
  const stringifiedList = JSON.stringify(list);
  const hasLocalList = localList && localList.length > 0;
  const justBlocked = list && localList && localList.length < list.length;

  const [page, setPage] = React.useState(1);

  let totalPages = 0;
  let paginatedLocalList;
  if (localList) {
    paginatedLocalList = localList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    totalPages = Math.ceil(localList.length / PAGE_SIZE);
  }

  // **************************************************************************
  // **************************************************************************

  function getRenderActions() {
    if (getActionButtons) {
      return (claim) => <div className="section__actions">{getActionButtons(claim.permanent_url)}</div>;
    }
    return undefined;
  }

  // **************************************************************************
  // **************************************************************************

  React.useEffect(() => {
    const list = stringifiedList && JSON.parse(stringifiedList);
    if (!hasLocalList) {
      setLocalList(list && list.length > 0 ? list : []);
    }
  }, [stringifiedList, hasLocalList]);

  React.useEffect(() => {
    if (justBlocked && stringifiedList) {
      setLocalList(JSON.parse(stringifiedList));
    }
  }, [stringifiedList, justBlocked, setLocalList]);

  // **************************************************************************
  // **************************************************************************

  if (paginatedLocalList === undefined) {
    return null;
  }

  if (!hasLocalList) {
    return (
      <div className="main--empty">
        <Yrbl
          title={titleEmptyList}
          subtitle={subtitleEmptyList}
          actions={
            <div className="section__actions">
              <Button button="primary" label={__('Go Home')} navigate="/" />
            </div>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="help--notice">{help}</div>
      <div className={classnames('block-list', className)}>
        <ClaimList
          uris={paginatedLocalList}
          showUnresolvedClaims
          showHiddenByUser
          hideMenu
          renderActions={getRenderActions()}
        />
      </div>
      <Paginate totalPages={totalPages} disableHistory onPageChange={(p) => setPage(p)} />
    </>
  );
}
