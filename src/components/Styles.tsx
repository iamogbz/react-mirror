import * as React from "react";
import { ElementProps } from "./Element";

interface StyleProps extends ElementProps<"style"> {
    rules: string[];
}

export function Style({ rules, ...styleProps }: StyleProps) {
    return <style {...styleProps}>{rules}</style>;
}
