import * as React from "react";

import { useObserver } from "../hooks/useObserver";
import { getAllStyleRules } from "../utils/dom";
import { IFrame, IFrameProps } from "./IFrame";
import { Style } from "./Styles";

export type FrameProps = Omit<IFrameProps, "getMountNode">;

/**
 * Used to wrap and isolate reflection from rest of document
 */
export function Frame({ children, style, ...frameProps }: FrameProps) {
  return (
    <IFrame
      frameBorder="none"
      scrolling="no"
      style={{ border: "none", ...style }}
      {...frameProps}
    >
      <FrameStyles />
      {children}
    </IFrame>
  );
}

/**
 * Styling used to keep the mirror frame in-sync with document
 */
export function FrameStyles() {
  return (
    <>
      <ResetStyle />
      <DocumentStyle />
    </>
  );
}

/**
 * Copy of the current document style sheets to be used in framing
 */
function DocumentStyle() {
  const [rules, setRules] = React.useState(getAllStyleRules);

  const onUpdate = React.useCallback(
    function updateRules() {
      const newRules = getAllStyleRules();
      if (JSON.stringify(rules) === JSON.stringify(newRules)) return;
      setRules(newRules);
    },
    [rules],
  );

  useObserver({
    ObserverClass: MutationObserver,
    onUpdate,
    initOptions: {
      attributeFilter: ["class"],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    },
    target: window.document,
  });

  return <Style id="parent-document-mirror-stylesheets" rules={rules} />;
}

/**
 * https://www.webfx.com/blog/web-design/should-you-reset-your-css
 */
function ResetStyle() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
      />
      <Style id="reset-frame" rules={["html { overflow: hidden }"]} />
    </>
  );
}
