import * as React from "react";
import * as ICONS from "constants/icons";
import * as MODALS from "constants/modal_types";
import { formatCredits } from "util/format-credits";
import FileDetails from "component/fileDetails";
import ClaimAuthor from "component/claimAuthor";
import FileTitle from "component/fileTitle";
import FileActions from "component/fileActions";
import FileRenderInitiator from "component/fileRenderInitiator";
import FileRenderInline from "component/fileRenderInline";
import FileValues from "component/fileValues";
import FileViewCount from "component/fileViewCount";
import ClaimTags from "component/claimTags";
import DateTime from "component/dateTime";
import Button from "component/button";
import LbcSymbol from "component/common/lbc-symbol";
import classnames from "classnames";

const EXPAND = {
  NONE: "none",
  CREDIT_DETAILS: "credit_details",
  FILE_DETAILS: "file_details",
} as const;

type Props = {
  uri: string;
  claim: StreamClaim | null | undefined;
  claimIsMine: boolean;
  doOpenModal: (id: string, arg2: Record<any, any>) => void;
};

function PostViewer(props: Props) {
  const { uri, claim, claimIsMine, doOpenModal } = props;
  const [expand, setExpand] = React.useState(EXPAND.NONE);

  if (!claim) {
    return null;
  }

  const amount = parseFloat(claim.amount) + parseFloat(claim.meta.support_amount);
  const formattedAmount = formatCredits(amount, 2, true);
  const hasSupport = claim && claim.meta && claim.meta.support_amount && Number(claim.meta.support_amount) > 0;

  function handleExpand(newExpand: unknown) {
    if (expand === newExpand) {
      setExpand(EXPAND.NONE);
    } else {
      // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'SetStateAction<"none">'.
      setExpand(newExpand);
    }
  }

  return (
    <div className="post">
      {/* @ts-expect-error - TS2322 (ts-migration) */}
      <FileTitle uri={uri} className="post__title" />
      <div
        className={classnames("post__info", {
          "post__info--expanded": expand !== EXPAND.NONE,
        })}
      >
        <span className="post__date">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <DateTime uri={uri} type="date" />
          {/* @ts-expect-error - TS2741 (ts-migration) */}
          <FileViewCount uri={uri} />
        </span>
        <div className="post__info--grouped">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            button="link"
            className="dim"
            icon={ICONS.INFO}
            aria-label={__("View claim details")}
            onClick={() => handleExpand(EXPAND.FILE_DETAILS)}
          />
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" className="dim" onClick={() => handleExpand(EXPAND.CREDIT_DETAILS)}>
            {/* @ts-expect-error - TS2367 - This condition will always return 'false' since the types '"none"' and '"credit_details"' have no overlap. */}
            <LbcSymbol postfix={expand === EXPAND.CREDIT_DETAILS ? __("Hide") : formattedAmount} />
          </Button>
          {claimIsMine && hasSupport && (
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="link"
              className="expandable__button"
              icon={ICONS.UNLOCK}
              aria-label={__("Unlock tips")}
              onClick={() => {
                doOpenModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
              }}
            />
          )}
        </div>
      </div>

      {/* @ts-expect-error - TS2367 - This condition will always return 'false' since the types '"none"' and '"credit_details"' have no overlap. */}
      {expand === EXPAND.CREDIT_DETAILS && (
        <div className="section post__info--credit-details">
          {/* @ts-expect-error - TS2741 (ts-migration) */}
          <FileValues uri={uri} />
        </div>
      )}

      {/* @ts-expect-error - TS2367 - This condition will always return 'false' since the types '"none"' and '"file_details"' have no overlap. */}
      {expand === EXPAND.FILE_DETAILS && (
        <div className="section post__info--credit-details">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <ClaimTags uri={uri} type="large" />
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <FileDetails uri={uri} />
        </div>
      )}

      {/* @ts-expect-error - TS2322 (ts-migration) */}
      <ClaimAuthor uri={uri} />

      <div className="file-render--post-container">
        <FileRenderInitiator uri={uri} />
        <FileRenderInline uri={uri} />
      </div>
      <FileActions uri={uri} />
    </div>
  );
}

export default PostViewer;
