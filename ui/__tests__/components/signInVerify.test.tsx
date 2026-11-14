/**
 * @jest-environment jsdom
 */
// The email sign-in link page (#607). Google's reCAPTCHA must not load until
// the user agrees to it, and the one-time sign-in link must be confirmed once.
import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

const mockCall = jest.fn();
jest.mock("lbryinc", () => ({
  __esModule: true,
  Lbryio: { call: (...args: any[]) => mockCall(...args) },
}));

// Stands in for Google's widget: mounting it is what loads Google's script.
const mockRecaptchaMounted = jest.fn();
let mockRecaptchaProps: any = null;
// A class rather than a hook, because react-refresh's Babel transform breaks
// hooks inside jest.mock factories.
jest.mock("react-google-recaptcha", () => {
  const MockReact = require("react");
  class MockReCAPTCHA extends MockReact.Component {
    componentDidMount() {
      mockRecaptchaMounted();
    }
    render() {
      mockRecaptchaProps = this.props;
      return MockReact.createElement("div", { "data-testid": "recaptcha" });
    }
  }
  return { __esModule: true, default: MockReCAPTCHA };
});

jest.mock("react-router", () => ({ withRouter: (component: any) => component }));

jest.mock("component/page", () => {
  const MockReact = require("react");
  return { __esModule: true, default: (props: any) => MockReact.createElement("div", null, props.children) };
});

jest.mock("component/common/card", () => {
  const MockReact = require("react");
  return {
    __esModule: true,
    default: (props: any) =>
      MockReact.createElement(
        "div",
        null,
        MockReact.createElement("h1", null, props.title),
        props.subtitle,
        props.actions
      ),
  };
});

jest.mock("component/button", () => {
  const MockReact = require("react");
  return {
    __esModule: true,
    default: (props: any) =>
      props.href
        ? MockReact.createElement("a", { href: props.href }, props.label)
        : MockReact.createElement("button", { onClick: props.onClick, type: "button" }, props.label),
  };
});

jest.mock("component/i18nMessage", () => {
  const MockReact = require("react");
  return { __esModule: true, default: (props: any) => MockReact.createElement("span", null, props.children) };
});

import SignInVerifyPage from "page/signInVerify/view";

const LINK = "?auth_token=AT&email=me%40example.com&verification_token=VT";

function setup(search: string) {
  const push = jest.fn();
  const doToast = jest.fn();
  const utils = render(<SignInVerifyPage {...({ history: { push, location: { search } }, doToast } as any)} />);
  return { push, doToast, ...utils };
}

// Let pending promise callbacks (the confirm call's .then) run.
const flush = () => act(() => Promise.resolve());

beforeEach(() => {
  mockCall.mockReset();
  mockCall.mockResolvedValue({});
  mockRecaptchaMounted.mockReset();
  mockRecaptchaProps = null;
});

describe("sign-in link without a captcha", () => {
  it("confirms the link once and shows success", async () => {
    const { doToast, push } = setup(LINK);
    await flush();
    await flush();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith("user_email", "confirm", {
      auth_token: "AT",
      email: "me@example.com",
      verification_token: "VT",
    });
    expect(screen.getByText("Log in success!")).toBeTruthy();
    expect(doToast).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("doesn't confirm again on re-render (the link is single use)", async () => {
    const { rerender, push, doToast } = setup(LINK);
    await flush();
    for (let i = 0; i < 3; i++) {
      rerender(<SignInVerifyPage {...({ history: { push, location: { search: LINK } }, doToast } as any)} />);
    }
    await flush();

    expect(mockCall).toHaveBeenCalledTimes(1);
  });

  it("never loads Google's reCAPTCHA", async () => {
    setup(LINK);
    await flush();
    expect(mockRecaptchaMounted).not.toHaveBeenCalled();
  });
});

describe("sign-in link that needs a captcha", () => {
  const CAPTCHA_LINK = `${LINK}&needs_recaptcha=true`;

  it("doesn't contact Google until the user agrees", async () => {
    setup(CAPTCHA_LINK);
    await flush();

    expect(mockRecaptchaMounted).not.toHaveBeenCalled();
    expect(mockCall).not.toHaveBeenCalled();
    expect(screen.getByText(/sends your IP address and browser details to Google/)).toBeTruthy();
  });

  it("loads the captcha after the user agrees, and confirms with its token", async () => {
    setup(CAPTCHA_LINK);
    fireEvent.click(screen.getByText("Continue with Google reCAPTCHA"));

    expect(mockRecaptchaMounted).toHaveBeenCalledTimes(1);
    expect(mockCall).not.toHaveBeenCalled();

    act(() => mockRecaptchaProps.onChange("captcha-token"));
    await flush();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(mockCall).toHaveBeenCalledWith("user_email", "confirm", {
      auth_token: "AT",
      email: "me@example.com",
      verification_token: "VT",
      recaptcha: "captcha-token",
    });
    expect(screen.getByText("Log in success!")).toBeTruthy();
  });

  it("goes back to sign-in, without loading Google, if the user declines", () => {
    const { push } = setup(CAPTCHA_LINK);
    fireEvent.click(screen.getByText("Cancel"));

    expect(push).toHaveBeenCalledWith("/$/signup");
    expect(mockRecaptchaMounted).not.toHaveBeenCalled();
    expect(mockCall).not.toHaveBeenCalled();
  });

  it("only hints about ad blockers once the captcha was requested and hasn't appeared", () => {
    jest.useFakeTimers();
    try {
      setup(CAPTCHA_LINK);
      act(() => jest.advanceTimersByTime(5000));
      expect(screen.queryByText(/Not seeing a captcha/)).toBeNull();

      fireEvent.click(screen.getByText("Continue with Google reCAPTCHA"));
      act(() => jest.advanceTimersByTime(2500));
      expect(screen.queryByText(/Not seeing a captcha/)).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("broken sign-in link", () => {
  it("reports it once and returns to sign-in", async () => {
    const { doToast, push } = setup("?email=me%40example.com");
    await flush();

    expect(doToast).toHaveBeenCalledTimes(1);
    expect(doToast).toHaveBeenCalledWith({ message: "Invalid or expired sign-in link.", isError: true });
    expect(push).toHaveBeenCalledWith("/$/signup");
  });
});
