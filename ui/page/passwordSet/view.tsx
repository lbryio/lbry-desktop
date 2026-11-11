import React from "react";
import UserPasswordSet from "component/userPasswordSet";
import Page from "component/page";

export default function PasswordSetPage() {
  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page authPage>
      {/* @ts-expect-error - TS2322, TS2739 (ts-migration) */}
      <UserPasswordSet />
    </Page>
  );
}
