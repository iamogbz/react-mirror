import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { addDomNode } from "../../__mocks__";
import * as useObserver from "../useObserver";
import { useDimensions } from "../useDimensions";

const useObserverSpy = jest.spyOn(useObserver, "useObserver");

describe("useDimension", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns empty dimension for nothing", () => {
    const { result } = renderHook(() => useDimensions());
    expect(result.current).toMatchInlineSnapshot(`
            DOMRect {
              "bottom": 0,
              "height": 0,
              "left": 0,
              "right": 0,
              "top": 0,
              "width": 0,
              "x": 0,
              "y": 0,
            }
        `);
  });

  it("returns dimension for rendered text node", async () => {
    document.body.style.fontSize = "18px";
    const textNode = document.createTextNode("text content");
    document.body.appendChild(textNode);

    const rangeMock = new Range();
    const rectMockA = new DOMRect(0, 0, 144, 48);
    const getBoundingClientRectSpy = jest
      .spyOn(rangeMock, "getBoundingClientRect")
      .mockReturnValueOnce(rectMockA);
    jest.spyOn(document, "createRange").mockReturnValue(rangeMock);

    const { result } = renderHook(() => useDimensions(textNode));
    expect(result.current).toEqual(rectMockA);

    expect(useObserverSpy).toHaveBeenLastCalledWith({
      ObserverClass: MutationObserver,
      initOptions: {
        characterData: true,
      },
      onUpdate: expect.any(Function),
      target: textNode,
    });

    const rectMockB = new DOMRect(0, 0, 132, 36);
    getBoundingClientRectSpy.mockReturnValueOnce(rectMockB);
    await act(async () => {
      //@ts-expect-error observer callback arguments
      useObserverSpy.mock.calls[0][0].onUpdate();
    });
    expect(result.current).toEqual(rectMockB);
  });

  it("returns dimension for rendered element", async () => {
    const domNode = addDomNode();
    const rectMockA = new DOMRect(0, 0, 156, 60);
    const getBoundingClientRectSpy = jest
      .spyOn(domNode, "getBoundingClientRect")
      .mockReturnValueOnce(rectMockA);

    const { result } = renderHook(() => useDimensions(domNode));
    expect(result.current).toEqual(rectMockA);

    expect(useObserverSpy).toHaveBeenLastCalledWith({
      ObserverClass: ResizeObserver,
      initOptions: {
        characterData: true,
      },
      onUpdate: expect.any(Function),
      target: domNode,
    });

    const rectMockB = new DOMRect(12, 12, 48, 144);
    getBoundingClientRectSpy.mockReturnValueOnce(rectMockB);
    await act(async () => {
      //@ts-expect-error observer callback arguments
      useObserverSpy.mock.calls[0][0].onUpdate();
    });
    expect(result.current).toEqual(rectMockB);

    await act(async () => void domNode.remove());
  });
});
