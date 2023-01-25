import { FC, useEffect, useRef, useState } from "react";
import connection from "./client";

export const Counter: FC = () => {
  const [count, setCount] = useState(0);
  const op = useRef<(() => void) | null>(null);

  useEffect(() => {
    const { unbind, increase } = connection.bind(setCount);
    op.current = increase;
    return () => unbind();
  }, []);

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={() => op.current && op.current()}>+1</button>
    </>
  );
};
