import { configure } from "@testing-library/react";
import "./mocks/DOMRect";
import "./mocks/Range";
import "./mocks/ResizeObserver";

configure({ testIdAttribute: "data-test-id" });
