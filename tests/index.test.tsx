import * as React from "react";
import { act } from "react-test-renderer";
import { renderHook } from "@testing-library/react-hooks";
import { shallow, mount } from "enzyme";
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
    afterAll(jest.restoreAllMocks);

    it("frames an empty reflection", (): void => {
        expect(shallow(<Mirror reflect={null} />)).toMatchSnapshot();
    });

    it.only("renders reflection with styles", () => {
        const domStyle = document.createElement("style");
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
        document.head.appendChild(domStyle);

        const domNode = document.createElement("div");
        const node1 = document.createElement("div");
        node1.className = "classOne";
        const node2 = document.createElement("span");
        node2.className = "classTwo";
        node1.appendChild(node2);
        domNode.appendChild(node1);
        document.body.appendChild(domNode);

        const attachTo = document.createElement("div");
        attachTo.id = "test-node-mirror";
        document.body.appendChild(attachTo);
        const wrapper = mount(<Mirror reflect={domNode} />, { attachTo });

        expect(document.body).toMatchSnapshot();

        const node3 = document.createElement("p");
        node3.innerHTML = "Mock text node";
        node3.className = "classThree";
        domNode.appendChild(node3);
    });
});
