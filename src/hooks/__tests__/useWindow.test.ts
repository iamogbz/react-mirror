import { renderHook } from "@testing-library/react";
import { useWindow } from "../useWindow";

describe("useWindow", () => {
  const windowOpen = window.open;
  const windowOpenMock = jest.fn();
  const windowMock = {
    addEventListener: jest.fn(),
  } as unknown as Window;

  beforeEach(() => {
    window.open = windowOpenMock;
    windowOpenMock.mockImplementation(() => ({ ...windowMock }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    window.open = windowOpen;
  });

  it("creates window with correct props", () => {
    const url = "https://example.com";
    const target = "Window Title";
    const hook = renderHook(() =>
      useWindow({
        features: {
          popup: "yes",
          height: 400,
          left: 0,
          noopener: true,
          noreferrer: true,
          width: 400,
          top: 12,
        },
        target,
        url,
      }),
    );

    expect(hook.result.current).toEqual(expect.objectContaining(windowMock));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hook.result.current!.onbeforeunload!(new Event("beforeunload"));
    expect(windowOpenMock).toHaveBeenCalledTimes(1);
    expect(windowOpenMock).toHaveBeenCalledWith(
      url,
      target,
      "height=400,left=0,noopener,noreferrer,popup,top=12,width=400",
    );
  });

  it("calls onClose before window is unloaded", () => {
    const onClose = jest.fn();
    const hook = renderHook(() => useWindow({ onClose }));
    expect(onClose).not.toHaveBeenCalled();
    hook.result.current?.onbeforeunload?.(new Event("beforeunload"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
