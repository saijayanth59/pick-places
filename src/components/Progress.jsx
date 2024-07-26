import { useEffect, useState } from "react";

export default function Progress() {
  const [remainingTime, setRemainingTime] = useState(3000);
  useEffect(() => {
    console.log("Interval");
    const timer = setInterval(() => setRemainingTime((prev) => prev - 10), 10);
    return () => {
      clearInterval(timer);
      console.log("Interval cleaned");
    };
  }, []);

  return (
    <>
      <progress value={remainingTime} max={3000} />
    </>
  );
}
