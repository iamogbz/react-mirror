import { render } from "@testing-library/react";
import * as React from "react";

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

  it("does not preserve ghost value on input element", () => {
    const domRef = React.createRef<HTMLInputElement>();
    const initialValue = "initial value";
    /*
     * Warning: You provided a `value` prop to a form field without an `onChange` handler.
     * This will render a read-only field. If the field should be mutable use `defaultValue`.
     * Otherwise, set either `onChange` or `readOnly`.
     */
    const { rerender } = render(
      <Element domRef={domRef} tagName="input" value={initialValue} />,
    );
    expect(domRef.current?.value).toEqual(initialValue);
    /*
     * Warning: A component is changing a controlled input to be uncontrolled.
     * This is likely caused by the value changing from a defined to undefined, which should not happen.
     * Decide between using a controlled or uncontrolled input element for the lifetime of the component.
     * More info: https://reactjs.org/link/controlled-components
     */
    rerender(<Element domRef={domRef} tagName="input" />);
    expect(domRef.current?.value).toHaveLength(0);
  });
});
