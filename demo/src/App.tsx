import * as React from "react";
import { useMirror } from "react-mirror";
import "./styles.css";

function Clock(): JSX.Element {
    const [time, setTime] = React.useState(Date.now());
    React.useEffect(() => {
        const timeout = setTimeout(() => setTime(Date.now()), 300);
        return (): void => clearTimeout(timeout);
    }, [time, setTime]);
    return <div>{time}</div>;
}

export default function App(): JSX.Element {
    const [ref, reflection] = useMirror();
    return (
        <>
            <div className="App" ref={ref}>
                <h1>Hello CodeSandbox</h1>
                <h2>Start editing to see some magic happen!</h2>
                <input />
                <Clock />
            </div>
            {reflection}
        </>
    );
}
