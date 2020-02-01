// @flow
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import classNames from 'classnames';
import FilePrice from 'component/filePrice';
import FileAuthor from 'component/fileAuthor';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';
import FileDetails from 'component/fileDetails';
import TextViewer from 'component/textViewer';
import DateTime from 'component/dateTime';
import RecommendedContent from 'component/recommendedContent';
import CommentsList from 'component/commentsList';
import CommentCreate from 'component/commentCreate';
import ClaimUri from 'component/claimUri';
import FileViewerInitiator from 'component/fileViewerInitiator';

type Props = {
  uri: string,
  title: string,
  nsfw: boolean,
  claim: StreamClaim,
  thumbnail: ?string,
  contentType: string,
  fileType: string,
};

function LayoutWrapperText(props: Props) {
  const { uri, claim, title, nsfw, contentType, fileType } = props;

  const markdownType = ['md', 'markdown'];
  const isMarkdown = markdownType.includes(fileType) || contentType === 'text/markdown' || contentType === 'text/md';

  return (
    <div>
      <div className={classNames('main__document-wrapper', { 'main__document-wrapper--markdown': isMarkdown })}>
        <ClaimUri uri={uri} />

        <div className="media__title">
          <span className="media__title-badge">
            {nsfw && <span className="badge badge--tag-mature">{__('Mature')}</span>}
          </span>
          <span className="media__title-badge">
            <FilePrice badge uri={normalizeURI(uri)} />
          </span>
          <h1 className="media__title-text">{title}</h1>
        </div>

        <div className="media__subtitle--between">
          <DateTime uri={uri} show={DateTime.SHOW_DATE} />
          <FileViewCount uri={uri} />
        </div>
        <div className="section">
          <FileAuthor uri={uri} />
        </div>

        <div className="section__divider">
          <hr />
        </div>

        {/* Render the initiator to trigger the view of the file */}
        <FileViewerInitiator uri={uri} />
        <TextViewer uri={uri} />
      </div>

      <div className="columns">
        <div>
          <FileActions uri={uri} />

          <div className="section__divider">
            <hr />
          </div>

          <FileAuthor uri={uri} />

          <div className="section">
            <FileDetails uri={uri} />
          </div>
          <div className="section__title--small">{__('Comments')}</div>
          <section className="section">
            <CommentCreate uri={uri} />
          </section>
          <section className="section">
            <CommentsList uri={uri} />
          </section>
        </div>
        <RecommendedContent uri={uri} claimId={claim.claim_id} />
      </div>
    </div>
  );
}

export default LayoutWrapperText;
