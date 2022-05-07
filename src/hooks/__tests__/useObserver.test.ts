import { renderHook } from "@testing-library/react-hooks";
import { useObserver, UseObserverProps } from "../useObserver";

const observerMock = {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
};
const newObserverMock = (_: CallableFunction) => observerMock;
const ObserverMock = jest.fn(newObserverMock);

describe("useObserver", () => {
    const renderUseObserver = (
        initialProps: UseObserverProps<typeof ObserverMock>,
    ) => {
        const useObserverHook = (
            props?: Partial<UseObserverProps<typeof ObserverMock>>,
        ) => {
            return useObserver({ ...initialProps, ...props });
        };
        return renderHook(useObserverHook);
    };

    const getTargetMock = () => {
        const target = document.createElement("div");
        const spyOnProps = ["addEventListener", "removeEventListener"] as const;
        return {
            target,
            spies: Object.fromEntries(
                spyOnProps.map((prop) => [prop, jest.spyOn(target, prop)]),
            ),
        };
    };

    beforeEach(() => {
        ObserverMock.mockImplementation(newObserverMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("successfully does nothing if target is null", async () => {
        const onUpdate = jest.fn();
        const hook = renderUseObserver({
            ObserverClass: ObserverMock,
            onEvents: new Set(["mousemove"]),
            onUpdate,
        });
        expect(ObserverMock).toHaveBeenCalledTimes(1);
        expect(ObserverMock).toHaveBeenLastCalledWith(onUpdate);

        hook.rerender(); // no prop changes, do not reinstantiate observer
        expect(ObserverMock).toHaveBeenCalledTimes(1);

        const onUpdateNew = jest.fn();
        hook.rerender({ onUpdate: onUpdateNew });
        expect(ObserverMock).toHaveBeenCalledTimes(2);
        expect(ObserverMock).toHaveBeenLastCalledWith(onUpdateNew);

        expect(observerMock.observe).not.toHaveBeenCalled();

        hook.unmount();
        expect(observerMock.disconnect).not.toHaveBeenCalled();
    });

    it("observes target using provided class", async () => {
        const { target, spies } = getTargetMock();
        const onUpdate = jest.fn();
        const onEvents = ["click", "keyup"] as const;
        const initOptions = {
            characterData: true,
        };

        const hook = renderUseObserver({
            ObserverClass: ObserverMock,
            initOptions,
            onUpdate,
            target,
        });

        expect(ObserverMock).toHaveBeenCalledTimes(1);
        expect(ObserverMock).toHaveBeenLastCalledWith(onUpdate);
        expect(observerMock.observe).toHaveBeenCalledTimes(1);
        expect(observerMock.observe).toHaveBeenLastCalledWith(
            target,
            initOptions,
        );
        expect(observerMock.disconnect).not.toHaveBeenCalled();
        expect(spies.addEventListener).not.toHaveBeenCalled();

        hook.rerender({ onEvents: new Set(onEvents) });
        expect(spies.addEventListener).toHaveBeenCalledTimes(onEvents.length);
        onEvents.forEach((event) => {
            expect(spies.addEventListener).toHaveBeenCalledWith(
                event,
                onUpdate,
                false,
            );
        });

        hook.unmount();
        expect(observerMock.disconnect).toHaveBeenCalledTimes(1);
        expect(spies.removeEventListener).toHaveBeenCalledTimes(
            onEvents.length,
        );
        onEvents.forEach((event) => {
            expect(spies.removeEventListener).toHaveBeenCalledWith(
                event,
                onUpdate,
                false,
            );
        });
    });
});
