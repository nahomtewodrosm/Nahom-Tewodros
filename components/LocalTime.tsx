"use client";

import { useEffect, useState } from "react";

export default function LocalTime() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };

    updateTime();
    const interval = window.setInterval(updateTime, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  return <span aria-label={`Current local time: ${time}`}>{time}</span>;
}
