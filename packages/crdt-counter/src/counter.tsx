import { FC, useEffect, useRef, useState } from "react";

export const Counter: FC = () => {
  const [count, setCount] = useState(0);
  const op = useRef<(() => void) | null>(null);

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={() => op.current && op.current()}>+1</button>
    </>
  );
};
