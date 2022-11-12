import { renderHook, RenderHookResult } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";

import { useCallbackRef, useRefs, UseRefsResult } from "../useRef";

const verifyCallbackHookBehaviour = async (
  hook: RenderHookResult<UseRefsResult<unknown>, never>,
) => {
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
};

describe("useCallbackRef", () => {
  it("sets value to undefined or else", async () => {
    const hook = renderHook(useCallbackRef);
    await verifyCallbackHookBehaviour(hook);
  });
});

describe("useRefs", () => {
  it("returns callback ref when no refs passed", async () => {
    const hook = renderHook(useRefs);
    await verifyCallbackHookBehaviour(hook);
  });

  it("sets all provided refs when callback ref is used", async () => {
    const objectRef = React.createRef();
    const callbackRef = jest.fn((_: string) => undefined);

    expect(objectRef.current).toBeNull();
    expect(callbackRef).not.toHaveBeenCalled();

    const hook = renderHook(() =>
      useRefs(callbackRef, null, undefined, objectRef),
    );

    const final = "expectedValue";
    await act(async () => void hook.result.current[1](final));

    expect(objectRef.current).toEqual(final);
    expect(callbackRef).toHaveBeenCalledTimes(1);
    expect(callbackRef).toHaveBeenLastCalledWith(final);
  });
});
