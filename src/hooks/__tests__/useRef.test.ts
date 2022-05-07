import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { useCallbackRef } from "../useRef";

describe("useCallbackRef", () => {
  it("sets value to undefined or else", async () => {
    const hook = renderHook(useCallbackRef);
    expect(hook.result.current[0]).toBeUndefined();

    const expectedValue = "value";
    await act(async () => {
      hook.result.current[1](expectedValue);
    });
    expect(hook.result.current[0]).toBe(expectedValue);

    await act(async () => {
      hook.result.current[1](null);
    });
    expect(hook.result.current[0]).toBeUndefined();
  });
});
