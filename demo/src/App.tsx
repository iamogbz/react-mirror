import * as React from "react";
import { useMirror } from "react-mirror";
import { Clock } from "./clock";
import "./styles.css";

export default function App(): JSX.Element {
    const [ref, reflection] = useMirror();
    return (
        <>
            <div className="App" ref={ref}>
                <h1>React Mirror Demo</h1>
                <input className="Input" placeholder="type something..." />
                <Clock />
            </div>
            {reflection}
        </>
    );
}
