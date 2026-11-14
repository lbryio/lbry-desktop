import * as ICONS from "constants/icons";
import React from "react";
import Icon from "component/common/icon";
import * as COL from "constants/collections";

type Props = {
  claim: Claim;
  small: boolean;
};

function ClaimType(props: Props) {
  const { claim, small } = props;
  const { value_type: claimType } = claim || {};

  const size = small ? COL.ICON_SIZE : undefined;

  if (claimType === "collection") {
    return <Icon size={size} icon={ICONS.STACK} />;
  } else if (claimType === "channel") {
    return <Icon size={size} icon={ICONS.CHANNEL} />;
    // @ts-expect-error - TS2367 - This condition will always return 'false' since the types '"stream"' and '"repost"' have no overlap.
  } else if (claimType === "repost") {
    return <Icon size={size} icon={ICONS.REPOST} />;
  }

  return <Icon icon={ICONS.DOWNLOADABLE} />;
}

export default ClaimType;
