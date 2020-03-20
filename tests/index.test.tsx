import * as React from "react";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { Mirror, useMirror } from "../src";

describe("Component", (): void => {
    it("frames an empty reflection", (): void => {
        expect(<Mirror reflect={null} />).toMatchSnapshot();
    });
});

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
