import "./mocks/DOMRect";
import "./mocks/Range";
import "./mocks/ResizeObserver";

import { configure } from "@testing-library/react";

configure({ testIdAttribute: "data-test-id" });
