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
    it("frames an empty reflection", (): void => {
        expect(shallow(<Mirror reflect={null} />)).toMatchSnapshot();
    });

    it("renders reflection with styles", () => {
        const domNode = document.createElement("div");
        const wrapper = mount(<Mirror reflect={domNode} />);
        expect(wrapper).toMatchSnapshot();
    });
});
