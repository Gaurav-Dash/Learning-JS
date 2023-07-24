import React, { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("in body");
    const interval = setInterval(() => {
      console.log("in the counter");
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log("In the return");
      clearInterval(interval);
    };
  }, [count]);
  return <div style={{ textAlign: "center" }}>{count}</div>;
}

export default Counter;
