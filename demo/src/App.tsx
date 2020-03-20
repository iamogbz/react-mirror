import * as React from "react";
import { useMirror } from "react-mirror";
import { Window } from "./Window";
import { Clock } from "./Clock";
import "./styles.css";

export default function App(): JSX.Element {
    const [usingPortal, setUsingPortal] = React.useState(false);
    const [ref, reflection] = useMirror();
    return (
        <div className="App">
            <h1>React Mirror Demo</h1>
            <div ref={ref}>
                <input className="Input" placeholder="type something..." />
                <Clock />
            </div>

            <button
                className="Button"
                disabled={usingPortal}
                onClick={(): void => setUsingPortal(true)}
            >
                Start thinking with portals!
            </button>

            {usingPortal ? (
                <Window onClose={(): void => setUsingPortal(false)}>
                    {reflection}
                </Window>
            ) : (
                reflection
            )}
        </div>
    );
}
