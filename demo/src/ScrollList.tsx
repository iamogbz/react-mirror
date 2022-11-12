import * as React from "react";

export function ScrollList() {
  return (
    <div style={{ height: "64px", overflowY: "scroll" }}>
      {Array.from(new Array(10)).map((_, i) => (
        <div key={`item-${i}`} style={{ height: "20px" }}>
          Item {i}
        </div>
      ))}
    </div>
  );
}
