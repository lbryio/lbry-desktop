import type { ReactNode } from "react";
import * as ICONS from "constants/icons";
import classnames from "classnames";
import React from "react";
import Button from "component/button";

type Props = {
  message: string | React.ReactNode;
  actionText?: string;
  href?: string;
  type?: string;
  inline?: boolean;
  relative?: boolean;
  onClick?: () => void;
  onClose?: () => void;
};

export default function Nag(props: Props) {
  const { message, actionText, href, onClick, onClose, type, inline, relative } = props;

  const buttonProps = onClick ? { onClick } : { href };

  return (
    <div
      className={classnames("nag", {
        "nag--helpful": type === "helpful",
        "nag--error": type === "error",
        "nag--inline": inline,
        "nag--relative": relative,
      })}
    >
      <div className="nag__message">{message}</div>
      {(href || onClick) && (
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={classnames("nag__button", {
            "nag__button--helpful": type === "helpful",
            "nag__button--error": type === "error",
          })}
          {...buttonProps}
        >
          {actionText}
        </Button>
      )}
      {onClose && (
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={classnames("nag__button nag__close", {
            "nag__button--helpful": type === "helpful",
            "nag__button--error": type === "error",
          })}
          icon={ICONS.REMOVE}
          onClick={onClose}
        />
      )}
    </div>
  );
}
