import * as ACTIONS from "constants/action_types";

const mockAddressUnused = jest.fn();
jest.mock("lbry", () => ({
  __esModule: true,
  default: { address_unused: (...args: any[]) => mockAddressUnused(...args) },
}));
const mockToast = jest.fn((options: any) => ({ type: "TOAST", options }));
jest.mock("redux/actions/notifications", () => ({ doToast: (options: any) => mockToast(options) }));
jest.mock("lbryinc", () => ({ Lbryio: {} }));
jest.mock("redux/selectors/wallet", () => ({ selectReceiveAddress: (state: any) => state.receiveAddress }));

import { doGetNewAddress } from "../../redux/actions/wallet";

function run(thunk: any, state: any) {
  const dispatched: any[] = [];
  const result = thunk(
    (action: any) => dispatched.push(action),
    () => state
  );
  return { dispatched, done: () => new Promise((resolve) => setImmediate(resolve)) };
}

beforeEach(() => jest.clearAllMocks());

describe("doGetNewAddress", () => {
  it("asks for any unused address by default", async () => {
    mockAddressUnused.mockResolvedValue("bNEW");
    const { dispatched, done } = run(doGetNewAddress(), { receiveAddress: "bOLD" });
    await done();
    expect(mockAddressUnused).toHaveBeenCalledWith({});
    expect(dispatched.map((a) => a.type)).toEqual([ACTIONS.GET_NEW_ADDRESS_STARTED, ACTIONS.GET_NEW_ADDRESS_COMPLETED]);
    expect(dispatched[1].data.address).toBe("bNEW");
  });

  it("asks for a different address than the one shown when forced", async () => {
    mockAddressUnused.mockResolvedValue("bNEXT");
    const { dispatched, done } = run(doGetNewAddress(true), { receiveAddress: "bOLD" });
    await done();
    expect(mockAddressUnused).toHaveBeenCalledWith({ exclude: "bOLD" });
    expect(dispatched[1].data.address).toBe("bNEXT");
  });

  it("does not exclude anything when no address is shown yet", async () => {
    mockAddressUnused.mockResolvedValue("bFIRST");
    const { done } = run(doGetNewAddress(true), { receiveAddress: "" });
    await done();
    expect(mockAddressUnused).toHaveBeenCalledWith({});
  });

  it("keeps the shown address, re-enables the button and says what went wrong when it fails", async () => {
    mockAddressUnused.mockRejectedValue(new Error("hub down"));
    const { dispatched, done } = run(doGetNewAddress(true), { receiveAddress: "bOLD" });
    await done();
    expect(dispatched.map((a) => a.type)).toEqual([
      ACTIONS.GET_NEW_ADDRESS_STARTED,
      ACTIONS.GET_NEW_ADDRESS_COMPLETED,
      "TOAST",
    ]);
    expect(dispatched[1].data.address).toBe("bOLD");
    expect(dispatched[2].options).toMatchObject({ isError: true });
    expect(dispatched[2].options.message).toContain("hub down");
  });
});
