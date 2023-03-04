import { FC, useEffect, useState } from "react";
import connection from "./client";

export const Counter: FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    connection.bind(e => {
      const value = Object.values(e).reduce((acc, v) => acc + v, 0);
      setCount(value);
    });
  }, []);

  const onClick = () => {
    setCount(count + 1);
    connection.increase();
  };

  return (
    <>
      <input type="text" disabled value={"id: " + connection.id} />
      <div>Count: {count}</div>
      <button onClick={onClick}>+1</button>
    </>
  );
};
