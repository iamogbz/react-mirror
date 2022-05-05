import * as React from "react";
import { ElementProps } from "./Element";

interface StylesProps {
    sheetList: StyleSheetList;
}

export function Styles({ sheetList }: StylesProps) {
    const sheets = React.useMemo(() => {
        return Array.from(sheetList).map((sheet, i) => {
            return <StyleSheet key={i} sheet={sheet} />;
        });
    }, [sheetList]);

    return <>{sheets}</>;
}

interface StyleSheetProps {
    sheet: CSSStyleSheet;
}

function StyleSheet({ sheet }: StyleSheetProps) {
    const rules = React.useMemo(
        () => Array.from(sheet.cssRules).map((rule) => rule.cssText),
        [sheet],
    );

    return (
        <Style
            media={sheet.media.mediaText}
            title={sheet.title ?? undefined}
            type={sheet.type}
            rules={rules}
        />
    );
}

interface StyleProps extends ElementProps<"style"> {
    rules: string[];
}

export function Style({ rules, ...styleProps }: StyleProps) {
    return <style {...styleProps}>{rules}</style>;
}
