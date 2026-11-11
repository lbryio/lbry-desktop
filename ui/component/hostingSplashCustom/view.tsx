import React from "react";
import Button from "component/button";
import { Form } from "component/common/form-components/form";
import SettingStorage from "component/settingStorage";
import { withRouter } from "react-router-dom";

type Props = {
  handleNextPage: () => void;
  handleGoBack: () => void;
};

function HostingSplashCustom(props: Props) {
  const { handleNextPage, handleGoBack } = props;

  return (
    <section className="main--contained">
      <div className={"first-run__wrapper"}>
        {/* @ts-expect-error - TS2739 (ts-migration) */}
        <SettingStorage isWelcome />
        {/* @ts-expect-error - TS2769 - No overload matches this call. */}
        <Form onSubmit={handleNextPage} className="section__body">
          <div className={"card__actions"}>
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="primary" label={__(`Let's go`)} type="submit" />
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="link" label={__(`Go back`)} onClick={handleGoBack} />
          </div>
        </Form>
      </div>
    </section>
  );
}

export default withRouter(HostingSplashCustom);
