// @flow
import { BITWAVE_USERNAME, BITWAVE_EMBED_URL } from 'constants/livestream';
import React from 'react';
import { Lbry } from 'lbry-redux';
import classnames from 'classnames';
import FileTitle from 'component/fileTitle';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import CommentCreate from 'component/commentCreate';
import Button from 'component/button';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  doResolveUri: string => void,
};

export default function LivestreamFeed(props: Props) {
  const { claim, uri, doResolveUri } = props;
  const commentsRef = React.createRef();
  const hasScrolledComments = React.useRef();
  const [fetchingComments, setFetchingComments] = React.useState(true);
  const [performedInitialScroll, setPerformedInitialScroll] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const claimId = claim && claim.claim_id;
  const commentsLength = comments && comments.length;

  React.useEffect(() => {
    if (uri) {
      doResolveUri(uri);
    }
  }, [uri, doResolveUri]);

  React.useEffect(() => {
    function fetchComments() {
      Lbry.comment_list({
        claim_id: claimId,
        page: 1,
        page_size: 200,
        include_replies: false,
        skip_validation: true,
      }).then(response => {
        setFetchingComments(false);
        const comments = response.items;
        if (comments) {
          setComments(comments);
        }
      });
    }

    let interval;
    if (claimId) {
      interval = setInterval(() => {
        fetchComments();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [claimId]);

  React.useEffect(() => {
    const element = commentsRef.current;

    function handleScroll() {
      if (element) {
        const scrollHeight = element.scrollHeight - element.offsetHeight;
        const isAtBottom = scrollHeight === element.scrollTop;

        if (!isAtBottom) {
          hasScrolledComments.current = true;
        } else {
          hasScrolledComments.current = false;
        }
      }
    }

    if (element) {
      element.addEventListener('scroll', handleScroll);

      if (commentsLength > 0) {
        // Only update comment scroll if the user hasn't scrolled up to view old comments
        // If they have, do nothing
        if (!hasScrolledComments.current || !performedInitialScroll) {
          element.scrollTop = element.scrollHeight - element.offsetHeight;

          if (!performedInitialScroll) {
            setPerformedInitialScroll(true);
          }
        }
      }
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [commentsRef, commentsLength]);

  if (!claim) {
    return null;
  }

  return (
    <>
      <div className="section card-stack">
        <div className="file-render file-render--video livestream">
          <div className="file-viewer">
            <iframe src={`${BITWAVE_EMBED_URL}/${BITWAVE_USERNAME}?skin=odysee&autoplay=1`} scrolling="no" />
          </div>
        </div>

        <FileTitle uri={uri} livestream />
      </div>
      <Card
        title={__('Live discussion')}
        smallTitle
        className="livestream__discussion"
        actions={
          <>
            {fetchingComments && (
              <div className="main--empty">
                <Spinner />
              </div>
            )}
            <div
              ref={commentsRef}
              className={classnames('livestream__comments-wrapper', {
                'livestream__comments-wrapper--with-height': commentsLength > 0,
              })}
            >
              {!fetchingComments && comments.length > 0 ? (
                <div className="livestream__comments">
                  {comments.map(comment => (
                    <div key={comment.comment_id} className="livestream__comment">
                      {comment.channel_url ? (
                        <Button
                          target="_blank"
                          rel="noopener noreferrer"
                          className="livestream__comment-author"
                          navigate={comment.channel_url}
                          label={comment.channel_name}
                        />
                      ) : (
                        <div className="livestream__comment-author">{comment.channel_name}</div>
                      )}
                      <div className="">{comment.comment}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="main--empty" />
              )}
            </div>

            <div className="livestream__comment-create">
              <CommentCreate
                livestream
                bottom
                uri={uri}
                onSubmit={(commentValue, channel) => {
                  const commentsWithStub = comments.slice();
                  commentsWithStub.unshift({
                    comment: commentValue,
                    channel_name: channel,
                    timestamp: Date.now() / 1000,
                    comment_id: Math.random(),
                  });

                  setComments(commentsWithStub);
                }}
              />
            </div>
          </>
        }
      />
    </>
  );
}
