/**
 * @jest-environment jsdom
 */
// #714: the Apply and Reset buttons' `disabled` used to pass a boolean into convertGbToMbStr when the
// input was empty, so Reset was disabled by accident when the saved limit was exactly 1 GB.
import * as React from "react";
import { act, render } from "@testing-library/react";

// Render the FormField's inputButton and keep its onChange so a test can type into the field.
let typeIntoField: (value: string) => void = () => {};
jest.mock("component/common/form", () => ({
  __esModule: true,
  FormField: (p: any) => {
    if (p.name === "content_blob_limit_gb")
      typeIntoField = p.onChange ? (v: string) => p.onChange({ target: { value: v } }) : () => {};
    return p.inputButton || null;
  },
}));
jest.mock("component/button", () => ({
  __esModule: true,
  default: (p: any) => <button aria-label={p["aria-label"]} disabled={Boolean(p.disabled)} />,
}));

import SettingViewHosting from "component/settingViewHosting/view";

const props = (overrides: Record<string, any> = {}): any => ({
  viewBlobSpace: 0,
  viewHostingLimit: 2048, // 2 GB, in MB like the daemon setting
  isSetting: false,
  disabled: false,
  setDaemonSetting: jest.fn(),
  cleanBlobs: jest.fn(),
  getDaemonStatus: jest.fn(),
  diskSpace: { total: 1000000, free: 900000 },
  ...overrides,
});

function setup(overrides = {}) {
  const utils = render(<SettingViewHosting {...props(overrides)} />);
  const button = (label: string) => utils.getByLabelText(label) as HTMLButtonElement;
  const type = (value: string) => act(() => typeIntoField(value));
  return { button, type };
}

describe("view hosting buttons", () => {
  it("are both disabled while the input matches the saved limit", () => {
    const { button } = setup();
    expect(button("Apply").disabled).toBe(true);
    expect(button("Reset").disabled).toBe(true);
  });

  it("enable once the input differs from the saved limit", () => {
    const { button, type } = setup();
    type("3");
    expect(button("Apply").disabled).toBe(false);
    expect(button("Reset").disabled).toBe(false);
  });

  it("disable Apply but keep Reset usable when the input is cleared", () => {
    const { button, type } = setup();
    type("");
    expect(button("Apply").disabled).toBe(true);
    expect(button("Reset").disabled).toBe(false);
  });

  // The old condition compared the saved limit to convertGbToMbStr(true) === "1024" here.
  it("keeps Reset usable when the input is cleared and the saved limit is exactly 1 GB", () => {
    const { button, type } = setup({ viewHostingLimit: 1024 });
    type("");
    expect(button("Reset").disabled).toBe(false);
    expect(button("Apply").disabled).toBe(true);
  });

  it("disable both while a setting is being saved", () => {
    const { button, type } = setup({ isSetting: true });
    type("3");
    expect(button("Apply").disabled).toBe(true);
    expect(button("Reset").disabled).toBe(true);
  });
});
