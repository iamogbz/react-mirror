import * as React from "react";
import { act, render } from "@testing-library/react";
import { addDomStyles } from "../../__mocks__";
import { Frame } from "../Frame";

describe("Frame", () => {
    it("creates frame element with styles and children", async () => {
        // add document styles to be cloned
        const domStyle = addDomStyles();

        const subject = render(
            <Frame data-test-id="testId">
                <div>{"child text"}</div>
            </Frame>,
        );
        const iframe = subject.getByTestId("testId") as HTMLIFrameElement;

        expect(iframe).toMatchInlineSnapshot(`
            <iframe
              data-test-id="testId"
            />
        `);

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
                >
                  .class1.one, .class2.two {height: 10px;}
                  .class1.one[attr^="[val"] .class2.two {width: 20px;}
                  .class2.two {font-size: 1.3em; display: block; width: 40px; margin: 0 auto;}
                  .class3.three::after {background: red; width: 5px; height: 5px;}
                  .mirrorFrame::before {content: 'mock text';}
                  ::after {content: '';}
                  :is(::after), ::before {position: absolute;}
                  :where(::slotted(span)) {border: none;}
                  @font-face {font-family: "Open Sans";}
                  body, .mirrorFrame:not(*) {font-family: "san-serif"; font-size: 1.2em;}
                </style>
                <div>
                  child text
                </div>
              </body>
            </html>
        `);

        await act(async () => {
            domStyle.remove();
        });

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
                <div>
                  child text
                </div>
              </body>
            </html>
        `);
    });
});
