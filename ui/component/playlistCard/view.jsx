// @flow

// $FlowFixMe
import { Global } from '@emotion/react';

import React from 'react';
import classnames from 'classnames';
import CollectionItemsList from 'component/collectionItemsList';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import * as DRAWERS from 'constants/drawer_types';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import { NavLink } from 'react-router-dom';
import UriIndicator from 'component/uriIndicator';
import I18nMessage from 'component/i18nMessage';
import ShuffleButton from './internal/shuffleButton';
import LoopButton from './internal/loopButton';
import SwipeableDrawer from 'component/swipeableDrawer';
import DrawerExpandButton from 'component/swipeableDrawerExpand';
import usePersistedState from 'effects/use-persisted-state';
import { HEADER_HEIGHT_MOBILE } from 'component/fileRenderFloating/view';
import { getMaxLandscapeHeight } from 'util/window';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';

type Props = {
  id: ?string,
  playingItemUrl: string,
  playingCurrentPlaylist: boolean,
  isMyCollection: boolean,
  collectionUrls: Array<Claim>,
  collectionName: string,
  isPrivateCollection: boolean,
  publishedCollectionName: string | boolean,
  playingItemIndex: number,
  collectionLength: number,
  disableClickNavigation?: boolean,
  useDrawer?: boolean,
  collectionEmpty: boolean,
  hasCollectionById: boolean,
  isFloating?: boolean,
  playingCollectionId: ?string,
  collectionSavedForId: boolean,
  createUnpublishedCollection: (string, Array<any>, ?string) => void,
  doCollectionEdit: (string, CollectionEditParams) => void,
  doDisablePlayerDrag?: (disable: boolean) => void,
  doClearPlayingCollection: () => void,
  doOpenModal: (id: string, props: {}) => void,
  doClearQueueList: () => void,
  doToggleCollectionSavedForId: (id: string) => void,
};

export default function PlaylistCard(props: Props) {
  const { collectionName, useDrawer, hasCollectionById, playingItemIndex, collectionLength, collectionEmpty } = props;

  const [showEdit, setShowEdit] = React.useState(false);

  if (!hasCollectionById) return null;

  const currentIndexLabel = ` - ${playingItemIndex}/${collectionLength} `;
  const playlistCardProps = { showEdit, setShowEdit, currentIndexLabel, ...props };

  if (useDrawer) {
    return (
      <>
        <DrawerExpandButton
          fixed
          icon={ICONS.PLAYLIST_PLAYBACK}
          label={
            __('Now playing: --[Which Playlist is currently playing]--') + ' ' + collectionName + currentIndexLabel
          }
          type={DRAWERS.PLAYLIST}
        />

        <SwipeableDrawer
          startOpen={!collectionEmpty}
          type={DRAWERS.PLAYLIST}
          title={
            // returns the card title element
            <PlaylistCardComponent
              {...playlistCardProps}
              className="playlist-card--drawer-header"
              colorHeader={false}
              titleOnly
            />
          }
          hasSubtitle
        >
          {/* returns the card body element */}
          <PlaylistCardComponent {...playlistCardProps} className="playlist-card" bodyOnly />
        </SwipeableDrawer>
      </>
    );
  }

  // returns the full card element
  return <PlaylistCardComponent {...playlistCardProps} className="playlist-card" />;
}

type PlaylistCardProps = Props & {
  titleOnly?: boolean,
  bodyOnly?: boolean,
  showEdit: boolean,
  currentIndexLabel: string,
  setShowEdit: (show: boolean) => void,
};

const PlaylistCardComponent = (props: PlaylistCardProps) => {
  const {
    isMyCollection,
    collectionUrls,
    collectionName,
    id,
    playingItemUrl,
    isPrivateCollection,
    publishedCollectionName,
    doCollectionEdit,
    playingItemIndex,
    collectionLength,
    currentIndexLabel,
    disableClickNavigation,
    titleOnly,
    bodyOnly,
    showEdit,
    setShowEdit,
    doDisablePlayerDrag,
    collectionEmpty,
    playingCurrentPlaylist,
    isFloating,
    playingCollectionId,
    doClearPlayingCollection,
    doOpenModal,
    doClearQueueList,
    doToggleCollectionSavedForId,
    collectionSavedForId,
    ...cardProps
  } = props;

  const isMobile = useIsMobile();
  const isMediumScreen = useIsMediumScreen() && !isMobile;

  const activeItemRef = React.useRef();
  const scrollRestorePending = React.useRef();
  const listHasActive = React.useRef();

  const [floatingBodyOpen, setFloatingBodyOpen] = usePersistedState('playlist-card-open', true);
  const [bodyOpen, setBodyOpen] = React.useState(isFloating ? floatingBodyOpen : true);
  const [bodyRef, setBodyRef] = React.useState();
  const [hasActive, setHasActive] = React.useState();
  const [scrolledPastActive, setScrolledPast] = React.useState();

  function closePlaylist() {
    if (collectionEmpty) {
      doClearPlayingCollection();
      return;
    }

    const isPlayingQueue = playingCollectionId === COLLECTIONS_CONSTS.QUEUE_ID;
    const title = isPlayingQueue
      ? __('Are you sure you want to quit and clear the current Queue?')
      : __('Are you sure you want to quit the current playlist?');

    doOpenModal(MODALS.CONFIRM, {
      title: title,
      subtitle: __('The current video will keep playing.'),
      onConfirm: (closeModal) => {
        doClearPlayingCollection();
        if (isPlayingQueue) doClearQueueList();
        closeModal();
      },
    });
  }

  const activeListItemRef = React.useCallback(
    (node) => {
      if (node && bodyRef) {
        activeItemRef.current = node;
        // without this, the list would scroll to the top of the item
        // so make it so it's approximately centered instead
        const listCenter = bodyRef.offsetHeight / 2;

        let topToScroll = node.offsetTop - bodyRef.offsetTop - listCenter;
        if (playingItemIndex === 1) {
          topToScroll = 0;
        } else if (playingItemIndex === collectionLength) {
          topToScroll = bodyRef.scrollHeight;
        }

        try {
          bodyRef.scrollTo({ top: topToScroll, behavior: isMediumScreen ? 'instant' : 'smooth' });
        } catch (error) {}

        setScrolledPast(false);
        scrollRestorePending.current = true;
      }
    },
    [bodyRef, collectionLength, isMediumScreen, playingItemIndex]
  );

  React.useEffect(() => {
    if (bodyRef) {
      const handleScroll = () => {
        const currentActiveItem = activeItemRef.current;

        if (currentActiveItem) {
          const { top, height } = currentActiveItem.getBoundingClientRect();
          const itemTop = currentActiveItem.offsetTop - bodyRef.offsetTop;
          const itemBottom = itemTop + height;

          let [playerTop, playerInfoTop] = [0, 0];
          if (isFloating || isMobile) {
            if (isFloating) {
              const playerInfo = document.querySelector('.content__info');
              if (playerInfo) playerInfoTop = playerInfo.offsetTop;

              const playerElem = document.querySelector('.content__viewer');
              const playerTransform = playerElem && playerElem.style.transform;
              if (playerTransform) {
                playerTop = Number(
                  playerTransform.substring(playerTransform.indexOf(', ') + 2, playerTransform.indexOf('px)'))
                );
              }
            }

            if (isMobile) {
              const contentHeight = HEADER_HEIGHT_MOBILE + getMaxLandscapeHeight();
              playerTop += contentHeight;
            }
          }

          const scrolled =
            top - playerTop - height - bodyRef.offsetTop - playerInfoTop > bodyRef.offsetHeight ||
            itemBottom < bodyRef.scrollTop;

          if (!scrollRestorePending.current) {
            setScrolledPast(scrolled);
          } else {
            scrollRestorePending.current = false;
          }
        }
      };

      if (bodyOpen && listHasActive.current) {
        handleScroll();
        if (activeItemRef.current) activeListItemRef(activeItemRef.current);
      }

      bodyRef.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      return () => {
        bodyRef.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [activeListItemRef, bodyOpen, bodyRef, isFloating, isMobile]);

  return (
    <>
      <Global
        styles={{
          '.claim-list__scroll-to-recent': {
            opacity: !scrolledPastActive || !hasActive ? '0' : '0.9 !important',
            // visibility also needed because it prevents clicking on the button
            // opacity makes it invisible but still clickable
            visibility: !scrolledPastActive || !hasActive ? 'hidden' : 'visible !important',

            '&:hover': {
              opacity: !scrolledPastActive || !hasActive ? '0' : '1 !important',
            },
          },

          '.playlist-card': {
            '.claim-list': {
              'li:last-child': {
                marginBottom:
                  scrolledPastActive && hasActive && playingItemIndex !== collectionLength
                    ? '3rem !important'
                    : undefined,
              },
            },
          },
        }}
      />

      <Card
        {...cardProps}
        smallTitle
        slimHeader={!isFloating}
        gridHeader={!titleOnly}
        singlePane
        headerActions={
          !bodyOpen || bodyOnly ? undefined : (
            <div className="playlist-card-actions">
              <section>
                <LoopButton id={id} />
                <ShuffleButton url={playingItemUrl} id={id} />
              </section>

              <section>
                <Button
                  requiresAuth
                  title={__('Copy')}
                  className="button-toggle"
                  icon={ICONS.COPY}
                  onClick={() => doOpenModal(MODALS.COLLECTION_CREATE, { sourceId: id })}
                />

                {isMyCollection
                  ? !collectionEmpty && (
                      <Button
                        title={__('Arrange')}
                        className={classnames('button-toggle', { 'button-toggle--active': showEdit })}
                        icon={ICONS.ARRANGE}
                        onClick={() => setShowEdit(!showEdit)}
                      />
                    )
                  : id && (
                      <Button
                        requiresAuth
                        title={__('Save')}
                        className="button-toggle"
                        icon={collectionSavedForId ? ICONS.PLAYLIST_FILLED : ICONS.PLAYLIST_ADD}
                        onClick={() => doToggleCollectionSavedForId(id)}
                      />
                    )}
              </section>
            </div>
          )
        }
        title={
          bodyOnly ? undefined : (
            <NavLink
              to={`/$/${PAGES.PLAYLIST}/${id || ''}`}
              className={classnames('a--styled', { 'align-end': isFloating })}
            >
              {isFloating ? (
                <>
                  <Icon icon={ICONS.PLAYLIST_PLAYBACK} size={40} />
                  <span className="text-ellipsis">
                    {__('Now playing: --[Which Playlist is currently playing]--') + ' ' + collectionName}
                  </span>
                </>
              ) : (
                <>
                  <Icon icon={COLLECTIONS_CONSTS.PLAYLIST_ICONS[id] || ICONS.PLAYLIST} className="icon--margin-right" />
                  <span className="text-ellipsis">{collectionName}</span>
                </>
              )}
            </NavLink>
          )
        }
        titleActions={
          bodyOnly || titleOnly ? undefined : (
            <>
              {!bodyOnly && (
                <Button
                  className={classnames('button-toggle', { 'button-toggle--active': !bodyOpen })}
                  icon={bodyOpen ? ICONS.UP : ICONS.DOWN}
                  onClick={() => {
                    if (isFloating) setFloatingBodyOpen(!floatingBodyOpen);
                    setBodyOpen(!bodyOpen);
                  }}
                />
              )}

              <Button
                title={__('Close Playlist')}
                className="button-toggle"
                icon={ICONS.REMOVE}
                onClick={closePlaylist}
              />
            </>
          )
        }
        subtitle={
          bodyOnly ? undefined : (
            <>
              {isPrivateCollection ? (
                <I18nMessage
                  tokens={{ lock_icon: <Icon icon={ICONS.LOCK} style={{ transform: 'translateY(3px)' }} /> }}
                >
                  Private %lock_icon%
                </I18nMessage>
              ) : (
                <UriIndicator link uri={publishedCollectionName} showHiddenAsAnonymous />
              )}

              {currentIndexLabel}
            </>
          )
        }
        body={
          !bodyOpen || titleOnly ? undefined : (
            <CollectionItemsList
              collectionId={id}
              type="small"
              activeUri={playingItemUrl}
              empty={__('Playlist is Empty')}
              showEdit={showEdit}
              smallThumbnail
              showIndexes
              playItemsOnClick={playingCurrentPlaylist}
              disableClickNavigation={disableClickNavigation}
              doDisablePlayerDrag={doDisablePlayerDrag}
              setActiveListItemRef={bodyRef ? activeListItemRef : undefined}
              setListRef={(node) => setBodyRef(node)}
              scrolledPastActive={scrolledPastActive}
              restoreScrollPos={() => activeListItemRef(activeItemRef.current)}
              setHasActive={(hasActive) => {
                listHasActive.current = hasActive;
                setHasActive(hasActive);
              }}
            />
          )
        }
      />
    </>
  );
};
