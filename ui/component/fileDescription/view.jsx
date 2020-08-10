// @flow
import React, { PureComponent } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import ClaimTags from 'component/claimTags';
import Card from 'component/common/card';

type Props = {
  uri: string,
  claim: StreamClaim,
  metadata: StreamMetadata,
  user: ?any,
  tags: any,
};

class FileDescription extends PureComponent<Props> {
  render() {
    const { uri, claim, metadata, tags } = this.props;

    if (!claim || !metadata) {
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }

    const { description } = metadata;

    if (!description && !(tags && tags.length)) return null;

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
}

export default FileDescription;
