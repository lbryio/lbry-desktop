// @flow
import React from 'react';
import classnames from 'classnames';
import SectionList from 'component/channelSections/SectionList';
import ChannelThumbnail from 'component/channelThumbnail';
import Gerbil from 'component/channelThumbnail/gerbil.png';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'component/common/tabs';
import ThumbnailBrokenImage from 'component/selectThumbnail/thumbnail-broken.png';
import { parseURI } from 'util/lbryURI';

type Props = {
  uri: string,
  disabled?: boolean,
  // --- redux ---
  title: ?string,
  coverUrl: ?string,
  thumbnailUrl: ?string,
};

export default function ChannelSectionsEdit(props: Props) {
  const { uri, title, thumbnailUrl, coverUrl, disabled } = props;

  // @todo: anything need to handle with 'creatingChannel' and 'updatingChannel' (i.e. while channel is being created)

  const [coverError, setCoverError] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  const { channelName } = parseURI(uri);

  const coverSrc = coverError ? ThumbnailBrokenImage : coverUrl;
  const thumbnailPreview = resolveThumbnailPreview();

  function resolveThumbnailPreview() {
    if (!thumbnailUrl) {
      return Gerbil;
    } else if (thumbError) {
      return ThumbnailBrokenImage;
    } else {
      return thumbnailUrl;
    }
  }

  return (
    <div className={classnames({ 'card--disabled': disabled })}>
      <header className="channel-cover">
        {coverUrl &&
          (coverError ? (
            <div className="channel-cover__custom--waiting">
              <p>{__('Uploaded image will be visible in a few minutes after you submit this form.')}</p>
            </div>
          ) : (
            <img className="channel-cover__custom" src={coverSrc} onError={() => setCoverError(true)} />
          ))}
        <div className="channel__primary-info">
          <ChannelThumbnail
            className="channel__thumbnail--channel-page"
            uri={uri}
            thumbnailPreview={thumbnailPreview}
            allowGifs
            setThumbUploadError={setThumbError}
            thumbUploadError={thumbError}
          />
          <h1 className="channel__title">{title || (channelName && '@' + channelName)}</h1>
        </div>
        <div className="channel-cover__gradient" />
      </header>

      <Tabs className="channelPage-wrapper">
        <TabList className="tabs__list--channel-page">
          <Tab>{''}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SectionList uri={uri} editMode />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
