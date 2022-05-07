import * as React from "react";
import * as ReactDOM from "react-dom";
import { act, render } from "@testing-library/react";
import { addDomNode } from "../../__mocks__";
import * as useDimensions from "../../hooks/useDimensions";
import { Mirror } from "../Mirror";

describe("Mirror", () => {
    const mathRandomSpy = jest.spyOn(Math, "random");
    const useDimensionsSpy = jest.spyOn(useDimensions, "useDimensions");

    beforeEach(() => {
        mathRandomSpy.mockReturnValue(0.123456789);
        useDimensionsSpy.mockReturnValue(new DOMRect());
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

    it("frames an empty reflection when find node errors", () => {
        const expectedError = Error("Expected test error");
        const findDOMNodeSpy = jest
            .spyOn(ReactDOM, "findDOMNode")
            .mockImplementation(() => {
                throw expectedError;
            });
        const consoleWarnSpy = jest
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        const subject = render(<Mirror />);

        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenLastCalledWith(expectedError);
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <iframe
                  height="0"
                  id="4fzzzxj"
                  width="0"
                />
              </div>
            </body>
        `);

        findDOMNodeSpy.mockRestore();
    });

    it("renders reflection with styles", async () => {
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
                  <input
                    class="class2 two"
                  />
                </div>
                text content
              </div>
              <div>
                <iframe
                  class="mirrorFrame"
                  data-test-id="mirrorFrame"
                  height="0"
                  id="4fzzzxj"
                  width="0"
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
                <style
                  id="parent-document-mirror-stylesheets"
                />
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
                    <input
                      class="class2 two"
                      readonly=""
                      style="pointer-events: none;"
                      value="input-value"
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
