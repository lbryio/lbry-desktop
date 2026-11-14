import React from "react";
import SelectChannel from "component/selectChannel";
import Button from "component/button";
import * as ICONS from "constants/icons";

type Props = {
  isReply: boolean;
  advancedHandler: () => void;
  advanced: boolean;
};

export default function CommentCreateHeader(props: Props) {
  const { isReply, advancedHandler, advanced } = props;

  return (
    <div className="comment-create__header">
      <div className="comment-create__label-wrapper">
        <span className="comment-create__label">{(isReply ? __("Replying as") : __("Comment as")) + " "}</span>
        {/* @ts-expect-error - TS2739 (ts-migration) */}
        <SelectChannel tiny />
      </div>
      <div className="form-field__quick-action">
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          button="alt"
          icon={advanced ? ICONS.SIMPLE_EDITOR : ICONS.ADVANCED_EDITOR}
          onClick={advancedHandler}
          aria-label={isReply ? undefined : advanced ? __("Simple Editor") : __("Advanced Editor")}
        />
      </div>
    </div>
  );
}
