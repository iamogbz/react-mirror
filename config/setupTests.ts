import { configure } from "@testing-library/react";
import "./mocks/DOMRect";
import "./mocks/ResizeObserver";

configure({ testIdAttribute: "data-test-id" });
