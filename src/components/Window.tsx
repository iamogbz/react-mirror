import * as React from "react";

import { usePortal } from "../hooks/usePortal";
import { useWindow, UseWindowProps } from "../hooks/useWindow";

export type WindowProps = React.PropsWithChildren<UseWindowProps>;

export function Window({ children, ...windowProps }: WindowProps): JSX.Element {
  const portalWindow = useWindow(windowProps);

  const portal = usePortal({
    source: children,
    target: portalWindow?.document.body,
  });

  return <>{portal}</>;
}
