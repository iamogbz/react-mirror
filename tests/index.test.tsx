import * as React from "react";
// import { act } from "react-test-renderer";
import { prettyDOM } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Mirror, useMirror } from "../src";

describe("Hook", (): void => {
    it("returns an empty reflection", (): void => {
        const { result } = renderHook(() => useMirror());
        const [, reflection] = result.current;
        expect(reflection).toMatchSnapshot();
    });

    it("starts reflecting node", (): void => {
        const { result } = renderHook(() => useMirror());
        const [ref] = result.current;
        act(() => void ref(document.createElement("div")));
        const [, reflection] = result.current;
        expect(reflection).toMatchSnapshot();
    });
});

describe("Component", (): void => {
    beforeAll(() => {
        jest.spyOn(Math, "random").mockReturnValue(0.123456789);
    });
    afterEach(cleanup);
    afterAll(jest.restoreAllMocks);

    it("frames an empty reflection", (): void => {
        const result = render(
            <Mirror className="test-mirror-frame" reflect={null} />,
        );
        expect(result.baseElement).toMatchSnapshot();
    });

    it("renders reflection with styles", () => {
        /** add document style */
        const domStyle = document.createElement("style");
        document.head.appendChild(domStyle);
        domStyle.innerHTML = `
            body {
                font-family: "san-serif";
                font-size: 1.2em;
            }
            .classOne {
                height: 10px;
            }
            .classTwo {
                font-size: 1.3em;
                display: block;
                width: 40px;
                margin: 0 auto;
            }
            .classThree::after {
                content: '';
                background: red;
                width: 5px;
                height: 5px;
            }
            .classOne .classTwo {
                width: 20px;
            }
        `;
        /** add nodes that will be mirrored mirror */
        const domNode = document.createElement("div");
        document.body.appendChild(domNode);
        const node1 = document.createElement("div");
        domNode.appendChild(node1);
        node1.className = "classOne";
        const node2 = document.createElement("span");
        node1.appendChild(node2);
        node2.className = "classTwo";
        const node3 = document.createElement("p");
        domNode.appendChild(node3);
        node3.innerHTML = "Mock text node";
        node3.className = "classThree";
        /** mirror nodes and check results */
        const result = render(<Mirror reflect={domNode} />);
        expect(result.baseElement).toMatchSnapshot();
        /** clean up */
        domStyle.remove();
        domNode.remove();
    });
});
