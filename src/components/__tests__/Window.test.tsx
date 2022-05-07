import * as React from "react";
import { render } from "@testing-library/react";
import * as useWindow from "../../hooks/useWindow";
import * as usePortal from "../../hooks/usePortal";
import { Window } from "../Window";

const useWindowSpy = jest.spyOn(useWindow, "useWindow");
const usePortalSpy = jest.spyOn(usePortal, "usePortal");

describe("Window", () => {
  const documentBodyMock = document.createElement("body");
  const windowMock = {
    document: {
      body: documentBodyMock,
    },
  } as unknown as Window;
  const portalMock = (<div id="portal-mock" />) as React.ReactPortal;

  beforeEach(() => {
    useWindowSpy.mockReturnValue(windowMock);
    usePortalSpy.mockReturnValue(portalMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("handles window failing to open successfully", () => {
    useWindowSpy.mockReturnValue(null);
    const childRef = React.createRef<HTMLDivElement>();
    const children = <div ref={childRef}>{"children"}</div>;
    render(<Window>{children}</Window>);

    expect(useWindowSpy).toHaveBeenCalledTimes(1);
    expect(useWindowSpy).toHaveBeenCalledWith({});
    expect(usePortalSpy).toHaveBeenCalledTimes(1);
    expect(usePortalSpy).toHaveBeenCalledWith({
      source: children,
    });
  });

  it("renders children in window via portal", () => {
    const childRef = React.createRef<HTMLDivElement>();
    const children = <div ref={childRef}>{"children"}</div>;
    const windowProps = { url: "https://example.com" };
    const subject = render(<Window {...windowProps}>{children}</Window>);

    expect(useWindowSpy).toHaveBeenCalledTimes(1);
    expect(useWindowSpy).toHaveBeenCalledWith(windowProps);
    expect(usePortalSpy).toHaveBeenCalledTimes(1);
    expect(usePortalSpy).toHaveBeenCalledWith({
      source: children,
      target: documentBodyMock,
    });

    expect(subject.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            id="portal-mock"
          />
        </div>
      </body>
    `);
    expect(childRef.current?.ownerDocument).toMatchInlineSnapshot(`undefined`);
  });
});
