import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "@/lib/helpers/date-functions";

export function useElapsedTime(startTime: string | null | undefined) {
  const [elapsed, setElapsed] = useState("00:00:00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!startTime) {
      setElapsed("00:00:00");
      return;
    }

    function tick() {
      const diff = Math.max(
        0,
        Math.floor((Date.now() - new Date(startTime as string).getTime()) / 1000),
      );
      setElapsed(formatSeconds(diff));
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTime]);

  return elapsed;
}
