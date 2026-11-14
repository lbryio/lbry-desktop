import React from "react";
import Button from "component/button";
import I18nMessage from "component/i18nMessage";

type Props = {
  numberOfHiddenClaims: number;
  obscureNsfw: boolean;
  className: string | null | undefined;
};

export default (props: Props) => {
  const { numberOfHiddenClaims: number, obscureNsfw } = props;

  return (
    obscureNsfw &&
    Boolean(number) && (
      <div className="section--padded section__subtitle">
        {/* @ts-expect-error - TS2745 (ts-migration) */}
        <I18nMessage
          // @ts-expect-error - TS2322 (ts-migration)
          tokens={{
            content_viewing_preferences_link: (
              // @ts-expect-error - TS2322 (ts-migration)
              <Button button="link" navigate="/$/settings" label={__("content viewing preferences")} />
            ),
            number: number,
          }}
        >
          {number > 1
            ? "%number% files hidden due to your %content_viewing_preferences_link%"
            : "1 file hidden due to your %content_viewing_preferences_link%"}
        </I18nMessage>
      </div>
    )
  );
};
