import * as React from "react";
import { UseWindowProps, useWindow } from "../hooks/useWindow";
import { usePortal } from "../hooks/usePortal";

export type WindowProps = React.PropsWithChildren<UseWindowProps>;

export function Window({ children, ...windowProps }: WindowProps): JSX.Element {
  const portalWindow = useWindow(windowProps);

  const portal = usePortal({
    source: children,
    target: portalWindow?.document.body,
  });

  return <>{portal}</>;
}
