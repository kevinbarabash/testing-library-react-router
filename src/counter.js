import * as React from "react";

export const Counter = () => {
    const [count1, setCount1] = React.useState(0);
    const [count2, setCount2] = React.useState(1);

    return <div id="counter">
        Count = {count1}, Count2 = {count2}
    </div>
}
Counter.displayName = "Counter";
