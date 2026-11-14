import * as ICONS from "constants/icons";
import { BLOCK_LEVEL } from "constants/comment";
import React from "react";
import classnames from "classnames";
import moment from "moment";
import humanizeDuration from "humanize-duration";
import BlockList from "component/blockList";
import ClaimPreview from "component/claimPreview";
import Page from "component/page";
import Spinner from "component/spinner";
import Button from "component/button";
import usePersistedState from "effects/use-persisted-state";
import ChannelBlockButton from "component/channelBlockButton";
import ChannelMuteButton from "component/channelMuteButton";

const VIEW = {
  BLOCKED: "blocked",
  ADMIN: "admin",
  MODERATOR: "moderator",
  MUTED: "muted",
} as const;

type Props = {
  mutedUris: Array<string> | null | undefined;
  personalBlockList: Array<string> | null | undefined;
  adminBlockList: Array<string> | null | undefined;
  moderatorBlockList: Array<string> | null | undefined;
  personalTimeoutMap: {
    [uri: string]: {
      blockedAt: string;
      bannedFor: number;
      banRemaining: number;
    };
  };
  adminTimeoutMap: {
    [uri: string]: {
      blockedAt: string;
      bannedFor: number;
      banRemaining: number;
    };
  };
  moderatorTimeoutMap: {
    [uri: string]: {
      blockedAt: string;
      bannedFor: number;
      banRemaining: number;
    };
  };
  moderatorBlockListDelegatorsMap: {
    [key: string]: Array<string>;
  };
  fetchingModerationBlockList: boolean;
  fetchModBlockedList: () => void;
  fetchModAmIList: () => void;
  delegatorsById: {
    [key: string]: {
      global: boolean;
      delegators: {
        name: string;
        claimId: string;
      };
    };
  };
  myChannelClaimIds: Array<string> | null | undefined;
};

function ListBlocked(props: Props) {
  const {
    mutedUris,
    personalBlockList,
    adminBlockList,
    moderatorBlockList,
    personalTimeoutMap,
    adminTimeoutMap,
    moderatorTimeoutMap,
    moderatorBlockListDelegatorsMap: delegatorsMap,
    fetchingModerationBlockList,
    fetchModBlockedList,
    fetchModAmIList,
    delegatorsById,
    myChannelClaimIds,
  } = props;
  const [viewMode, setViewMode] = usePersistedState("blocked-muted:display", VIEW.BLOCKED);

  const [localDelegatorsMap, setLocalDelegatorsMap] = React.useState<any>(undefined);

  const stringifiedDelegatorsMap = JSON.stringify(delegatorsMap);
  const stringifiedLocalDelegatorsMap = JSON.stringify(localDelegatorsMap);

  const isAdmin = myChannelClaimIds && myChannelClaimIds.some((id) => delegatorsById[id] && delegatorsById[id].global);

  const isModerator =
    myChannelClaimIds &&
    myChannelClaimIds.some((id) => delegatorsById[id] && Object.keys(delegatorsById[id].delegators).length > 0);

  // **************************************************************************

  function getList(view: unknown) {
    switch (view) {
      case VIEW.BLOCKED:
        return personalBlockList;
      case VIEW.ADMIN:
        return adminBlockList;
      case VIEW.MODERATOR:
        return moderatorBlockList;
      case VIEW.MUTED:
        return mutedUris;
    }
  }

  function getActionButtons(uri: unknown) {
    const getDurationStr = (durationNs: unknown) => {
      const NANO_TO_MS = 1000000;
      // @ts-expect-error - TS2362 - The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
      return humanizeDuration(durationNs / NANO_TO_MS, { round: true });
    };

    const getBanInfoElem = (timeoutInfo: unknown) => {
      return (
        <div>
          <div className="help">
            <blockquote>
              {/* @ts-expect-error - TS2339 - Property 'blockedAt' does not exist on type 'unknown'. */}
              {moment(timeoutInfo.blockedAt).format("MMMM Do, YYYY @ HH:mm")}
              <br />
              {/* @ts-expect-error - TS2339 - Property 'bannedFor' does not exist on type 'unknown'. */}
              {getDurationStr(timeoutInfo.bannedFor)}{" "}
              {__("(Remaining: %duration%) --[timeout ban duration]--", {
                // @ts-expect-error - TS2339 - Property 'banRemaining' does not exist on type 'unknown'.
                duration: getDurationStr(timeoutInfo.banRemaining),
              })}
            </blockquote>
          </div>
        </div>
      );
    };

    switch (viewMode) {
      case VIEW.BLOCKED:
        return (
          <>
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <ChannelBlockButton uri={uri} />
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <ChannelMuteButton uri={uri} />
            {/* @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type. | TS2538 - Type 'unknown' cannot be used as an index type. */}
            {personalTimeoutMap[uri] && getBanInfoElem(personalTimeoutMap[uri])}
          </>
        );

      case VIEW.ADMIN:
        return (
          <>
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <ChannelBlockButton uri={uri} blockLevel={BLOCK_LEVEL.ADMIN} />
            {/* @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type. | TS2538 - Type 'unknown' cannot be used as an index type. */}
            {adminTimeoutMap[uri] && getBanInfoElem(adminTimeoutMap[uri])}
          </>
        );

      case VIEW.MODERATOR:
        // @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type.
        const delegatorUrisForBlockedUri = localDelegatorsMap && localDelegatorsMap[uri];
        if (!delegatorUrisForBlockedUri) return null;
        return (
          <>
            {delegatorUrisForBlockedUri.map((delegatorUri) => {
              return (
                <div className="block-list--delegator" key={delegatorUri}>
                  <label>{__("Blocked on behalf of:")}</label>
                  <ul className="section">
                    <div className="content__non-clickable">
                      <ClaimPreview uri={delegatorUri} hideMenu hideActions type="inline" properties={false} />
                      {/* @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type. | TS2538 - Type 'unknown' cannot be used as an index type. */}
                      {moderatorTimeoutMap[uri] && getBanInfoElem(moderatorTimeoutMap[uri])}
                    </div>
                    {/* @ts-expect-error - TS2322 (ts-migration) */}
                    <ChannelBlockButton uri={uri} blockLevel={BLOCK_LEVEL.MODERATOR} creatorUri={delegatorUri} />
                  </ul>
                </div>
              );
            })}
          </>
        );

      case VIEW.MUTED:
        return (
          <>
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <ChannelMuteButton uri={uri} />
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <ChannelBlockButton uri={uri} />
          </>
        );
    }
  }

  function getHelpText(view: unknown) {
    switch (view) {
      case VIEW.BLOCKED:
        return __(
          "Blocked channels will be invisible to you in the app. They will not be able to comment on your content, nor reply to your comments left on other channels' content."
        );
      case VIEW.ADMIN:
        return __("This is the global block list.");
      case VIEW.MODERATOR:
        return __("List of channels that you have blocked as a moderator, along with the list of delegators.");
      case VIEW.MUTED:
        return __(
          "Muted channels will be invisible to you in the app. They will not know they are muted and can still interact with you and your content."
        );
    }
  }

  function getEmptyListTitle(view: unknown) {
    switch (view) {
      case VIEW.BLOCKED:
        return __("You do not have any blocked channels");
      case VIEW.MUTED:
        return __("You do not have any muted channels");
      case VIEW.ADMIN:
        return __("You do not have any globally-blocked channels");
      case VIEW.MODERATOR:
        return __("You do not have any blocked channels as a moderator");
    }
  }

  function getEmptyListSubtitle(view: unknown) {
    switch (view) {
      case VIEW.BLOCKED:
      case VIEW.MUTED:
        return getHelpText(view);

      case VIEW.ADMIN:
      case VIEW.MODERATOR:
        return null;
    }
  }

  function isSourceListLarger(source: unknown, local: unknown) {
    // Comparing the length of stringified is not perfect, but what are the
    // chances of having different lists with the exact same length?
    // @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'. | TS2339 - Property 'length' does not exist on type 'unknown'.
    return source && (!local || local.length < source.length);
  }

  function getViewElem(view: unknown, label: unknown, icon: unknown) {
    return (
      <Button
        // @ts-expect-error - TS2322 (ts-migration)
        icon={icon}
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        label={__(label)}
        className={classnames(`button-toggle`, {
          "button-toggle--active": viewMode === view,
        })}
        onClick={() => setViewMode(view)}
      />
    );
  }

  function getRefreshElem() {
    return (
      myChannelClaimIds && (
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          icon={ICONS.REFRESH}
          label={__("Refresh")}
          onClick={() => {
            fetchModBlockedList();
            fetchModAmIList();
          }}
        />
      )
    );
  }

  // **************************************************************************

  React.useEffect(() => {
    if (stringifiedDelegatorsMap && isSourceListLarger(stringifiedDelegatorsMap, stringifiedLocalDelegatorsMap)) {
      setLocalDelegatorsMap(JSON.parse(stringifiedDelegatorsMap));
    }
  }, [stringifiedDelegatorsMap, stringifiedLocalDelegatorsMap]);

  // **************************************************************************

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      // @ts-expect-error - TS2741 (ts-migration)
      backout={{ title: __("Blocked and muted channels"), backLabel: __("Back") }}
    >
      {fetchingModerationBlockList && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}

      {!fetchingModerationBlockList && (
        <>
          <div className="section__header--actions">
            <div className="section__actions--inline">
              {getViewElem(VIEW.BLOCKED, "Blocked", ICONS.BLOCK)}
              {isAdmin && getViewElem(VIEW.ADMIN, "Global", ICONS.BLOCK)}
              {isModerator && getViewElem(VIEW.MODERATOR, "Moderator", ICONS.BLOCK)}
              {getViewElem(VIEW.MUTED, "Muted", ICONS.MUTE)}
            </div>
            <div className="section__actions--inline">{getRefreshElem()}</div>
          </div>

          <BlockList
            key={viewMode}
            uris={getList(viewMode)}
            help={getHelpText(viewMode)}
            titleEmptyList={getEmptyListTitle(viewMode)}
            // @ts-expect-error - TS2322 (ts-migration)
            subtitle={getEmptyListSubtitle(viewMode)}
            getActionButtons={getActionButtons}
            className={viewMode === VIEW.MODERATOR ? "block-list--moderator" : undefined}
          />
        </>
      )}
    </Page>
  );
}

export default ListBlocked;
