import { act, renderHook } from "@testing-library/react";
import { useRenderTrigger } from "../useRenderTrigger";

describe("useRenderTrigger", () => {
  it("count number of triggered renders", () => {
    const hook = renderHook(useRenderTrigger);
    expect(hook.result.current.count).toEqual(1);
    act(hook.result.current.rerender);
    expect(hook.result.current.count).toEqual(2);
    act(hook.result.current.rerender);
    act(hook.result.current.rerender);
    expect(hook.result.current.count).toEqual(4);
  });
});
