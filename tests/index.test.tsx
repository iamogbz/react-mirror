import * as React from "react";
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
        const { result } = renderHook(() =>
            useMirror({ className: "test-mirror", reflect: null }),
        );
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

    it("renders reflection with styles", async () => {
        /** add document style */
        const domStyle = document.createElement("style");
        document.head.appendChild(domStyle);
        domStyle.innerHTML = `
            body, .mirrorFrame {
                font-family: "san-serif";
                font-size: 1.2em;
            }
            .mirrorFrame::before {
                content: 'mock text';
                position: absolute;
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
                content: '';
                background: red;
                width: 5px;
                height: 5px;
            }
            .class1.one .class2.two {
                width: 20px;
            }
        `;
        /** add nodes that will be mirrored mirror */
        const domNode = document.createElement("div");
        document.body.appendChild(domNode);
        const node1 = document.createElement("div");
        domNode.appendChild(node1);
        node1.className = "class1 one";
        const node2 = document.createElement("span");
        node1.appendChild(node2);
        node2.className = "class2 two";
        /** render mirror into detached node */
        const spyReplace = jest.spyOn(HTMLElement.prototype, "replaceChild");
        const baseElement = document.createElement("div");
        const renderProps = { className: "mirrorFrame", reflect: domNode };
        render(<Mirror {...renderProps} />, { baseElement });
        /** add more nodes and check that they are inserted */
        expect(spyReplace).toHaveBeenCalledTimes(0);
        const node3 = document.createElement("p");
        domNode.appendChild(node3);
        node3.innerHTML = "Mock text node";
        node3.className = "class3 three";
        await new Promise(resolve => setTimeout(resolve));
        expect(spyReplace).toHaveBeenCalledTimes(1);
        /** mirror nodes and check results */
        const result = render(<Mirror {...renderProps} />);
        expect(result.baseElement).toMatchSnapshot();
        /** clean up */
        domStyle.remove();
        domNode.remove();
    });
});
