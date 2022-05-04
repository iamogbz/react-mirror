import * as React from "react";

interface StylesProp {
    sheetList: StyleSheetList;
}

export function Styles({ sheetList }: StylesProp) {
    const sheets = React.useMemo(() => {
        return Array.from(sheetList).map((sheet, i) => {
            return <StyleSheet key={i} sheet={sheet} />;
        });
    }, [sheetList]);

    return <>{sheets}</>;
}

interface StyleSheetProp {
    sheet: CSSStyleSheet;
}

function StyleSheet({ sheet }: StyleSheetProp) {
    const rules = React.useMemo(
        () => Array.from(sheet.cssRules).map((rule) => rule.cssText),
        [sheet],
    );

    return (
        <style
            media={sheet.media.mediaText}
            title={sheet.title ?? undefined}
            type={sheet.type}
        >
            {rules}
        </style>
    );
}
