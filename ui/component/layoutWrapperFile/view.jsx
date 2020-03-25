// @flow
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import FileViewerInitiator from 'component/fileViewerInitiator';
import FileSubtitle from 'component/fileSubtitle';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileValues from 'component/fileValues';

import FileAuthor from 'component/fileAuthor';
import FileActions from 'component/fileActions';
import RecommendedContent from 'component/recommendedContent';
import CommentsList from 'component/commentsList';
import CommentCreate from 'component/commentCreate';
import ClaimUri from 'component/claimUri';

export const FILE_WRAPPER_CLASS = 'grid-area--content';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  uri: string,
  claimIsMine: boolean,
  costInfo: ?{ cost: number },
  balance: number,
  title: string,
  nsfw: boolean,
};

function LayoutWrapperFile(props: Props) {
  const { claim, uri, claimIsMine, costInfo, balance, title, nsfw } = props;
  const insufficientCredits = !claimIsMine && costInfo && costInfo.cost > balance;

  return (
    <div>
      <ClaimUri uri={uri} />
      <div className={`card ${FILE_WRAPPER_CLASS}`}>
        <FileViewerInitiator uri={uri} insufficientCredits={insufficientCredits} />
      </div>

      <div className="media__title">
        <span className="media__title-badge">
          {nsfw && <span className="badge badge--tag-mature">{__('Mature')}</span>}
        </span>
        <span className="media__title-badge">
          <FilePrice badge uri={normalizeURI(uri)} />
        </span>
        <h1 className="media__title-text">{title}</h1>
      </div>

      <div className="columns">
        <div className="grid-area--info">
          <FileSubtitle uri={uri} />
          <FileActions uri={uri} />

          <div className="section__divider">
            <hr />
          </div>

          <FileAuthor uri={uri} />

          <div className="section">
            <FileValues uri={uri} />
          </div>
          <div className="section">
            <FileDetails uri={uri} />
          </div>

          <div className="section__divider">
            <hr />
          </div>

          <div className="section__title--small">{__('Comments')}</div>
          <section className="section">
            <CommentCreate uri={uri} />
          </section>
          <section className="section">
            <CommentsList uri={uri} />
          </section>
        </div>
        <div className="grid-area--related">
          <RecommendedContent uri={uri} claimId={claim.claim_id} />
        </div>
      </div>
    </div>
  );
}

export default LayoutWrapperFile;
