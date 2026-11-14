import * as ICONS from "constants/icons";
import * as PAGES from "constants/pages";
import { SITE_NAME } from "config";
import React from "react";
import Page from "component/page";
import Button from "component/button";
import ClaimTilesDiscover from "component/claimTilesDiscover";
import ClaimPreviewTile from "component/claimPreviewTile";
import Icon from "component/common/icon";
import WaitUntilOnPage from "component/common/wait-until-on-page";
import { useIsLargeScreen } from "effects/use-screensize";
import { GetLinksData } from "util/buildHomepage";

type Props = {
  followedTags: Array<Tag>;
  subscribedChannels: Array<Subscription>;
  showNsfw: boolean;
  homepageData: any;
};

function HomePage(props: Props) {
  const { followedTags, subscribedChannels, showNsfw, homepageData } = props;
  const showPersonalizedChannels = subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;
  const isLargeScreen = useIsLargeScreen();

  const rowData: Array<RowDataItem> = GetLinksData(
    homepageData,
    isLargeScreen,
    true,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  type SectionHeaderProps = {
    title: string;
    navigate?: string;
    icon?: string;
    help?: string;
  };
  const SectionHeader = ({ title, navigate = "/", icon = "", help }: SectionHeaderProps) => {
    return (
      <h1 className="claim-grid__header">
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <Button navigate={navigate} button="link">
          <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />
          <span className="claim-grid__title">{title}</span>
          {help}
        </Button>
      </h1>
    );
  };

  function getRowElements(
    title: unknown,
    route: unknown,
    link: unknown,
    icon: unknown,
    help: unknown,
    options: unknown,
    index: unknown,
    pinUrls: unknown
  ) {
    const tilePlaceholder = (
      <ul className="claim-grid">
        {/* @ts-expect-error - TS2339 - Property 'pageSize' does not exist on type 'unknown'. */}
        {new Array(options.pageSize || 8).fill(1).map((x, i) => (
          <ClaimPreviewTile key={i} placeholder />
        ))}
      </ul>
    );

    // @ts-expect-error - TS2698 (ts-migration)
    const claimTiles = <ClaimTilesDiscover {...options} hasSource pinUrls={pinUrls} />;

    return (
      // @ts-expect-error - TS2322 - Type 'unknown' is not assignable to type 'Key'.
      <div key={title} className="claim-grid__wrapper">
        {/* category header */}
        {index !== 0 && title && typeof title === "string" && (
          // @ts-expect-error - TS2322 - Type 'unknown' is not assignable to type 'string'. | TS2322 - Type 'unknown' is not assignable to type 'string'. | TS2322 - Type 'unknown' is not assignable to type 'string'.
          <SectionHeader title={__(title)} navigate={route || link} icon={icon} help={help} />
        )}

        {index === 0 && <>{claimTiles}</>}
        {index !== 0 && (
          // @ts-expect-error - TS2322 - Type '{ children: Element; name: unknown; placeholder: Element; yOffset: number; }' is not assignable to type 'IntrinsicAttributes & Props'.
          <WaitUntilOnPage name={title} placeholder={tilePlaceholder} yOffset={800}>
            {claimTiles}
          </WaitUntilOnPage>
        )}

        {/* view more button */}
        {(route || link) && (
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            className="claim-grid__title--secondary"
            button="link"
            navigate={route || link}
            iconRight={ICONS.ARROW_RIGHT}
            label={__("View More")}
          />
        )}
      </div>
    );
  }

  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page fullWidthPage>
      {!subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">
            {__("%SITE_NAME% is more fun if you're following channels", { SITE_NAME })}
          </h1>
          <p className="section__actions">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="primary"
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
              label={__("Find new channels to follow")}
            />
          </p>
        </div>
      )}
      {rowData.map(({ title, route, link, icon, help, pinnedUrls: pinUrls, options = {} }, index) => {
        // add pins here
        return getRowElements(title, route, link, icon, help, options, index, pinUrls);
      })}
    </Page>
  );
}

export default HomePage;
