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

  it("renders children in window via portal", () => {
    const childRef = React.createRef<HTMLDivElement>();
    const subject = render(
      <Window>
        <div ref={childRef}>{"children"}</div>
      </Window>,
    );
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
