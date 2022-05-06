import * as React from "react";
import { act, prettyDOM, render } from "@testing-library/react";
import { Frame } from "../Frame";

describe("Frame", () => {
    const addDocumentStyles = () => {
        const domStyle = document.createElement("style");
        document.head.appendChild(domStyle);
        domStyle.innerHTML = `
            @charset "utf-8";
            @font-face {
                font-family: "Open Sans";
            }
            body, .mirrorFrame:not(*) {
                font-family: "san-serif";
                font-size: 1.2em;
            }
            :is(::after), ::before {
                position: absolute;
            }
            :where(::slotted(span)) {
                border: none;
            }
            ::after {
                content: '';
            }
            .mirrorFrame::before {
                content: 'mock text';
            }
            .class1.one, .class2.two {
                height: 10px;
            }
            .class2.two {
                font-size: 1.3em;
                display: block;
                width: 40px;
                margin: 0 auto;
            }
            .class3.three::after {
                background: red;
                width: 5px;
                height: 5px;
            }
            .class1.one[attr^="[val"] .class2.two {
                width: 20px;
            }
        `;
        return domStyle;
    };

    const getExpectedContent = ({
        includeRules = false,
    }: {
        includeRules: boolean;
    }) => {
        const expectedRules = `
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
    `;
        const expectedContent = `<html>
  <head />
  <body>
    <link
      href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
      rel="stylesheet"
    />
    ${includeRules ? "<style>" + expectedRules + "</style>" : "<style />"}
    <div>
      child text
    </div>
  </body>
</html>`;
        return expectedContent;
    };

    it("creates frame element with styles and children", async () => {
        // add document styles to be cloned
        const domStyle = addDocumentStyles();

        const subject = render(
            <Frame data-test-id="testId">
                <div>{"child text"}</div>
            </Frame>,
        );
        const iframe = subject.getByTestId("testId") as HTMLIFrameElement;

        const getContentHtml = () =>
            prettyDOM(iframe.contentDocument ?? undefined, undefined, {
                highlight: false,
                filterNode: Boolean,
            });

        expect(iframe).toMatchInlineSnapshot(`
            <iframe
              data-test-id="testId"
            />
        `);

        expect(getContentHtml()).toEqual(
            getExpectedContent({ includeRules: true }),
        );

        await act(async () => {
            domStyle.remove();
        });

        expect(getContentHtml()).toEqual(
            getExpectedContent({ includeRules: false }),
        );
    });
});
