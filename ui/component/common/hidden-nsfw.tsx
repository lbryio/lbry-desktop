import * as PAGES from "constants/pages";
import * as ICONS from "constants/icons";
import React from "react";
import Button from "component/button";
import Icon from "component/common/icon";
import I18nMessage from "component/i18nMessage";

type Props = {
  type?: string;
};

export default function HiddenNsfw(props: Props) {
  const { type = "page" } = props;

  return (
    <div className="section--padded section__subtitle">
      <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
      {/* @ts-expect-error - TS2745 (ts-migration) */}
      <I18nMessage
        // @ts-expect-error - TS2322 (ts-migration)
        tokens={{
          type,
          // @ts-expect-error - TS2322 (ts-migration)
          settings: <Button button="link" label={__("settings")} navigate={`/$/${PAGES.SETTINGS}`} />,
        }}
      >
        Content may be hidden on this %type% because of your %settings%.
      </I18nMessage>
    </div>
  );
}
