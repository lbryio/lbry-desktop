import React from "react";
import { isNameValid, parseURI } from "util/lbryURI";
import Button from "component/button";
import ClaimPreview from "component/claimPreview";
import { FormField } from "component/common/form-components/form-field";
import Icon from "component/common/icon";
import TagsSearch from "component/tagsSearch";
import * as ICONS from "constants/icons";
import { getUriForSearchTerm } from "util/search";

type Props = {
  label: string;
  labelAddNew: string;
  labelFoundAction: string;
  values: Array<string>; // [ 'name#id', 'name#id' ],
  onAdd?: (channelUri: string) => void;
  onRemove?: (channelUri: string) => void;
  // --- perform ---
  doToast: (arg1: { message: string }) => void;
};

export default function SearchChannelField(props: Props) {
  const { label, labelAddNew, labelFoundAction, values, onAdd, onRemove, doToast } = props;

  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchTermError, setSearchTermError] = React.useState("");
  const [searchUri, setSearchUri] = React.useState("");
  const addTagRef = React.useRef<any>();

  function parseUri(name: string) {
    try {
      return parseURI(name);
    } catch (e: any) {}

    return undefined;
  }

  function addTag(newTags: Array<Tag>) {
    // Ignoring multiple entries for now, although <TagsSearch> supports it.
    const uri = parseUri(newTags[0].name);

    if (uri && uri.isChannel && uri.claimName && uri.claimId) {
      if (!values.includes(newTags[0].name)) {
        if (onAdd) {
          onAdd(newTags[0].name);
        }
      }
    } else {
      // @ts-expect-error - TS2345 - Argument of type '{ message: string; isError: boolean; }' is not assignable to parameter of type '{ message: string; }'.
      doToast({ message: __('Invalid channel URL "%url%"', { url: newTags[0].name }), isError: true });
    }
  }

  function removeTag(tagToRemove: Tag) {
    const uri = parseUri(tagToRemove.name);

    if (uri && uri.isChannel && uri.claimName && uri.claimId) {
      if (values.includes(tagToRemove.name)) {
        if (onRemove) {
          onRemove(tagToRemove.name);
        }
      }
    }
  }

  function clearSearchTerm() {
    setSearchTerm("");
    setSearchTermError("");
    setSearchUri("");
  }

  function handleKeyPress(e: KeyEvent) {
    // We have to use 'key' instead of 'keyCode' in this event.
    if (e.key === "Enter" && addTagRef && addTagRef.current && addTagRef.current.click) {
      e.preventDefault();
      addTagRef.current.click();
    }
  }

  function getFoundChannelRenderActionsFn() {
    function handleFoundChannelClick(claim: unknown) {
      // @ts-expect-error - TS2339 - Property 'name' does not exist on type 'unknown'. | TS2339 - Property 'claim_id' does not exist on type 'unknown'.
      if (claim && claim.name && claim.claim_id) {
        // @ts-expect-error - TS2339 - Property 'name' does not exist on type 'unknown'. | TS2339 - Property 'claim_id' does not exist on type 'unknown'.
        addTag([{ name: claim.name + "#" + claim.claim_id }]);
        clearSearchTerm();
      }
    }

    return (claim: unknown) => {
      return (
        <Button
          ref={addTagRef}
          // @ts-expect-error - TS2322 (ts-migration)
          button="primary"
          label={labelFoundAction}
          onClick={() => handleFoundChannelClick(claim)}
        />
      );
    };
  }

  // 'searchTerm' sanitization
  React.useEffect(() => {
    if (!searchTerm) {
      clearSearchTerm();
    } else {
      const isUrl = searchTerm.startsWith("https://") || searchTerm.startsWith("lbry://");
      const autoAlias = !isUrl && !searchTerm.startsWith("@") ? "@" : "";

      const [uri, error] = getUriForSearchTerm(`${autoAlias}${searchTerm}`);
      setSearchTermError(error ? __("Something not quite right..") : "");

      try {
        const { streamName, channelName, isChannel } = parseURI(uri);

        if (!isChannel && streamName && isNameValid(streamName)) {
          setSearchTermError(__('Not a channel (prefix with "@", or enter the channel URL)'));
          setSearchUri("");
        } else if (isChannel && channelName && isNameValid(channelName)) {
          setSearchUri(uri);
        }
      } catch (e: any) {
        setSearchTermError(e.message);
        setSearchUri("");
      }
    }
  }, [searchTerm, setSearchTermError]);

  return (
    <div className="search__channel tag--blocked-words">
      <TagsSearch
        label={label}
        labelAddNew={labelAddNew}
        tagsPassedIn={values.map((x) => ({ name: x }))}
        // @ts-expect-error - TS2322 (ts-migration)
        onSelect={addTag}
        onRemove={removeTag}
        disableAutoFocus
        hideInputField
        hideSuggestions
        disableControlTags
      />

      <div className="search__channel--popup">
        <FormField
          type="text"
          name="moderator_search"
          // @ts-expect-error - TS2322 (ts-migration)
          className="form-field--address"
          label={
            <>
              {labelAddNew}
              <Icon
                customTooltipText={__(HELP.CHANNEL_SEARCH)}
                className="icon--help"
                icon={ICONS.HELP}
                tooltip
                size={16}
              />
            </>
          }
          placeholder={__("Enter full channel name or URL")}
          value={searchTerm}
          error={searchTermError}
          onKeyPress={(e) => handleKeyPress(e)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchUri && (
          <div className="search__channel--popup-results">
            <ClaimPreview
              uri={searchUri}
              hideMenu
              hideRepostLabel
              disableNavigation
              showNullPlaceholder
              properties={""}
              renderActions={getFoundChannelRenderActionsFn()}
              empty={
                <div className="claim-preview claim-preview--inactive claim-preview--large claim-preview__empty">
                  {__("Channel not found")}
                  <Icon
                    customTooltipText={__(HELP.CHANNEL_SEARCH)}
                    className="icon--help"
                    icon={ICONS.HELP}
                    tooltip
                    size={22}
                  />
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

// prettier-ignore
const HELP = {
  CHANNEL_SEARCH: 'Enter the full channel name or URL to search.\n\nExamples:\n - @channel\n - @channel#3\n - https://odysee.com/@Odysee:8\n - lbry://@Odysee#8',
} as const;
