import * as React from "react";
import { render } from "@testing-library/react";
import { Element } from "../Element";

describe("Element", () => {
    it("creates expected element", () => {
        const ref = React.createRef<HTMLDivElement>();
        expect(ref.current).toBeNull();
        render(<Element tagName="div" domRef={ref} className="clsA clsB" />);
        expect(ref.current).toMatchInlineSnapshot(`
            <div
              class="clsA clsB"
            />
        `);
    });

    it("creates expected element with array of children", () => {
        const subject = render(
            <Element tagName="span" data-test-id="testId">
                {["childA", "childB"]}
            </Element>,
        );
        expect(subject.getByTestId("testId")).toMatchInlineSnapshot(`
            <span
              data-test-id="testId"
            >
              childA
              childB
            </span>
        `);
    });

    it("creates element with children multiple nodes", () => {
        const subject = render(
            <Element tagName="span" data-test-id="testId">
                <>{"childA"}</>
                <>{"childB"}</>
            </Element>,
        );
        expect(subject.getByTestId("testId")).toMatchInlineSnapshot(`
            <span
              data-test-id="testId"
            >
              childA
              childB
            </span>
        `);
    });

    it("creates element with children single nodes", () => {
        const subject = render(
            <Element tagName="span" data-test-id="testId">
                {"childA"}
            </Element>,
        );
        expect(subject.getByTestId("testId")).toMatchInlineSnapshot(`
            <span
              data-test-id="testId"
            >
              childA
            </span>
        `);
    });
});
