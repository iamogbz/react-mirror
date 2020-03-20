import * as React from "react";

function useCurrent(): Date {
    const [date, setDate] = React.useState(new Date());
    React.useEffect(() => {
        const timeout = setTimeout(() => setDate(new Date()), 300);
        return (): void => clearTimeout(timeout);
    }, [date, setDate]);
    return date;
}

export function Clock(): JSX.Element {
    const date = useCurrent();
    const ratios = {
        Second: date.getSeconds() / 60,
        Minute: date.getMinutes() / 60,
        Hour: (date.getHours() % 12) / 12,
    };
    return (
        <div className="Clock Face">
            {Object.entries(ratios).map(([cls, ratio]) => (
                <span
                    key={cls}
                    className={`Clock Hand ${cls}`}
                    style={{ transform: `rotate(${ratio * 360}deg)` }}
                ></span>
            ))}
        </div>
    );
}
