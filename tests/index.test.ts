import { helloWorld } from "../src";

describe("entry", (): void => {
    it("runs a test", (): void => {
        expect(helloWorld()).toMatchSnapshot();
    });
});
