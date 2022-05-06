import * as React from "react";
import { act, render } from "@testing-library/react";
import * as useDimensions from "../../hooks/useDimensions";
import { Mirror } from "../Mirror";
import { addDomNode } from "./__mocks__";

describe("Mirror", () => {
    const mathRandomSpy = jest.spyOn(Math, "random");
    const useDimensionsSpy = jest.spyOn(useDimensions, "useDimensions");

    beforeEach(() => {
        mathRandomSpy.mockReturnValueOnce(0.123456789);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("frames an empty reflection", () => {
        const subject = render(
            <Mirror
                frameProps={{
                    className: "mirror-frame-cls",
                    id: "mirror-frame-id",
                }}
            />,
        );
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <iframe
                  class="mirror-frame-cls"
                  height="0"
                  id="mirror-frame-id"
                  width="0"
                />
              </div>
            </body>
        `);
    });

    it("renders reflection with styles", async () => {
        useDimensionsSpy.mockReturnValue(new DOMRect(0, 0, 144, 48));
        /** add nodes that will be mirrored */
        const domNode = addDomNode();
        /** test reflection */
        const frameId = "mirrorFrame";
        const renderProps = {
            frameProps: { className: frameId, "data-test-id": frameId },
            reflect: domNode,
        };

        const subject = render(<Mirror {...renderProps} />);
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <div
                  attr="[value"
                  class="class1 one"
                >
                  <span
                    class="class2 two"
                  />
                </div>
                text content
              </div>
              <div>
                <iframe
                  class="mirrorFrame"
                  data-test-id="mirrorFrame"
                  height="48"
                  id="4fzzzxj"
                  width="144"
                />
              </div>
            </body>
        `);

        const iframe = subject.getByTestId(frameId) as HTMLIFrameElement;
        expect(iframe.contentDocument?.firstElementChild)
            .toMatchInlineSnapshot(`
            <html>
              <head />
              <body>
                <link
                  href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
                  rel="stylesheet"
                />
                <style />
                <div
                  class=""
                  readonly=""
                  style="pointer-events: none;"
                >
                  <div
                    attr="[value"
                    class="class1 one"
                    readonly=""
                    style="pointer-events: none;"
                  >
                    <span
                      class="class2 two"
                      readonly=""
                      style="pointer-events: none;"
                    />
                  </div>
                  text content
                </div>
              </body>
            </html>
        `);
        /** clean up */
        await act(async () => {
            domNode.remove();
        });
    });
});
