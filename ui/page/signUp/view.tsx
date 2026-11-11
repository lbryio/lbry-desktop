import React from "react";
import UserSignUp from "component/userSignUp";
import Page from "component/page";

export default function SignUpPage() {
  return (
    // @ts-expect-error - TS2322 (ts-migration)
    <Page authPage noFooter>
      {/* @ts-expect-error - TS2740 (ts-migration) */}
      <UserSignUp />
    </Page>
  );
}
