import * as React from "react";

export interface UseWindowProps {
  /** Window features https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures */
  features?: {
    popup?: true | 1 | "yes";
    height?: number;
    innerHeight?: number;
    left?: number;
    screenX?: number;
    noopener?: true;
    noreferrer?: true;
    top?: number;
    screenY?: number;
    width?: number;
    innerWidth?: number;
  };
  onClose?: () => void;
  target?: string;
  url?: string;
}

export function useWindow({
  url = "",
  features = {},
  target,
  onClose = () => undefined,
}: UseWindowProps) {
  return React.useMemo(() => {
    const featureList = Object.entries(features)
      .map(
        ([prop, value]) =>
          prop + (typeof value === "number" ? `=${value}` : ""),
      )
      .sort()
      .join(",");
    const wndo = window.open(url, target, featureList);
    if (wndo) wndo.onbeforeunload = onClose;
    return wndo;
  }, [features, onClose, target, url]);
}
