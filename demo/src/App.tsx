import "./styles.css";

import * as React from "react";
import {
  FrameStyles,
  Reflection,
  useDimensions,
  useMirror,
  useRefs,
  Window,
} from "react-mirror";

import { Clock } from "./Clock";
import { ScrollList } from "./ScrollList";

export default function App(): JSX.Element {
  const [usingPortal, setUsingPortal] = React.useState(false);
  const [ref, mirror] = useMirror({ className: "Frame" });
  const [target, setTarget] = useRefs<HTMLDivElement>(ref);
  const dimensions = useDimensions(target);

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
        <div className="Frame" ref={setTarget}>
          <input className="Input" placeholder="type something..." />
          <div style={{ padding: 10 }}>Mirror mirror in my dom</div>
          <Clock />
          <ScrollList />
        </div>

        {usingPortal ? (
          <Window
            target="React Mirror Portal Test"
            features={{
              innerWidth: dimensions?.width ?? 400,
              innerHeight: dimensions?.height ?? 400,
            }}
            onClose={(): void => setUsingPortal(false)}
          >
            <FrameStyles />
            <Reflection real={target} style={{ pointerEvents: "none" }} />
          </Window>
        ) : (
          mirror
        )}
      </div>
    </div>
  );
}
