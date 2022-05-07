import * as React from "react";
import { useMirror } from "react-mirror";
import { Window } from "./Window";
import { Clock } from "./Clock";
import "./styles.css";

export default function App(): JSX.Element {
    const [usingPortal, setUsingPortal] = React.useState(false);
    const [ref, reflection] = useMirror({ className: "Frame" });
    return (
        <div className="App">
            <h1>React Mirror Demo</h1>
            <button
                className="Button"
                disabled={usingPortal}
                onClick={(): void => setUsingPortal(true)}
            >
                Start thinking with portals!
            </button>

            <div className="Demo">
                <div className="Frame" ref={ref}>
                    <input className="Input" placeholder="type something..." />
                    <div style={{ padding: 10 }}>Mirror mirror in my dom</div>
                    <Clock />
                </div>

                {usingPortal ? (
                    <Window onClose={(): void => setUsingPortal(false)}>
                        {reflection}
                    </Window>
                ) : (
                    reflection
                )}
            </div>
        </div>
    );
}
