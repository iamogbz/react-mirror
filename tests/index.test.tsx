import * as React from "react";
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
        expect(result.current[1]).toMatchSnapshot();
    });
});
