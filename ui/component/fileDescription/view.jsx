// @flow
import React from 'react';
import classnames from 'classnames';
import MarkdownPreview from 'component/common/markdown-preview';
import ClaimTags from 'component/claimTags';
import Card from 'component/common/card';
import Button from 'component/button';

type Props = {
  uri: string,
  claim: StreamClaim,
  metadata: StreamMetadata,
  user: ?any,
  tags: any,
  simple: boolean,
};

function FileDescription(props: Props) {
  const { uri, claim, metadata, tags, simple } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const [hasCalculatedOverflow, setHasCalculatedOverflow] = React.useState(false);
  const descriptionRef = React.useRef();

  React.useEffect(() => {
    if (descriptionRef && descriptionRef.current) {
      const element = descriptionRef.current;
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setHasOverflow(isOverflowing);
      setHasCalculatedOverflow(true);
    }
  }, [descriptionRef]);

  if (!claim || !metadata) {
    return <span className="empty">{__('Empty claim or metadata info.')}</span>;
  }

  const { description } = metadata;

  if (!description && !(tags && tags.length)) return null;

  if (simple) {
    return (
      <div>
        <div
          ref={descriptionRef}
          className={classnames({ 'media__info-text--contracted': !expanded, 'media__info-text--expanded': expanded })}
        >
          <MarkdownPreview className="markdown-preview--description" content={description} />
        </div>
        {hasCalculatedOverflow && hasOverflow && (
          <div className="media__info-expand">
            {expanded ? (
              <Button button="link" label={__('Less')} onClick={() => setExpanded(!expanded)} />
            ) : (
              <Button button="link" label={__('More')} onClick={() => setExpanded(!expanded)} />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card
      title={__('Description')}
      defaultExpand
      actions={
        <>
          {description && (
            <div className="media__info-text">
              <MarkdownPreview content={description} />
            </div>
          )}
          <ClaimTags uri={uri} type="large" />
        </>
      }
    />
  );
}

export default FileDescription;
